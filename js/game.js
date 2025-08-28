// F-16 Fighter Typing Game
class F16TypingGame {
    constructor() {
        this.gameState = 'menu'; // 'menu', 'playing', 'gameOver', 'challenge'
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemies = [];
        this.explosions = [];
        this.currentInput = '';
        this.targetEnemy = null;
        // ...existing code...
        this.combo = 0;
        this.maxCombo = 0;
        this.comboMultiplier = 1;
        this.bosses = [];
        this.currentBoss = null;
        this.lastBossScore = 0;
        this.typingStats = {
            totalWords: 0,
            correctWords: 0,
            totalCharacters: 0,
            correctCharacters: 0,
            startTime: null,
            endTime: null,
            wpm: 0,
            accuracy: 100,
            mistypedLetters: {},
            mistypedWords: {}
        };
        this.adaptiveSettings = {
            playerSpeed: 0, // WPM
            playerAccuracy: 100, // percentage
            difficultyLevel: 'easy',
            wordsCompleted: 0
        };
        this.customWordLists = {
            programming: ['function', 'variable', 'array', 'object', 'method', 'class', 'interface', 'boolean'],
            science: ['molecule', 'atom', 'gravity', 'energy', 'matter', 'physics', 'chemistry', 'biology'],
            custom: []
        };
        this.challengeMode = null; // 'speed', 'accuracy', null
        this.challengeTimer = 0;
        this.challengeScore = 0;
        this.saveData = {
            highScore: 0,
            maxLevel: 1,
            bestCombo: 0,
            bestWPM: 0,
            bestAccuracy: 0,
            totalWordsTyped: 0,
            totalGamesPlayed: 0,
            bestSpeedChallenge: 0,
            bestAccuracyChallenge: 0,
            achievementsUnlocked: [],
            lastPlayDate: null
        };
        this.gameArea = document.getElementById('gameArea');
        this.player = document.getElementById('player');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.currentWordElement = document.getElementById('currentWord');
        this.inputDisplay = document.getElementById('inputDisplay');
        this.gameMenu = document.getElementById('gameMenu');
        this.gameOver = document.getElementById('gameOver');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.enemiesContainer = document.getElementById('enemies');
        this.explosionsContainer = document.getElementById('explosions');
        this.init();
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemies = [];
        this.explosions = [];
        this.currentInput = '';
        this.targetEnemy = null;
        this.combo = 0;
        this.maxCombo = 0;
        this.comboMultiplier = 1;
        this.bosses = [];
        this.currentBoss = null;
        this.lastBossScore = 0;
        this.typingStats = {
            totalWords: 0,
            correctWords: 0,
            totalCharacters: 0,
            correctCharacters: 0,
            startTime: Date.now(),
            endTime: null,
            wpm: 0,
            accuracy: 100,
            mistypedLetters: {},
            mistypedWords: {}
        };
        this.adaptiveSettings.wordsCompleted = 0;
        this.currentWordCategory = this.currentWordCategory || 'default';
        this.gameMenu.classList.add('hidden');
        this.gameOver.classList.add('hidden');
        if (this.pauseButton) { /* ...existing code... */ }
        this.updateUI();
        this.startSpawning();
        this.startGameLoop();
        console.log('Game started');

        
        // Combo/Streak System
        this.combo = 0;
        this.maxCombo = 0;
        this.comboMultiplier = 1;
        this.streakThresholds = [3, 5, 10, 15, 20]; // Combo levels for bonuses
        this.baseBonusPoints = 10;
        
        // Typing Statistics
        this.typingStats = {
            totalWords: 0,
            correctWords: 0,
            totalCharacters: 0,
            correctCharacters: 0,
            startTime: null,
            endTime: null,
            wpm: 0,
            accuracy: 100,
            mistypedLetters: {},
            mistypedWords: {}
        };
        
        // Adaptive Word List
        this.adaptiveSettings = {
            playerSpeed: 0, // WPM
            playerAccuracy: 100, // percentage
            difficultyLevel: 'easy',
            wordsCompleted: 0
        };
        
        // Custom Dictionary
        this.customWordLists = {
            programming: ['function', 'variable', 'array', 'object', 'method', 'class', 'interface', 'boolean'],
            science: ['molecule', 'atom', 'gravity', 'energy', 'matter', 'physics', 'chemistry', 'biology'],
            custom: []
        };
        
        // Challenge modes
        this.challengeMode = null; // 'speed', 'accuracy', null
        this.challengeTimer = 0;
        this.challengeScore = 0;
        
        // Progress Save System
        this.saveData = {
            highScore: 0,
            maxLevel: 1,
            bestCombo: 0,
            bestWPM: 0,
            bestAccuracy: 0,
            totalWordsTyped: 0,
            totalGamesPlayed: 0,
            bestSpeedChallenge: 0,
            bestAccuracyChallenge: 0,
            achievementsUnlocked: [],
            lastPlayDate: null
        };
        
        // DOM elements
        this.gameArea = document.getElementById('gameArea');
        this.player = document.getElementById('player');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.currentWordElement = document.getElementById('currentWord');
        this.inputDisplay = document.getElementById('inputDisplay');
        this.gameMenu = document.getElementById('gameMenu');
        this.gameOver = document.getElementById('gameOver');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.enemiesContainer = document.getElementById('enemies');
        this.explosionsContainer = document.getElementById('explosions');
        
        this.init();
    }
    
