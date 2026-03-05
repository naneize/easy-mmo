export type ClassBonus = {
    atk_flat?: number;
    atk_percent?: number;
    def_flat?: number;
    def_percent?: number;
    hp_mod?: number;
    hp_percent?: number;
    lifesteal_percent?: number;
    crit_chance?: number;
    crit_multi?: number;
    armor_pen?: number;
    dmgReduction?: number;
};

export type ClassSpecialEffect = {
    id: string;
    name: string;
    nameKey: string;
    description: string;
    descriptionKey: string;
};

export type ClassElementAffinity = {
    advantageMultiplier?: number;
    disadvantageDamageTakenMultiplier?: number;
};

export type ClassDefinition = {
    id: string;
    name: string;
    nameKey: string;
    requiredSkills: [string, string, string, string];
    bonus: ClassBonus;
    specialEffect?: ClassSpecialEffect;
    elementAffinity?: ClassElementAffinity;
};

export const CLASS_DEFINITIONS: ClassDefinition[] = [
    {
        id: 'berserker',
        name: 'Berserker',
        nameKey: 'classes.berserker.name',
        requiredSkills: ['blade-dance', 'critical-strike', 'lifesteal-vamp', 'armor-penetration'],
        specialEffect: {
            id: 'bloodlust',
            name: 'โลหิตคลั่ง',
            nameKey: 'classes.berserker.specialEffect.bloodlust.name',
            description: 'เมื่อ HP เหลือน้อยกว่า 30% จะได้รับพลังโจมตีเพิ่มขึ้น 20% ทันที!',
            descriptionKey: 'classes.berserker.specialEffect.bloodlust.description'
        },
        bonus: {
            atk_percent: 0.12,
            crit_chance: 0.05,
            lifesteal_percent: 0.05
        }
    },
    {
        id: 'guardian',
        name: 'Guardian',
        nameKey: 'classes.guardian.name',
        requiredSkills: ['aegis-guard', 'stone-skin', 'earth-wall', 'holy-aura'],
        specialEffect: {
            id: 'thorns',
            name: 'หนามสะท้อน',
            nameKey: 'classes.guardian.specialEffect.thorns.name',
            description: 'มีโอกาส 10% ที่จะสะท้อนความเสียหายกลับไปยังศัตรูที่โจมตี!',
            descriptionKey: 'classes.guardian.specialEffect.thorns.description'
        },
        elementAffinity: {
            disadvantageDamageTakenMultiplier: 0.9
        },
        bonus: {
            def_percent: 0.15,
            hp_percent: 0.10,
            dmgReduction: 0.05
        }
    },
    {
        id: 'mage',
        name: 'Mage',
        nameKey: 'classes.mage.name',
        requiredSkills: ['spark-burst', 'fire-ember', 'dark-corruption', 'elemental-mastery'],
        specialEffect: {
            id: 'arcane-echo',
            name: 'เสียงเวทย้อนกลับ',
            nameKey: 'classes.mage.specialEffect.arcaneEcho.name',
            description: 'การโจมตีทุกๆ 3 เทิร์นจะสร้างความเสียหายที่รุนแรงขึ้นอย่างมหาศาล!',
            descriptionKey: 'classes.mage.specialEffect.arcaneEcho.description'
        },
        elementAffinity: {
            advantageMultiplier: 1.8
        },
        bonus: {
            atk_percent: 0.08,
            def_percent: -0.05,
            armor_pen: 0.10
        }
    }
];
