// Balance Simulation Script
// Simulate Level 10 Player with Blazing Soul Lv.5 vs Strongest Boss

// Mock data based on game files
const createPlayer = (level, element = 'Fire') => {
    // Player stats from experience.ts formula
    const hp = 100 + (level * 30) + ((level - 1) * level * 2.5); // Approx from level up formula
    const atk = 10 + (level * 5) + ((level - 1) * 3); // Approx from level up formula  
    const def = 5 + (level * 2) + ((level - 1) * 1); // Approx from level up formula

    return {
        name: 'Hero',
        level,
        element,
        hp: Math.floor(hp),
        maxHp: Math.floor(hp),
        atk: Math.floor(atk),
        def: Math.floor(def),
        gold: 0,
        exp: 0,
        maxExp: Math.floor(100 * Math.pow(1.15, level - 1)),
        skills: [],
        equipment: { weapon: null, armor: null, accessory: null }
    };
};

const createMonster = (level, role = 'BOSS') => {
    // Monster stats from updated monsters.ts formula
    const baseHp = 100 + (level * 60);
    const baseAtk = 12 + (level * 6);
    const baseDef = 6 + (level * 4);

    const multipliers = {
        'NORMAL': { hp: 1.0, atk: 1.0, def: 1.0 },
        'TANK': { hp: 2.0, atk: 0.8, def: 1.6 },
        'Vanguard': { hp: 0.8, atk: 1.7, def: 0.7 },
        'BOSS': { hp: 3.5, atk: 1.6, def: 2.0 }
    };

    const mult = multipliers[role];

    return {
        name: `Boss Lv.${level}`,
        level,
        role,
        element: 'Dark',
        hp: Math.floor(baseHp * mult.hp),
        maxHp: Math.floor(baseHp * mult.hp),
        atk: Math.floor(baseAtk * mult.atk),
        def: Math.floor(baseDef * mult.def),
        gold: level * 1000,
        exp: Math.floor((25 + level * 18) * mult.exp)
    };
};

// Blazing Soul skill effect calculation
const blazingSoulEffect = (player, level) => {
    const isSynergy = player.element === 'Fire';
    const levelBonus = (level - 1) * 0.015;
    const bonusMult = isSynergy ? (0.25 + levelBonus) : (0.10 + levelBonus);
    return bonusMult;
};

// Elemental advantage calculation
const getElementalMultiplier = (attackerElement, defenderElement) => {
    const advantages = {
        'Fire': { 'Water': 0.8, 'Earth': 1.2 },
        'Water': { 'Fire': 1.2, 'Wind': 0.8 },
        'Wind': { 'Earth': 1.2, 'Fire': 0.8 },
        'Earth': { 'Wind': 0.8, 'Water': 1.2 },
        'Light': { 'Dark': 1.2 },
        'Dark': { 'Light': 1.2 }
    };

    return advantages[attackerElement]?.[defenderElement] || 1.0;
};

// Simulate battle
const simulateBattle = (player, monster, skillLevel = 5) => {
    let playerHp = player.hp;
    let monsterHp = monster.hp;
    let turn = 1;
    const maxTurns = 50;

    // Apply Blazing Soul bonus
    const blazingBonus = blazingSoulEffect(player, skillLevel);
    const playerAtk = Math.floor(player.atk * (1 + blazingBonus));

    // Elemental multipliers
    const pElementMult = getElementalMultiplier(player.element, monster.element);
    const mElementMult = getElementalMultiplier(monster.element, player.element);

    const finalPlayerAtk = Math.floor(playerAtk * pElementMult);
    const finalMonsterAtk = Math.floor(monster.atk * mElementMult);

    console.log(`=== BATTLE SIMULATION ===`);
    console.log(`Player Lv.${player.level} (${player.element}) vs Boss Lv.${monster.level} (${monster.element})`);
    console.log(`Player ATK: ${player.atk} → ${playerAtk} (+${Math.round(blazingBonus * 100)}% Blazing Soul) → ${finalPlayerAtk} (x${pElementMult} elemental)`);
    console.log(`Monster ATK: ${monster.atk} → ${finalMonsterAtk} (x${mElementMult} elemental)`);
    console.log(`Player HP: ${playerHp} | Monster HP: ${monsterHp}`);
    console.log(`Player DEF: ${player.def} | Monster DEF: ${monster.def}`);
    console.log(``);

    while (playerHp > 0 && monsterHp > 0 && turn <= maxTurns) {
        // Player turn
        const playerDamage = Math.max(1, finalPlayerAtk - monster.def);
        monsterHp -= playerDamage;

        console.log(`Turn ${turn}: Player deals ${playerDamage} damage (Monster HP: ${Math.max(0, monsterHp)})`);

        if (monsterHp <= 0) break;

        // Monster turn  
        const monsterDamage = Math.max(1, finalMonsterAtk - player.def);
        playerHp -= monsterDamage;

        console.log(`Turn ${turn}: Monster deals ${monsterDamage} damage (Player HP: ${Math.max(0, playerHp)})`);

        turn++;
    }

    const won = monsterHp <= 0;
    const turns = turn - 1;

    console.log(``);
    console.log(`=== RESULT ===`);
    console.log(`Winner: ${won ? 'Player' : 'Monster'}`);
    console.log(`Turns: ${turns}`);
    console.log(`Final HP - Player: ${Math.max(0, playerHp)}, Monster: ${Math.max(0, monsterHp)}`);
    console.log(``);

    return { won, turns, finalPlayerHp: Math.max(0, playerHp), finalMonsterHp: Math.max(0, monsterHp) };
};

// Run simulation
const player = createPlayer(10, 'Fire');
const boss = createMonster(15, 'BOSS'); // Strongest available boss

simulateBattle(player, boss);

// Additional balance analysis
console.log(`=== BALANCE ANALYSIS ===`);

// Test different scenarios
const scenarios = [
    { playerLevel: 10, monsterLevel: 15, playerElement: 'Fire', monsterElement: 'Dark' },
    { playerLevel: 10, monsterLevel: 15, playerElement: 'Water', monsterElement: 'Dark' },
    { playerLevel: 10, monsterLevel: 15, playerElement: 'Light', monsterElement: 'Dark' },
    { playerLevel: 15, monsterLevel: 15, playerElement: 'Fire', monsterElement: 'Dark' },
    { playerLevel: 20, monsterLevel: 15, playerElement: 'Fire', monsterElement: 'Dark' },
];

console.log(`Win Rate Analysis:`);
scenarios.forEach((scenario, i) => {
    const p = createPlayer(scenario.playerLevel, scenario.playerElement);
    const m = createMonster(scenario.monsterLevel, 'BOSS');
    m.element = scenario.monsterElement;

    const result = simulateBattle(p, m);
    console.log(`Scenario ${i + 1}: Lv.${scenario.playerLevel} ${scenario.playerElement} vs Lv.${scenario.monsterLevel} ${scenario.monsterElement} - ${result.won ? 'WIN' : 'LOSE'} in ${result.turns} turns`);
});
