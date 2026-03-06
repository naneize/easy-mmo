import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/useGameStore';
import { ITEMS } from '../data/items';
import type { ItemType } from '../types/game';
import {
  Package, Shield, Sword, Sparkles, XCircle,
  Lock, Filter, Layers, Hammer
} from 'lucide-react';

// กำหนดประเภท Rarity สำหรับ Filter
type RarityFilter = 'All' | 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
type MainTab = 'equipment' | 'materials' | 'consumables';

export function InventoryPage() {
  const { t } = useTranslation();
  const { inventory, equipped, equipItem, unequipItem, getDerivedStats, player } = useGameStore();
  const finalStats = getDerivedStats();

  // --- State สำหรับ Filtering ---
  const [activeTab, setActiveTab] = useState<MainTab>('equipment');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('All');

  // ดึงข้อมูลไอเทมที่สวมใส่อยู่
  const currentWeapon = equipped.weapon ? ITEMS[equipped.weapon] : null;
  const currentArmor = equipped.armor ? ITEMS[equipped.armor] : null;
  const currentAccessory = equipped.accessory ? ITEMS[equipped.accessory] : null;

  // --- Logic การกรองไอเทม ---
  const allItems = inventory.map(id => ITEMS[id]).filter(Boolean);

  const filteredItems = allItems.filter(item => {
    if (activeTab === 'materials') {
      return item.type === 'material' as ItemType;
    } else {
      // กรองเฉพาะอุปกรณ์
      const isEquip = ['weapon', 'armor', 'accessory'].includes(item.type);
      const matchRarity = rarityFilter === 'All' || item.rarity === rarityFilter;
      return isEquip && matchRarity;
    }
  });

  return (

    <div className="space-y-6">

      {/* --- 1. Total Power (Top - ย้ายมาไว้บนสุด) --- */}
      <div className="rounded-3xl bg-slate-900 p-5 sm:p-6 text-white shadow-xl">
        <div className="mb-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400">{t('inventory.totalCombatPower')}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[9px] sm:text-[10px] font-bold text-sky-400 uppercase">{t('attack')}</div>
            <div className="text-xl sm:text-2xl font-black">{finalStats.atk}</div>
          </div>
          <div>
            <div className="text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase">{t('defense')}</div>
            <div className="text-xl sm:text-2xl font-black">{finalStats.def}</div>
          </div>
          <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t border-slate-800 sm:border-0 sm:pl-4 sm:border-l sm:border-slate-800">
            <div className="text-[9px] sm:text-[10px] font-bold text-rose-400 uppercase">{t('maxHealth')}</div>
            <div className="text-xl sm:text-2xl font-black">{finalStats.maxHp}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* --- Section 1: Equipment & Stats (Left on PC, Top on Mobile) --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800 uppercase italic">
              <Shield className="text-sky-500" size={20} /> {t('inventory.currentGear')}
            </h2>

            <div className="grid gap-4">
              {[
                { type: 'weapon' as const, item: currentWeapon, icon: <Sword size={18} />, label: t('inventory.weapon') },
                { type: 'armor' as const, item: currentArmor, icon: <Shield size={18} />, label: t('inventory.armor') },
                { type: 'accessory' as const, item: currentAccessory, icon: <Sparkles size={18} />, label: t('inventory.accessory') }
              ].map((slot) => {
                const rarityClass = slot.item?.rarity === 'Legendary' ? 'border-amber-400 shadow-amber-100' :
                  slot.item?.rarity === 'Epic' ? 'border-purple-400 shadow-purple-100' :
                    slot.item?.rarity === 'Rare' ? 'border-sky-400 shadow-sky-100' :
                      slot.item ? 'border-slate-200' : 'border-slate-100';

                return (
                  <div
                    key={slot.type}
                    className="group relative flex items-center gap-3 sm:gap-4 rounded-2xl border-2 border-dashed border-slate-100 p-3 sm:p-4 transition-all hover:border-sky-100 hover:bg-sky-50/30"
                  >
                    <div className={`grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-xl text-xl sm:text-2xl shadow-sm transition-transform group-hover:scale-105 ${slot.item ? `bg-white border-2 ${rarityClass}` : 'bg-slate-50 text-slate-300'}`}>
                      {slot.item ? slot.item.icon : slot.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">{slot.label}</div>
                        {slot.item?.passive && (
                          <span className="text-[7px] sm:text-[8px] font-black text-purple-500 uppercase">{t('inventory.passiveActive')}</span>
                        )}
                      </div>
                      <div className={`truncate font-black text-sm sm:text-base ${slot.item ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                        {slot.item?.name || t('inventory.emptySlot')}
                      </div>
                      {slot.item?.stats && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] sm:text-[10px] font-bold">
                          {/* --- 1. แสดง Stats ปกติ (ATK, HP, DEF) --- */}
                          {Object.entries(slot.item.stats).map(([key, value]) => {
                            if (!value) return null;
                            const statKey = key.toLowerCase();
                            const statColors: Record<string, string> = {
                              hp: 'text-emerald-500',
                              maxhp: 'text-emerald-500',
                              atk: 'text-rose-500',
                              def: 'text-sky-500',
                            };
                            const displayName = statKey === 'maxhp' ? 'MAXHP' : statKey.toUpperCase();
                            return (
                              <span key={key} className={statColors[statKey] || 'text-slate-500'}>
                                +{value} {displayName}
                              </span>
                            );
                          })}

                          {/* --- 2. แสดง Passive Skill (ดูดเลือด, ฯลฯ) --- */}
                          {slot.item.passive && (
                            <span className="text-fuchsia-400 flex items-center gap-1">
                              <span className="text-[8px]">✨</span>
                              {/* แสดงชื่อสกิล */}
                              <span>{slot.item.passive.name}</span>

                              {/* เช็คถ้าเป็นสาย lifesteal ให้แสดงคำอธิบายเพิ่ม */}
                              {slot.item.passive.target === 'lifesteal' && (
                                <span className="ml-1 opacity-90">
                                  {t('inventory.lifestealDescription', { value: slot.item.passive.value })}
                                </span>
                              )}

                              {/* กรณี passive อื่นๆ ในอนาคต (ถ้ามี) */}
                              {slot.item.passive.target !== 'lifesteal' && (
                                <span>({slot.item.passive.value})</span>
                              )}
                            </span>
                          )}
                        </div>

                      )}
                    </div>

                    {/* แก้ไขปุ่ม Unequip ในส่วน Current Gear */}
                    {slot.item && (
                      <button
                        onClick={() => unequipItem(slot.type)}
                        className="absolute -right-1 -top-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white shadow-lg hover:bg-rose-600 hover:scale-105 transition-all z-20 border-2 border-white group/btn"
                      >
                        <XCircle size={10} className="group-hover/btn:rotate-90 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">{t('inventory.unequip')}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


        </div>

        {/* --- Section 2: Inventory List (Right on PC, Bottom on Mobile) --- */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit overflow-x-auto">
            <button
              onClick={() => { setActiveTab('equipment'); setRarityFilter('All'); }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-black uppercase transition-all whitespace-nowrap ${activeTab === 'equipment' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Sword size={16} /> {t('inventory.myCollection')}
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-black uppercase transition-all whitespace-nowrap ${activeTab === 'materials' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Hammer size={16} /> {t('inventory.resources')}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm min-h-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-black text-slate-800 uppercase italic">
                <Package className="text-sky-500" size={20} />
                {activeTab === 'equipment' ? t('inventory.myCollection') : t('inventory.resources')} ({filteredItems.length})
              </h2>

              {activeTab === 'equipment' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                  <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
                  {(['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as RarityFilter[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRarityFilter(r)}
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border-2 transition-all whitespace-nowrap shrink-0
                      ${rarityFilter === r
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                    >
                      {t(`${r.toLowerCase()}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Layers size={48} className="mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-sm">{t('inventory.noItemsFound')}</p>
                <p className="text-xs">ไม่พบไอเทมในหมวดหมู่นี้</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-1 xl:grid-cols-2">
                {filteredItems.map((item, index) => {
                  const isEquipable = ['weapon', 'armor', 'accessory'].includes(item.type);
                  const itemType = item.type as keyof typeof equipped;
                  const isEquipped = isEquipable && equipped[itemType] === item.id;
                  const isLocked = player.level < (item.minLevel || 0);

                  return (
                    <div
                      key={`${item.id}-${index}`}
                      className={`flex items-center gap-3 sm:gap-4 rounded-2xl border-2 p-3 sm:p-4 transition-all ${isEquipped
                        ? 'border-sky-500 bg-sky-50/50 shadow-md shadow-sky-100'
                        : isLocked
                          ? 'border-slate-100 bg-slate-50/50 opacity-80'
                          : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                        }`}
                    >
                      <div className={`text-2xl sm:text-3xl ${isLocked && !isEquipped ? 'grayscale opacity-50' : ''}`}>
                        {item.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`truncate font-black uppercase tracking-tight text-xs sm:text-sm ${isLocked && !isEquipped ? 'text-slate-400' : 'text-slate-800'}`}>
                          {item.name}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className={`text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded border uppercase
                          ${item.rarity === 'Epic' ? 'border-purple-200 bg-purple-50 text-purple-600' :
                              item.rarity === 'Rare' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                                item.rarity === 'Legendary' ? 'border-amber-200 bg-amber-50 text-amber-600' :
                                  'border-slate-200 bg-slate-50 text-slate-500'}`}>
                            {t(`inventory.${item.rarity.toLowerCase()}`)}
                          </span>

                          {isLocked && (
                            <span className="flex items-center gap-0.5 text-[8px] sm:text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 uppercase">
                              <Lock size={10} /> Lv.{item.minLevel}
                            </span>
                          )}

                          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                            {/* --- 1. ส่วนแสดง Stats พื้นฐาน (เหมือนเดิม) --- */}
                            {item.stats && Object.entries(item.stats).map(([key, value]) => {
                              if (!value) return null;
                              const statKey = key.toLowerCase();
                              const statColors: Record<string, string> = {
                                hp: 'text-emerald-500',
                                maxhp: 'text-emerald-500',
                                atk: 'text-rose-500',
                                def: 'text-sky-500',
                              };
                              const displayName = (statKey === 'maxhp' || statKey === 'hp') ? 'MAXHP' : statKey.toUpperCase();
                              return (
                                <span key={key} className={`text-[9px] sm:text-[10px] font-bold ${statColors[statKey] || 'text-slate-500'}`}>
                                  +{value} {displayName}
                                </span>
                              );
                            })}

                            {/* --- 2. ส่วนแสดง Passive ดูดเลือด (เพิ่มเข้าไป) --- */}
                            {item.passive && (
                              <span className="text-[9px] sm:text-[10px] font-bold text-fuchsia-500 bg-fuchsia-50 px-1.5 rounded border border-fuchsia-100 flex items-center gap-1">
                                <span className="text-[8px]">✨</span>
                                {item.passive.name}
                                {/* เช็คถ้าเป็น lifesteal ให้แสดงค่า % ต่อท้าย */}
                                {item.passive.target === 'lifesteal' && (
                                  <span className="text-fuchsia-600">+{item.passive.value}% {t('global.lifesteal')}</span>
                                )}
                              </span>
                            )}

                            {/* --- 3. ส่วนแสดง Material (เหมือนเดิม) --- */}
                            {item.type === 'material' && (
                              <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 bg-amber-50 px-2 rounded-full border border-amber-100">
                                {t('inventory.resource')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isEquipable && (
                        <button
                          onClick={() => !isEquipped && !isLocked && equipItem(item.id)}
                          disabled={isEquipped || isLocked}
                          className={`rounded-xl px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${isEquipped
                            ? 'bg-sky-500 text-white cursor-default'
                            : isLocked
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white shadow-sm'
                            }`}
                        >
                          {isEquipped ? t('inventory.equipped') : isLocked ? t('inventory.locked') : t('ui.equip')}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}