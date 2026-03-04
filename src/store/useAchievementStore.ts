import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MONSTERS } from '../data/monsters';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    targetValue: number;
    currentValue: number;
    isUnlocked: boolean;
    category: 'combat' | 'gold' | 'mastery';
    // 🚩 เพิ่มเพื่อระบุเงื่อนไขแบบฉลาด
    condition: {
        type: 'total_kills' | 'specific_monster' | 'gold' | 'kill_all_types';
        targetId?: string; // ใส่ ID มอนสเตอร์ถ้าเลือกแบบ specific_monster
    };
}

interface AchievementState {
    achievements: Achievement[];
    updateProgress: (id: string, value: number) => void;
    checkAchievements: (monsterKills: Record<string, number>, gold: number) => string[];
}

export const useAchievementStore = create<AchievementState>()(
    persist(
        (set, get) => ({
            achievements: [
                {
                    id: 'first_blood',
                    title: 'First Blood',
                    description: 'ปราบมอนสเตอร์ตัวแรก',
                    icon: '⚔️',
                    targetValue: 1,
                    currentValue: 0,
                    isUnlocked: false,
                    category: 'combat',
                    condition: { type: 'total_kills' }
                },
                {
                    id: 'gold_miner',
                    title: 'Gold Miner',
                    description: 'สะสมเงินครบ 1,000 Gold',
                    icon: '💰',
                    targetValue: 1000,
                    currentValue: 0,
                    isUnlocked: false,
                    category: 'gold',
                    condition: { type: 'gold' }
                },
                {
                    id: 'slime_hunter',
                    title: 'Slime Hunter',
                    description: 'ปราบ Slime ครบ 50 ตัว',
                    icon: '🧪',
                    targetValue: 50,
                    currentValue: 0,
                    isUnlocked: false,
                    category: 'combat',
                    condition: { type: 'specific_monster', targetId: 'm-01' }
                },
                {
                    id: 'monster_collector',
                    title: 'Monster Collector',
                    description: `ปราบมอนสเตอร์ครบทุกสายพันธุ์ (${MONSTERS.length} ชนิด)`,
                    icon: '📖',
                    targetValue: MONSTERS.length,
                    currentValue: 0,
                    isUnlocked: false,
                    category: 'combat',
                    condition: { type: 'kill_all_types' }
                },
            ],

            updateProgress: (id, value) => set((state) => ({
                achievements: state.achievements.map(a =>
                    a.id === id ? { ...a, currentValue: value } : a
                )
            })),

            checkAchievements: (monsterKills, gold) => {
                const state = get();
                const newlyUnlocked: string[] = [];

                // คำนวณค่าสถิติล่วงหน้าครั้งเดียว เพื่อประสิทธิภาพ
                const totalKills = Object.values(monsterKills).reduce((a, b) => a + b, 0);
                const uniqueMonstersKilled = Object.keys(monsterKills).length;

                const updated = state.achievements.map(a => {
                    if (a.isUnlocked) return a;

                    let current = 0;

                    // 🚩 ใช้ Switch Case จัดการเงื่อนไขแบบ Dynamic
                    switch (a.condition.type) {
                        case 'total_kills':
                            current = totalKills;
                            break;
                        case 'gold':
                            current = gold;
                            break;
                        case 'specific_monster':
                            current = monsterKills[a.condition.targetId || ''] || 0;
                            break;
                        case 'kill_all_types':
                            current = uniqueMonstersKilled;
                            break;
                    }

                    if (current >= a.targetValue) {
                        newlyUnlocked.push(a.title);
                        return { ...a, currentValue: current, isUnlocked: true };
                    }
                    return { ...a, currentValue: current };
                });

                set({ achievements: updated });
                return newlyUnlocked;
            }
        }),
        { name: 'game-achievements' }
    )
);