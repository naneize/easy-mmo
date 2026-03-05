import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MONSTERS } from '../data/monsters';

export interface Achievement {
    id: string;
    titleKey: string;
    descriptionKey: string;
    icon: string;
    targetValue: number;
    currentValue: number;
    isUnlocked: boolean;
    category: 'combat' | 'gold' | 'mastery';
    condition: {
        type: 'total_kills' | 'specific_monster' | 'gold' | 'kill_all_types';
        targetId?: string;
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
                    titleKey: 'achievements.firstBlood.title',
                    descriptionKey: 'achievements.firstBlood.description',
                    icon: '⚔️',
                    targetValue: 1,
                    currentValue: 0,
                    isUnlocked: false,
                    category: 'combat',
                    condition: { type: 'total_kills' }
                },
                {
                    id: 'gold_miner',
                    titleKey: 'achievements.goldMiner.title',
                    descriptionKey: 'achievements.goldMiner.description',
                    icon: '💰',
                    targetValue: 1000,
                    currentValue: 0,
                    isUnlocked: false,
                    category: 'gold',
                    condition: { type: 'gold' }
                },
                {
                    id: 'slime_hunter',
                    titleKey: 'achievements.slimeHunter.title',
                    descriptionKey: 'achievements.slimeHunter.description',
                    icon: '🧪',
                    targetValue: 50,
                    currentValue: 0,
                    isUnlocked: false,
                    category: 'combat',
                    condition: { type: 'specific_monster', targetId: 'm-01' }
                },
                {
                    id: 'monster_collector',
                    titleKey: 'achievements.monsterCollector.title',
                    descriptionKey: 'achievements.monsterCollector.description',
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

                const totalKills = Object.values(monsterKills).reduce((a, b) => a + b, 0);
                const uniqueMonstersKilled = Object.keys(monsterKills).length;

                const updated = state.achievements.map(a => {
                    if (a.isUnlocked) return a;

                    let current = 0;

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
                        newlyUnlocked.push(a.titleKey);
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