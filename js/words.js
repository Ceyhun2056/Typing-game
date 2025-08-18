// Word lists for the typing game
const WORD_LISTS = {
    easy: [
        'cat', 'dog', 'run', 'jump', 'fly', 'sky', 'sun', 'moon', 'star', 'fire',
        'car', 'bat', 'hat', 'map', 'pen', 'cup', 'egg', 'fox', 'owl', 'pig',
        'red', 'blue', 'gold', 'dark', 'warm', 'cold', 'soft', 'hard', 'new', 'old'
    ],
    
    medium: [
        'plane', 'house', 'mouse', 'horse', 'dance', 'music', 'magic', 'storm', 'cloud', 'river',
        'sword', 'shield', 'arrow', 'tower', 'castle', 'bridge', 'ocean', 'forest', 'dragon', 'knight',
        'quick', 'brave', 'smart', 'happy', 'angry', 'funny', 'scary', 'crazy', 'lucky', 'strong'
    ],
    
    hard: [
        'thunder', 'mystery', 'journey', 'victory', 'freedom', 'machine', 'science', 'crystal', 'destiny', 'harmony',
        'ancient', 'magical', 'digital', 'cosmic', 'frozen', 'golden', 'silver', 'marble', 'diamond', 'emerald',
        'warrior', 'hunter', 'wizard', 'ranger', 'paladin', 'archer', 'rogue', 'mage', 'healer', 'guardian'
    ]
};

// Function to get a random word based on difficulty
function getRandomWord(difficulty = 'easy') {
    const wordList = WORD_LISTS[difficulty] || WORD_LISTS.easy;
    return wordList[Math.floor(Math.random() * wordList.length)];
}

// Function to get a mixed difficulty word
function getRandomMixedWord(level) {
    let difficulty;
    if (level < 5) {
        difficulty = 'easy';
    } else if (level < 10) {
        difficulty = Math.random() < 0.7 ? 'easy' : 'medium';
    } else if (level < 15) {
        difficulty = Math.random() < 0.5 ? 'medium' : (Math.random() < 0.8 ? 'easy' : 'hard');
    } else {
        const rand = Math.random();
        if (rand < 0.3) difficulty = 'easy';
        else if (rand < 0.7) difficulty = 'medium';
        else difficulty = 'hard';
    }
    
    return getRandomWord(difficulty);
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WORD_LISTS, getRandomWord, getRandomMixedWord };
}