    init() {
        // Main game buttons
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        // New feature buttons
        const speedChallengeButton = document.getElementById('speedChallengeButton');
        const accuracyChallengeButton = document.getElementById('accuracyChallengeButton');
        const customDictionaryButton = document.getElementById('customDictionaryButton');
        
        if (speedChallengeButton) {
            speedChallengeButton.addEventListener('click', () => this.startSpeedChallenge());
        }
        if (accuracyChallengeButton) {
            accuracyChallengeButton.addEventListener('click', () => this.startAccuracyChallenge());
        }
        if (customDictionaryButton) {
            customDictionaryButton.addEventListener('click', () => this.showCustomDictionary());
        }
        
        // Dictionary panel close button
        const closeDictionaryButton = document.getElementById('closeDictionaryButton');
        
        if (closeDictionaryButton) {
            closeDictionaryButton.addEventListener('click', () => this.hidePanel('customDictionaryPanel'));
        }
        
        // Custom word file upload
        const customWordFile = document.getElementById('customWordFile');
        if (customWordFile) {
            customWordFile.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.loadCustomWordList(e.target.files[0]);
                }
            });
        }
        
        // Category buttons
        const programmingWordsButton = document.getElementById('programmingWordsButton');
        const scienceWordsButton = document.getElementById('scienceWordsButton');
        const defaultWordsButton = document.getElementById('defaultWordsButton');
        
        if (programmingWordsButton) {
            programmingWordsButton.addEventListener('click', () => this.setWordCategory('programming'));
        }
        if (scienceWordsButton) {
            scienceWordsButton.addEventListener('click', () => this.setWordCategory('science'));
        }
        if (defaultWordsButton) {
            defaultWordsButton.addEventListener('click', () => this.setWordCategory('default'));
        }
        
        // Pause functionality
        if (this.pauseButton) {
            this.pauseButton.addEventListener('click', () => this.togglePause());
        }
        
        const resumeButton = document.getElementById('resumeButton');
        const mainMenuButton = document.getElementById('mainMenuButton');
        
        if (resumeButton) {
            resumeButton.addEventListener('click', () => this.togglePause());
        }
        if (mainMenuButton) {
            mainMenuButton.addEventListener('click', () => {
                this.endGame();
                this.showMainMenu();
            });
        }
        
        // Listen for keyboard input
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Initialize display
        this.updateUI();
        this.inputDisplay.textContent = '';
        
        // Load saved progress
        this.loadProgress();
        
        console.log('Game initialized with advanced features');
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemies = [];
        this.explosions = [];
        this.currentInput = '';
        this.targetEnemy = null;
        
        // Initialize combo system
        this.combo = 0;
        this.maxCombo = 0;
        this.comboMultiplier = 1;
        
        // Initialize boss system
        this.bosses = [];
        this.currentBoss = null;
        this.lastBossScore = 0;
        
        // Initialize typing statistics
        this.typingStats = {
            totalWords: 0,
            correctWords: 0,
            totalCharacters: 0,
            correctCharacters: 0,
            startTime: Date.now(),
            endTime: null,
            wpm: 0,
            accuracy: 100,
            mistypedLetters: {},
            mistypedWords: {}
        };
        
        // Reset adaptive settings
        this.adaptiveSettings.wordsCompleted = 0;
        this.currentWordCategory = this.currentWordCategory || 'default';
        
        // Hide menu, show game
        this.gameMenu.classList.add('hidden');
        this.gameOver.classList.add('hidden');
        
        // Show pause button
        if (this.pauseButton) {
            this.pauseButton.classList.remove('hidden');
        }
        
        this.updateUI();
        this.startSpawning();
        this.startGameLoop();
        
        console.log('Game started');
    }
    
    restartGame() {
        // Clear all enemies and explosions
        this.enemies.forEach(enemy => enemy.element.remove());
        this.explosions.forEach(explosion => explosion.element.remove());
        
        this.startGame();
    }
    
    handleKeyPress(e) {
        if (this.gameState !== 'playing' && this.gameState !== 'challenge') return;
        
        // Handle Escape key for pause
        if (e.key === 'Escape') {
            e.preventDefault();
            this.togglePause();
            return;
        }
        
        // Don't allow input while paused
        if (this.gameState === 'paused') return;
        
        // Handle Enter key
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.targetEnemy && this.currentInput.toLowerCase() === this.targetEnemy.word.toLowerCase()) {
                // Word is correct, destroy enemy
                this.destroyEnemy(this.targetEnemy);
                this.currentInput = '';
                this.targetEnemy = null;
                this.clearEnemyHighlights();
                this.updateInputDisplay();
                return;
            } else {
                // Word is incorrect - track the mistake
                if (this.currentInput.length > 0) {
                    this.typingStats.totalWords++;
                    this.typingStats.totalCharacters += this.currentInput.length;
                    
                    // Track mistyped word
                    if (this.targetEnemy) {
                        this.trackMistake('', '', this.targetEnemy.word);
                    }
                    
                    // In accuracy challenge, end game on mistake
                    if (this.challengeMode === 'accuracy') {
                        this.lives = 0;
                        this.endGame();
                        return;
                    }
                }
                
                this.currentInput = '';
                this.targetEnemy = null;
                this.clearEnemyHighlights();
                this.updateInputDisplay();
                this.updateStatsDisplay();
                return;
            }
        }
        
        // Ignore other special keys
        if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== ' ') return;
        
        e.preventDefault();
        
        if (e.key === 'Backspace') {
            this.currentInput = this.currentInput.slice(0, -1);
            if (this.currentInput === '') {
                this.targetEnemy = null;
                this.clearEnemyHighlights();
            }
        } else if (e.key === ' ') {
            // Track character input
            this.typingStats.totalCharacters++;
            
            // Check if space is correct
            if (this.targetEnemy && this.currentInput.length < this.targetEnemy.word.length) {
                const expectedChar = this.targetEnemy.word[this.currentInput.length];
                if (expectedChar === ' ') {
                    this.typingStats.correctCharacters++;
                } else {
                    this.trackMistake(expectedChar, ' ', this.targetEnemy.word);
                }
            }
            
            this.currentInput += ' ';
        } else if (e.key.length === 1) {
            const typedChar = e.key.toLowerCase();
            
            // Track character input
            this.typingStats.totalCharacters++;
            
            // Check if character is correct
            if (this.targetEnemy && this.currentInput.length < this.targetEnemy.word.length) {
                const expectedChar = this.targetEnemy.word[this.currentInput.length].toLowerCase();
                if (expectedChar === typedChar) {
                    this.typingStats.correctCharacters++;
                } else {
                    this.trackMistake(expectedChar, typedChar, this.targetEnemy.word);
                }
            }
            
            this.currentInput += typedChar;
        }
        
        this.updateInputDisplay();
        this.checkWordMatch();
    }
    
    checkWordMatch() {
        if (!this.currentInput) {
            this.targetEnemy = null;
            this.clearEnemyHighlights();
            return;
        }
        
        // Find enemies that start with current input
        const matchingEnemies = this.enemies.filter(enemy => 
            enemy.word.toLowerCase().startsWith(this.currentInput.toLowerCase())
        );
        
        if (matchingEnemies.length === 0) {
            this.targetEnemy = null;
            this.clearEnemyHighlights();
            return;
        }
        
        // If we don't have a target or current target doesn't match, find closest
        if (!this.targetEnemy || !this.targetEnemy.word.toLowerCase().startsWith(this.currentInput.toLowerCase())) {
            this.targetEnemy = matchingEnemies.reduce((closest, enemy) => 
                enemy.x > closest.x ? closest : enemy
            );
        }
        
        // Update visual feedback
        this.clearEnemyHighlights();
        if (this.targetEnemy) {
            const wordElement = this.targetEnemy.element.querySelector('.enemy-word');
            
            // Check if word is complete but don't auto-destroy
            if (this.currentInput.toLowerCase() === this.targetEnemy.word.toLowerCase()) {
                wordElement.classList.add('correct');
                // Don't auto-destroy - wait for Enter key
            } else {
                wordElement.classList.add('typing');
            }
        }
    }
    
    clearEnemyHighlights() {
        this.enemies.forEach(enemy => {
            const wordElement = enemy.element.querySelector('.enemy-word');
            wordElement.classList.remove('typing', 'correct');
        });
    }
    
    destroyEnemy(enemy) {
        // Create explosion
        this.createExplosion(enemy.x + 35, enemy.y + 25);
        
        // Increase combo
        this.combo++;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        
        // Track typing statistics
        this.typingStats.correctWords++;
        this.typingStats.totalWords++;
        this.typingStats.correctCharacters += enemy.word.length;
        this.typingStats.totalCharacters += enemy.word.length;
        this.adaptiveSettings.wordsCompleted++;
        
        // Remove enemy
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            enemy.element.remove();
        }
        
        // Calculate score
        const basePoints = enemy.word.length * 10;
        this.score += basePoints;
        
        this.updateUI();
        this.updateStatsDisplay();
    }
    
    createExplosion(x, y) {
        const explosion = {
            x: x,
            y: y,
            element: document.createElement('div')
        };
        
        explosion.element.className = 'explosion';
        explosion.element.style.left = x + 'px';
        explosion.element.style.top = y + 'px';
        
        this.explosionsContainer.appendChild(explosion.element);
        this.explosions.push(explosion);
        
        // Remove explosion after animation
        setTimeout(() => {
            const index = this.explosions.indexOf(explosion);
            if (index > -1) {
                this.explosions.splice(index, 1);
                explosion.element.remove();
            }
        }, 500);
    }
    
    startSpawning() {
        // If spawning is already active, prevent duplication
        if (this.spawnInterval) clearInterval(this.spawnInterval);

        // Spawn enemies at a fixed interval
        this.spawnInterval = setInterval(() => {
            this.spawnEnemy();
        }, 2000); // Spawn every 2 seconds
    }

    spawnEnemy() {
        // Create enemy object with DOM element
        const word = this.getAdaptiveWord();

        const enemyObj = {
            word: word,
            x: this.gameArea.clientWidth + 50, // Start from right side of screen
            y: Math.random() * (this.gameArea.clientHeight - 100) + 50, // Random vertical position
            element: document.createElement('div'),
            speed: 1.5 + Math.random() * 1.5, // pixels per frame
            health: 1,
            maxHealth: 1,
            isBoss: false,
            special: null,
            stealthVisible: true,
            stealthTimer: 0
        };

        enemyObj.element.className = 'enemy';

        // Create word element as child
        const wordDiv = document.createElement('div');
        wordDiv.className = 'enemy-word';
        wordDiv.textContent = word;
        enemyObj.element.appendChild(wordDiv);

        // Position enemy
        enemyObj.element.style.left = enemyObj.x + 'px';
        enemyObj.element.style.top = enemyObj.y + 'px';

        // Add to DOM and list
        this.enemiesContainer.appendChild(enemyObj.element);
        this.enemies.push(enemyObj);
    }
    
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            if (this.gameState === 'playing') {
                this.updateEnemies();
            }
        }, 16); // ~60 FPS
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            // Handle object-style enemies (has element property)
            if (enemy && enemy.element) {
                // Move enemy towards the left side of the screen (simple leftward movement)
                const currentLeft = parseFloat(enemy.element.style.left) || enemy.x || 0;
                const newLeft = currentLeft - (enemy.speed || 2);
                
                // Update both the stored x coordinate and the DOM element position
                enemy.x = newLeft;
                enemy.element.style.left = newLeft + 'px';

                // Collision with player
                const playerRect = this.player.getBoundingClientRect();
                const enemyRect = enemy.element.getBoundingClientRect();
                
                if (enemyRect.left < playerRect.right && 
                    enemyRect.right > playerRect.left && 
                    enemyRect.top < playerRect.bottom && 
                    enemyRect.top > playerRect.top) {
                    // Hit the player
                    enemy.element.remove();
                    this.enemies.splice(i, 1);
                    this.lives--;
                    this.updateUI();
                    if (this.lives <= 0) this.endGame();
                    continue;
                }

                // Remove enemies that go off the left side of the screen
                if (newLeft < -100) {
                    enemy.element.remove();
                    this.enemies.splice(i, 1);
                    continue;
                }
            }
        }
    }
    
    endGame() {
        this.gameState = 'gameOver';
        
        // Clear intervals
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        if (this.gameLoop) clearInterval(this.gameLoop);
        
        // Show game over screen
        this.gameOver.classList.remove('hidden');
        
        console.log('Game over');
    }
    
    updateUI() {
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.livesElement.textContent = `Lives: ${this.lives}`;
        
        if (this.targetEnemy) {
            this.currentWordElement.textContent = `Target: ${this.targetEnemy.word}`;
            this.currentWordElement.style.display = 'block';
        } else {
            this.currentWordElement.style.display = 'none';
        }
    }
    
    updateStatsDisplay() {
        // Update stats display if elements exist
        const wpmElement = document.getElementById('wpmDisplay');
        const accuracyElement = document.getElementById('accuracyDisplay');
        const comboElement = document.getElementById('comboDisplay');
        
        if (wpmElement) {
            wpmElement.textContent = `WPM: ${this.typingStats.wpm}`;
        }
        if (accuracyElement) {
            accuracyElement.textContent = `Accuracy: ${this.typingStats.accuracy}%`;
        }
        if (comboElement) {
            comboElement.textContent = `Combo: ${this.combo}x`;
        }
    }
    
    updateInputDisplay() {
        if (!this.currentInput) {
            this.inputDisplay.textContent = 'Type words and press Enter...';
            this.inputDisplay.style.color = '#00ff00';
            return;
        }
        
        this.inputDisplay.textContent = this.currentInput;
        
        if (this.targetEnemy) {
            const word = this.targetEnemy.word.toLowerCase();
            const input = this.currentInput.toLowerCase();
            
            if (word === input) {
                this.inputDisplay.style.color = '#00ff00';
            } else if (word.startsWith(input)) {
                this.inputDisplay.style.color = '#ffff00';
            } else {
                this.inputDisplay.style.color = '#ff0000';
            }
        } else {
            this.inputDisplay.style.color = '#00ff00';
        }
    }
    
    // Get word based on adaptive difficulty
    getAdaptiveWord() {
        return getRandomWord(this.adaptiveSettings.difficultyLevel);
    }
    
    // Calculate typing statistics
    calculateTypingStats() {
        if (!this.typingStats.startTime) return;
        
        const timeElapsed = (Date.now() - this.typingStats.startTime) / 1000 / 60; // minutes
        this.typingStats.wpm = Math.round(this.typingStats.correctWords / timeElapsed) || 0;
        this.typingStats.accuracy = this.typingStats.totalCharacters > 0 ? 
            Math.round((this.typingStats.correctCharacters / this.typingStats.totalCharacters) * 100) : 100;
    }
    
    // Track typing mistakes
    trackMistake(expectedChar, typedChar, word) {
        // Reset combo on mistake
        this.combo = 0;
        this.comboMultiplier = 1;
        
        // Track mistyped letters
        if (!this.typingStats.mistypedLetters[expectedChar]) {
            this.typingStats.mistypedLetters[expectedChar] = 0;
        }
        this.typingStats.mistypedLetters[expectedChar]++;
        
        // Track mistyped words
        if (!this.typingStats.mistypedWords[word]) {
            this.typingStats.mistypedWords[word] = 0;
        }
        this.typingStats.mistypedWords[word]++;
    }
    
    // Progress Save System Methods
    loadProgress() {
        try {
            const savedData = localStorage.getItem('f16TypingGameProgress');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.saveData = { ...this.saveData, ...parsed };
                console.log('Progress loaded:', this.saveData);
            }
        } catch (error) {
            console.warn('Failed to load progress:', error);
        }
    }
    
    saveProgress() {
        try {
            this.saveData.lastPlayDate = new Date().toISOString();
            localStorage.setItem('f16TypingGameProgress', JSON.stringify(this.saveData));
            console.log('Progress saved:', this.saveData);
        } catch (error) {
            console.warn('Failed to save progress:', error);
        }
    }
    
    // Challenge methods
    startSpeedChallenge() {
        this.challengeMode = 'speed';
        this.challengeTimer = 30;
        this.challengeScore = 0;
        this.gameState = 'challenge';
        
        this.hideAllMenus();
        this.showChallengeUI();
        this.startChallengeCountdown();
    }
    
    startAccuracyChallenge() {
        this.challengeMode = 'accuracy';
        this.challengeTimer = 0;
        this.challengeScore = 0;
        this.gameState = 'challenge';
        this.lives = 1;
        
        this.hideAllMenus();
        this.showChallengeUI();
        this.startSpawning();
        this.startGameLoop();
    }
    
    startChallengeCountdown() {
        const challengeInterval = setInterval(() => {
            this.challengeTimer--;
            this.updateChallengeUI();
            
            if (this.challengeTimer <= 0) {
                clearInterval(challengeInterval);
                this.endChallenge();
            }
        }, 1000);
        
        if (this.challengeMode === 'speed') {
            this.startSpawning();
            this.startGameLoop();
        }
    }
    
    endChallenge() {
        this.gameState = 'menu';
        this.stopGame();
        
        let message = '';
        if (this.challengeMode === 'speed') {
            message = `Speed Challenge Complete!\nWords typed: ${this.challengeScore}`;
        } else if (this.challengeMode === 'accuracy') {
            message = `Accuracy Challenge Complete!\nWords typed: ${this.challengeScore}`;
        }
        
        alert(message);
        this.showMainMenu();
    }
    
    // Custom dictionary management
    loadCustomWordList(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const words = content.split('\n').map(word => word.trim()).filter(word => word.length > 0);
                this.customWordLists.custom = words;
                alert(`Loaded ${words.length} custom words!`);
            } catch (error) {
                alert('Error loading word list. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
    
    // Pause functionality
    togglePause() {
        if (this.gameState === 'playing' || this.gameState === 'challenge') {
            this.gameState = 'paused';
            this.pauseStartTime = Date.now();
            
            if (this.spawnInterval) clearInterval(this.spawnInterval);
            if (this.gameLoop) clearInterval(this.gameLoop);
            
            document.getElementById('pauseMenu').classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = this.challengeMode ? 'challenge' : 'playing';
            
            if (this.pauseStartTime && this.typingStats.startTime) {
                const pauseDuration = Date.now() - this.pauseStartTime;
                this.typingStats.startTime += pauseDuration;
            }
            
            document.getElementById('pauseMenu').classList.add('hidden');
            
            this.startSpawning();
            this.startGameLoop();
        }
    }
    
    // UI Helper methods
    hideAllMenus() {
        this.gameMenu.classList.add('hidden');
        this.gameOver.classList.add('hidden');
        document.getElementById('challengeMenu')?.classList.add('hidden');
        document.getElementById('customDictionaryPanel')?.classList.add('hidden');
        document.getElementById('pauseMenu')?.classList.add('hidden');
    }
    
    showMainMenu() {
        this.hideAllMenus();
        this.gameMenu.classList.remove('hidden');
    }
    
    showCustomDictionary() {
        this.hideAllMenus();
        document.getElementById('customDictionaryPanel').classList.remove('hidden');
    }
    
    hidePanel(panelId) {
        document.getElementById(panelId).classList.add('hidden');
        this.showMainMenu();
    }
    
    setWordCategory(category) {
        this.currentWordCategory = category;
        alert(`Word category set to: ${category}`);
        this.hidePanel('customDictionaryPanel');
    }
    
    showChallengeUI() {
        const challengeUI = document.getElementById('challengeUI');
        if (challengeUI) {
            challengeUI.classList.remove('hidden');
        }
    }
    
    updateChallengeUI() {
        const timerElement = document.getElementById('challengeTimer');
        const challengeScoreElement = document.getElementById('challengeScore');
        
        if (timerElement) {
            timerElement.textContent = `Time: ${this.challengeTimer}s`;
        }
        if (challengeScoreElement) {
            challengeScoreElement.textContent = `Words: ${this.challengeScore}`;
        }
    }
    
    // Stop all game intervals
    stopGame() {
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        if (this.gameLoop) clearInterval(this.gameLoop);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    new F16TypingGame();
});

