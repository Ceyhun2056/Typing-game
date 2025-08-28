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
        this.bossSpawned = false; // Track if boss has been spawned for current score threshold
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
        // Clear all existing enemies and explosions from DOM
        this.clearAllGameElements();
        
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
        // Clear all game elements and restart
        this.clearAllGameElements();
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
        // Handle boss defeat
        if (enemy.isBoss) {
            this.defeatBoss(enemy);
            return;
        }
        
        // Handle multi-health enemies
        if (enemy.health > 1) {
            enemy.health--;
            this.updateEnemyHealth(enemy);
            console.log(`${enemy.type} enemy hit! Health remaining: ${enemy.health}/${enemy.maxHealth}`);
            return;
        }
        
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
        
        // Update challenge score if in challenge mode
        if (this.challengeMode) {
            this.challengeScore++;
        }
        
        // Remove enemy
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            enemy.element.remove();
        }
        
        // Calculate score with type bonuses
        const basePoints = enemy.word.length * 10;
        let bonusMultiplier = 1;
        
        // Apply type-specific bonuses
        if (enemy.type === 'fast') {
            bonusMultiplier = 1.5; // Fast enemies give 50% bonus
        } else if (enemy.type === 'tank') {
            bonusMultiplier = 2.0; // Tank enemies give 100% bonus
        } else if (enemy.type === 'stealth') {
            bonusMultiplier = 1.8; // Stealth enemies give 80% bonus
        }
        
        const finalPoints = Math.round(basePoints * bonusMultiplier);
        this.score += finalPoints;
        
        // Show bonus notification for special enemies
        if (enemy.type !== 'normal') {
            this.showBonusNotification(enemy.type, finalPoints);
        }
        
        console.log(`Enemy destroyed! Type: ${enemy.type}, Points: ${finalPoints}, Score: ${this.score}`);
        
        this.updateUI();
        this.updateStatsDisplay();
    }
    
    defeatBoss(enemy) {
        // Create multiple explosions for boss
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createExplosion(
                    enemy.x + 35 + (Math.random() - 0.5) * 50,
                    enemy.y + 25 + (Math.random() - 0.5) * 50
                );
            }, i * 200);
        }
        
        // Increase combo significantly
        this.combo += 5;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        
        // Track typing statistics
        this.typingStats.correctWords++;
        this.typingStats.totalWords++;
        this.typingStats.correctCharacters += enemy.word.length;
        this.typingStats.totalCharacters += enemy.word.length;
        this.adaptiveSettings.wordsCompleted++;
        
        // Update challenge score if in challenge mode
        if (this.challengeMode) {
            this.challengeScore += 3; // Boss gives 3 points in challenges
        }
        
        // Remove boss
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            enemy.element.remove();
        }
        
        // Calculate boss score (much higher)
        const bossPoints = enemy.word.length * 50; // 5x normal points
        this.score += bossPoints;
        
        // Reset boss spawn flag
        this.bossSpawned = false;
        
        // Show boss defeated notification
        this.showBossDefeatedNotification(bossPoints);
        
        this.updateUI();
        this.updateStatsDisplay();
    }
    
    updateEnemyHealth(enemy) {
        if (enemy.healthBar && enemy.healthFill) {
            const healthPercent = (enemy.health / enemy.maxHealth) * 100;
            enemy.healthFill.style.width = healthPercent + '%';
            
            // Change color based on health
            if (healthPercent > 60) {
                enemy.healthFill.style.backgroundColor = '#00ff00';
            } else if (healthPercent > 30) {
                enemy.healthFill.style.backgroundColor = '#ffff00';
            } else {
                enemy.healthFill.style.backgroundColor = '#ff0000';
            }
        }
    }
    
    showBonusNotification(enemyType, points) {
        const notification = document.createElement('div');
        notification.className = 'bonus-notification';
        
        let message = '';
        let color = '#00ff00';
        
        switch (enemyType) {
            case 'fast':
                message = `⚡ FAST ENEMY! +${points} pts`;
                color = '#00ffff';
                break;
            case 'tank':
                message = `🛡️ TANK ENEMY! +${points} pts`;
                color = '#ff6600';
                break;
            case 'stealth':
                message = `👻 STEALTH ENEMY! +${points} pts`;
                color = '#9933ff';
                break;
        }
        
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20%;
            right: 20px;
            background: ${color};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 2 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
    
    showBossDefeatedNotification(points) {
        const notification = document.createElement('div');
        notification.className = 'boss-defeated-notification';
        notification.textContent = `🎉 BOSS DEFEATED! +${points} pts`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6600, #ffcc00);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 20px;
            font-weight: bold;
            z-index: 1000;
            animation: bossDefeatedPulse 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
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

        console.log('Starting enemy spawning...');
        
        // Spawn enemies at a fixed interval
        this.spawnInterval = setInterval(() => {
            console.log('Spawning enemy... Current score:', this.score);
            this.spawnEnemy();
        }, 2000); // Spawn every 2 seconds
    }

    spawnEnemy() {
        // Don't spawn enemies if game is not active
        if (this.gameState !== 'playing' && this.gameState !== 'challenge') {
            return;
        }
        
        // Check if we should spawn a boss (every 500 points, but not at 0)
        if (this.shouldSpawnBoss()) {
            this.spawnBoss();
            this.bossSpawned = true;
            return;
        }
        
        // Determine enemy type based on score and random chance
        const enemyType = this.determineEnemyType();
        
        // Create enemy object with DOM element
        const word = this.getAdaptiveWord();

        const enemyObj = {
            word: word,
            x: this.gameArea.clientWidth + 50, // Start from right side of screen
            y: Math.random() * (this.gameArea.clientHeight - 100) + 50, // Random vertical position
            element: document.createElement('div'),
            speed: enemyType.speed,
            health: enemyType.health,
            maxHealth: enemyType.health,
            isBoss: false,
            type: enemyType.name,
            special: enemyType.special,
            stealthVisible: true,
            stealthTimer: 0
        };

        enemyObj.element.className = `enemy ${enemyType.className}`;

        // Create word element as child
        const wordDiv = document.createElement('div');
        wordDiv.className = 'enemy-word';
        wordDiv.textContent = word;
        enemyObj.element.appendChild(wordDiv);

        // Add health bar for tank enemies
        if (enemyType.name === 'tank') {
            const healthBar = document.createElement('div');
            healthBar.className = 'enemy-health-bar';
            const healthFill = document.createElement('div');
            healthFill.className = 'enemy-health-fill';
            healthFill.style.width = '100%';
            healthBar.appendChild(healthFill);
            enemyObj.element.appendChild(healthBar);
            
            // Store health bar reference
            enemyObj.healthBar = healthBar;
            enemyObj.healthFill = healthFill;
        }

        // Position enemy
        enemyObj.element.style.left = enemyObj.x + 'px';
        enemyObj.element.style.top = enemyObj.y + 'px';

        // Add to DOM and list
        this.enemiesContainer.appendChild(enemyObj.element);
        this.enemies.push(enemyObj);
        
        console.log('Enemy spawned:', enemyType.name, 'with word:', word);
    }
    
    determineEnemyType() {
        const baseSpeed = 1.5;
        const baseHealth = 1;
        
        // Get random number for type selection
        const rand = Math.random();
        
        let enemyType;
        
        if (rand < 0.1) { // 10% chance for fast enemy
            enemyType = {
                name: 'fast',
                className: 'enemy-fast',
                speed: baseSpeed * 2.5,
                health: baseHealth,
                special: 'speed'
            };
        } else if (rand < 0.2) { // 10% chance for tank enemy
            enemyType = {
                name: 'tank',
                className: 'enemy-tank',
                speed: baseSpeed * 0.7,
                health: baseHealth * 3,
                special: 'health'
            };
        } else if (rand < 0.25) { // 5% chance for stealth enemy
            enemyType = {
                name: 'stealth',
                className: 'enemy-stealth',
                speed: baseSpeed * 1.8,
                health: baseHealth,
                special: 'stealth'
            };
        } else { // 75% chance for normal enemy
            enemyType = {
                name: 'normal',
                className: 'enemy-normal',
                speed: baseSpeed + Math.random() * 1.5,
                health: baseHealth,
                special: null
            };
        }
        
        console.log('Enemy type determined:', enemyType.name, 'Speed:', enemyType.speed, 'Health:', enemyType.health);
        return enemyType;
    }
    
    shouldSpawnBoss() {
        // Spawn boss every 500 points, but not at 0
        if (this.score < 500) return false;
        if (this.bossSpawned) return false;
        
        // Check if we've reached a 500-point milestone
        const lastBossScore = Math.floor(this.score / 500) * 500;
        if (this.score >= lastBossScore && this.score < lastBossScore + 100) {
            console.log('Boss spawn condition met! Score:', this.score, 'Last boss score:', lastBossScore);
            return true;
        }
        
        return false;
    }
    
    spawnBoss() {
        console.log('Attempting to spawn boss...');
        
        // Create boss enemy
        const bossWord = this.getAdaptiveWord();
        const bossObj = {
            word: bossWord,
            x: this.gameArea.clientWidth + 50,
            y: Math.random() * (this.gameArea.clientHeight - 150) + 75,
            element: document.createElement('div'),
            speed: 1.0, // Boss moves slower
            health: 5,
            maxHealth: 5,
            isBoss: true,
            type: 'boss',
            special: 'boss',
            stealthVisible: true,
            stealthTimer: 0
        };

        bossObj.element.className = 'enemy enemy-boss';
        
        // Create boss word element
        const wordDiv = document.createElement('div');
        wordDiv.className = 'enemy-word boss-word';
        wordDiv.textContent = bossWord;
        bossObj.element.appendChild(wordDiv);
        
        // Create health bar for boss
        const healthBar = document.createElement('div');
        healthBar.className = 'boss-health-bar';
        const healthFill = document.createElement('div');
        healthFill.className = 'boss-health-fill';
        healthFill.style.width = '100%';
        healthBar.appendChild(healthFill);
        bossObj.element.appendChild(healthBar);
        
        // Store health bar reference
        bossObj.healthBar = healthBar;
        bossObj.healthFill = healthFill;

        // Position boss
        bossObj.element.style.left = bossObj.x + 'px';
        bossObj.element.style.top = bossObj.y + 'px';

        // Add to DOM and list
        this.enemiesContainer.appendChild(bossObj.element);
        this.enemies.push(bossObj);
        
        // Show boss warning
        this.showBossWarning();
        
        console.log('Boss spawned successfully!', bossWord, 'at position:', bossObj.x, bossObj.y);
    }
    
    showBossWarning() {
        // Create boss warning notification
        const warning = document.createElement('div');
        warning.className = 'boss-warning';
        warning.textContent = '🚨 BOSS INCOMING! 🚨';
        warning.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff0000, #ff6600);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            animation: bossWarningPulse 1s infinite;
        `;
        
        document.body.appendChild(warning);
        
        // Remove warning after 3 seconds
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 3000);
    }
    
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            if (this.gameState === 'playing' || this.gameState === 'challenge') {
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

                // Check if enemy crossed the left side (missed the player)
                if (newLeft < -100) {
                    // Enemy missed - decrease lives and remove
                    if (!enemy.isBoss) { // Don't decrease lives for boss misses
                        this.lives--;
                        console.log('Enemy missed! Lives remaining:', this.lives);
                    }
                    
                    enemy.element.remove();
                    this.enemies.splice(i, 1);
                    
                    // Check if game over
                    if (this.lives <= 0) {
                        this.endGame();
                        return;
                    }
                    
                    this.updateUI();
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
        // Clear all existing enemies and explosions from DOM
        this.clearAllGameElements();
        
        this.challengeMode = 'speed';
        this.challengeTimer = 30;
        this.challengeScore = 0;
        this.gameState = 'challenge';
        
        // Reset game state for challenge
        this.score = 0;
        this.lives = 3;
        this.enemies = [];
        this.explosions = [];
        this.currentInput = '';
        this.targetEnemy = null;
        this.combo = 0;
        this.maxCombo = 0;
        this.comboMultiplier = 1;
        this.bossSpawned = false; // Reset boss spawn flag
        
        // Initialize typing stats
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
        
        this.hideAllMenus();
        this.showChallengeUI();
        this.startChallengeCountdown();
    }
    
    startAccuracyChallenge() {
        // Clear all existing enemies and explosions from DOM
        this.clearAllGameElements();
        
        this.challengeMode = 'accuracy';
        this.challengeTimer = 0;
        this.challengeScore = 0;
        this.gameState = 'challenge';
        this.lives = 1;
        
        // Reset game state for challenge
        this.score = 0;
        this.enemies = [];
        this.explosions = [];
        this.currentInput = '';
        this.targetEnemy = null;
        this.combo = 0;
        this.maxCombo = 0;
        this.comboMultiplier = 1;
        
        // Initialize typing stats
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
        
        this.hideAllMenus();
        this.showChallengeUI();
        this.startSpawning();
        this.startGameLoop();
    }
    
    startChallengeCountdown() {
        // Start spawning and game loop immediately for speed challenge
        if (this.challengeMode === 'speed') {
            this.startSpawning();
            this.startGameLoop();
        }
        
        const challengeInterval = setInterval(() => {
            this.challengeTimer--;
            this.updateChallengeUI();
            
            if (this.challengeTimer <= 0) {
                clearInterval(challengeInterval);
                this.endChallenge();
            }
        }, 1000);
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
        // Clear all game elements when returning to main menu
        this.clearAllGameElements();
        this.gameState = 'menu';
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
        
        // Also update the main UI for challenge mode
        this.updateUI();
        this.updateStatsDisplay();
    }
    
    // Clear all game elements from DOM
    clearAllGameElements() {
        // Clear all enemies from DOM
        if (this.enemiesContainer) {
            this.enemiesContainer.innerHTML = '';
        }
        
        // Clear all explosions from DOM
        if (this.explosionsContainer) {
            this.explosionsContainer.innerHTML = '';
        }
        
        // Clear arrays
        this.enemies = [];
        this.explosions = [];
        
        // Reset boss spawn flag
        this.bossSpawned = false;
        
        // Clear any existing intervals
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
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

