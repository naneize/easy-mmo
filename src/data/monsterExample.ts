// Example usage of the new monster role system
import { MONSTERS, MonsterRole, initializeMonster, calculateBaseStats, ROLE_MULTIPLIERS } from './monsters';
import type { MonsterData } from '../types/game';

// Example: Get a monster and initialize it with calculated stats
const slimeData = MONSTERS.find(m => m.id === 'm-01')!;
const initializedSlime = initializeMonster(slimeData);

console.log('Level 1 Slime (NORMAL):', {
    name: initializedSlime.name,
    level: initializedSlime.level,
    role: initializedSlime.role,
    hp: initializedSlime.hp,
    atk: initializedSlime.atk,
    def: initializedSlime.def,
    exp: initializedSlime.exp
});

// Example: Compare different roles at same level
const level10Base = calculateBaseStats(10);
console.log('\nBase stats at level 10:', level10Base);

console.log('\nRole multipliers at level 10:');
Object.entries(ROLE_MULTIPLIERS).forEach(([role, multipliers]) => {
    const stats = {
        hp: Math.floor(level10Base.hp * multipliers.hp),
        atk: Math.floor(level10Base.atk * multipliers.atk),
        def: Math.floor(level10Base.def * multipliers.def),
        exp: Math.floor(level10Base.exp * multipliers.exp)
    };
    console.log(`${role}:`, stats);
});

// Example: Boss vs Normal comparison
const bossData = MONSTERS.find(m => m.id === 'boss-01')!;
const initializedBoss = initializeMonster(bossData);

console.log('\nBoss vs Normal comparison (Level 15):');
console.log('Boss Dragon:', {
    hp: initializedBoss.hp,
    atk: initializedBoss.atk,
    def: initializedBoss.def,
    exp: initializedBoss.exp
});

// Create a normal level 15 monster for comparison
const normalLevel15Data: MonsterData = {
    ...MONSTERS.find(m => m.id === 'm-14')!,
    id: 'custom-normal-15',
    name: 'Custom Normal Monster',
    level: 15,
    role: MonsterRole.NORMAL,
    hp: 0, // Will be calculated
    maxHp: 0, // Will be calculated
    atk: 0, // Will be calculated
    def: 0, // Will be calculated
    exp: 0, // Will be calculated
    element: 'Neutral',
    gold: 100,
    masteryBonus: { type: 'maxHp', valuePerTier: 5 }
};

const initializedNormal = initializeMonster(normalLevel15Data);
console.log('Normal Monster (Level 15):', {
    hp: initializedNormal.hp,
    atk: initializedNormal.atk,
    def: initializedNormal.def,
    exp: initializedNormal.exp
});
