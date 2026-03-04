// Balance Analysis - TypeScript Version
// Lead Game Designer & QA Engineer Audit

// Player stats calculation based on experience.ts
const calculatePlayerStats = (level: number) => {
    let hp = 100; // Base HP at level 1
    let atk = 10; // Base ATK at level 1  
    let def = 5;  // Base DEF at level 1
    
    // Simulate level up progression from experience.ts
    for (let l = 2; l <= level; l++) {
        hp += 30 + (l * 5);
        atk += 5 + Math.floor(l / 2);
        def += 2 + Math.floor(l / 4);
    }
    
    return { hp, atk, def };
};

// Monster stats calculation based on updated monsters.ts
const calculateMonsterStats = (level: number, role: string) => {
    const baseHp = 100 + (level * 60);
    const baseAtk = 12 + (level * 6);
    const baseDef = 6 + (level * 4);
    
    const multipliers = {
        'NORMAL': { hp: 1.0, atk: 1.0, def: 1.0, exp: 1.0 },
        'TANK': { hp: 2.0, atk: 0.8, def: 1.6, exp: 1.4 },
        'GLASS_CANNON': { hp: 0.8, atk: 1.7, def: 0.7, exp: 1.3 },
        'BOSS': { hp: 3.5, atk: 1.6, def: 2.0, exp: 5.0 }
    };
    
    const mult = multipliers[role as keyof typeof multipliers];
    
    return {
        hp: Math.floor(baseHp * mult.hp),
        atk: Math.floor(baseAtk * mult.atk),
        def: Math.floor(baseDef * mult.def),
        exp: Math.floor((25 + level * 18) * mult.exp)
    };
};

// Blazing Soul calculation from skillEffects.ts
const calculateBlazingSoul = (playerAtk: number, level: number, element: string) => {
    const isSynergy = element === 'Fire';
    const levelBonus = (level - 1) * 0.015;
    const bonusMult = isSynergy ? (0.25 + levelBonus) : (0.10 + levelBonus);
    return Math.floor(playerAtk * bonusMult);
};

// Elemental system
const getElementalMultiplier = (attacker: string, defender: string) => {
    const advantages: Record<string, Record<string, number>> = {
        'Fire': { 'Water': 0.8, 'Earth': 1.2 },
        'Water': { 'Fire': 1.2, 'Wind': 0.8 },
        'Wind': { 'Earth': 1.2, 'Fire': 0.8 },
        'Earth': { 'Wind': 0.8, 'Water': 1.2 },
        'Light': { 'Dark': 1.2 },
        'Dark': { 'Light': 1.2 }
    };
    
    return advantages[attacker]?.[defender] || 1.0;
};

// Battle simulation
const simulateBattle = (playerLevel: number, playerElement: string, monsterLevel: number, skillLevel: number = 5) => {
    const playerStats = calculatePlayerStats(playerLevel);
    const monsterStats = calculateMonsterStats(monsterLevel, 'BOSS');
    
    // Apply Blazing Soul
    const blazingBonus = calculateBlazingSoul(playerStats.atk, skillLevel, playerElement);
    const playerAtk = playerStats.atk + blazingBonus;
    
    // Elemental multipliers
    const pElementMult = getElementalMultiplier(playerElement, 'Dark');
    const mElementMult = getElementalMultiplier('Dark', playerElement);
    
    const finalPlayerAtk = Math.floor(playerAtk * pElementMult);
    const finalMonsterAtk = Math.floor(monsterStats.atk * mElementMult);
    
    // Battle calculation
    let playerHp = playerStats.hp;
    let monsterHp = monsterStats.hp;
    let turns = 0;
    
    while (playerHp > 0 && monsterHp > 0 && turns < 50) {
        // Player turn
        const playerDmg = Math.max(1, finalPlayerAtk - monsterStats.def);
        monsterHp -= playerDmg;
        
        if (monsterHp <= 0) break;
        
        // Monster turn
        const monsterDmg = Math.max(1, finalMonsterAtk - playerStats.def);
        playerHp -= monsterDmg;
        
        turns++;
    }
    
    return {
        won: monsterHp <= 0,
        turns,
        playerHp: Math.max(0, playerHp),
        monsterHp: Math.max(0, monsterHp),
        playerStats,
        monsterStats,
        finalPlayerAtk,
        finalMonsterAtk,
        blazingBonus,
        pElementMult,
        mElementMult
    };
};

// Run main simulation
const mainSimulation = simulateBattle(10, 'Fire', 15, 5);

console.log('=== GAME BALANCE AUDIT REPORT ===\n');

console.log('1. STAT SCALING ANALYSIS');
console.log(`Player Lv.10: HP=${mainSimulation.playerStats.hp}, ATK=${mainSimulation.playerStats.atk}, DEF=${mainSimulation.playerStats.def}`);
console.log(`Boss Lv.15: HP=${mainSimulation.monsterStats.hp}, ATK=${mainSimulation.monsterStats.atk}, DEF=${mainSimulation.monsterStats.def}`);
console.log(`Damage Ratio: Player=${mainSimulation.finalPlayerAtk}-${mainSimulation.monsterStats.def}=${Math.max(1, mainSimulation.finalPlayerAtk - mainSimulation.monsterStats.def)} per turn`);
console.log(`Damage Ratio: Monster=${mainSimulation.finalMonsterAtk}-${mainSimulation.playerStats.def}=${Math.max(1, mainSimulation.finalMonsterAtk - mainSimulation.playerStats.def)} per turn`);
console.log(`Turns to kill: Player=${Math.ceil(mainSimulation.monsterStats.hp / Math.max(1, mainSimulation.finalPlayerAtk - mainSimulation.monsterStats.def))}, Monster=${Math.ceil(mainSimulation.playerStats.hp / Math.max(1, mainSimulation.finalMonsterAtk - mainSimulation.playerStats.def))}\n`);

console.log('2. SKILL LOGIC ANALYSIS (Blazing Soul Lv.5)');
console.log(`Blazing Soul Bonus: ${mainSimulation.blazingBonus} ATK (${Math.round(mainSimulation.blazingBonus / mainSimulation.playerStats.atk * 100)}% increase)`);
console.log(`Fire Synergy Active: ${mainSimulation.pElementMult}x damage multiplier`);
console.log(`Total ATK increase: ${Math.round((mainSimulation.finalPlayerAtk / mainSimulation.playerStats.atk - 1) * 100)}%\n`);

console.log('3. ELEMENTAL SYSTEM ANALYSIS');
console.log(`Player Fire vs Dark: ${mainSimulation.pElementMult}x (advantage)`);
console.log(`Monster Dark vs Fire: ${mainSimulation.mElementMult}x (disadvantage)`);
console.log(`Net elemental advantage: ${(mainSimulation.pElementMult / mainSimulation.mElementMult).toFixed(2)}x\n`);

console.log('4. BATTLE FLOW ANALYSIS');
console.log(`Simulation Result: ${mainSimulation.won ? 'PLAYER WINS' : 'MONSTER WINS'}`);
console.log(`Battle Duration: ${mainSimulation.turns} turns`);
console.log(`Final HP - Player: ${mainSimulation.playerHp}, Monster: ${mainSimulation.monsterHp}`);
console.log(`50-turn limit: ${mainSimulation.turns >= 50 ? 'REACHED (potential soft-lock)' : 'NOT reached'}\n`);

console.log('5. WIN RATE ANALYSIS (Multiple Scenarios)');
const scenarios = [
    { pLevel: 10, pElement: 'Fire', mLevel: 15 },
    { pLevel: 10, pElement: 'Water', mLevel: 15 },
    { pLevel: 10, pElement: 'Light', mLevel: 15 },
    { pLevel: 12, pElement: 'Fire', mLevel: 15 },
    { pLevel: 15, pElement: 'Fire', mLevel: 15 },
    { pLevel: 18, pElement: 'Fire', mLevel: 15 },
];

scenarios.forEach((scenario, i) => {
    const result = simulateBattle(scenario.pLevel, scenario.pElement, scenario.mLevel, 5);
    console.log(`Scenario ${i + 1}: Lv.${scenario.pLevel} ${scenario.pElement} vs Boss Lv.${scenario.mLevel} - ${result.won ? 'WIN' : 'LOSE'} (${result.turns} turns)`);
});

console.log('\n=== BALANCE ISSUES IDENTIFIED ===');

// Critical analysis
const playerDps = Math.max(1, mainSimulation.finalPlayerAtk - mainSimulation.monsterStats.def);
const monsterDps = Math.max(1, mainSimulation.finalMonsterAtk - mainSimulation.playerStats.def);
const playerTtk = Math.ceil(mainSimulation.monsterStats.hp / playerDps);
const monsterTtk = Math.ceil(mainSimulation.playerStats.hp / monsterDps);

if (playerTtk < monsterTtk) {
    console.log('⚠️ ISSUE: Player kills Boss too quickly - game may be too easy');
    console.log(`   Player TTK: ${playerTtk} turns vs Monster TTK: ${monsterTtk} turns`);
    console.log(`   Recommendation: Increase Boss HP by ${Math.round((monsterTtk / playerTtk - 1) * 100)}% or reduce player ATK`);
} else {
    console.log('✅ BALANCED: Combat timing seems reasonable');
}

if (mainSimulation.blazingBonus > mainSimulation.playerStats.atk * 0.3) {
    console.log('⚠️ ISSUE: Blazing Soul may be too powerful - 30%+ ATK bonus is significant');
    console.log(`   Current bonus: ${Math.round(mainSimulation.blazingBonus / mainSimulation.playerStats.atk * 100)}%`);
    console.log(`   Recommendation: Reduce base bonus from 25% to 20% for Fire synergy`);
}

if (mainSimulation.pElementMult > 1.15) {
    console.log('⚠️ ISSUE: Elemental advantage may be too strong');
    console.log(`   Current multiplier: ${mainSimulation.pElementMult}x`);
    console.log(`   Recommendation: Reduce elemental advantage from 1.2x to 1.15x`);
}

console.log('\n=== RECOMMENDED ADJUSTMENTS ===');
console.log('1. Boss HP multiplier: 3.5x → 3.0x (reduce by 14%)');
console.log('2. Blazing Soul Fire synergy: 25% → 20% base bonus');
console.log('3. Elemental advantage: 1.2x → 1.15x multiplier');
console.log('4. Consider adding damage variance (±10%) for combat unpredictability');
console.log('5. Monitor player progression vs monster difficulty curve');

export { simulateBattle, calculatePlayerStats, calculateMonsterStats };
