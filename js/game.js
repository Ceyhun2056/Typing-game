// F-16 Fighter Typing Game
class F16TypingGame {
    constructor() {
        this.gameState = 'menu'; // 'menu', 'playing', 'gameOver', 'challenge'
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        this.enemies = [];
        this.explosions = [];
        this.currentInput = '';
        this.targetEnemy = null;
        
        // Game settings
        this.enemySpeed = 1;
        this.spawnRate = 2000; // milliseconds
        this.maxEnemies = 5;
        
        // Boss System
        this.bosses = [];
        this.currentBoss = null;
        this.bossSpawnThreshold = 500; // Spawn boss every 500 points
        this.lastBossScore = 0; // Track when last boss was spawned
        
        // Enemy Variety System
        this.enemyTypes = {
            scout: {
                name: 'Scout',
                speed: 2, // Faster than normal
                health: 1,
                size: 0.7, // Smaller
                words: ['GO', 'FLY', 'RUN', 'HIT', 'ACE', 'JET', 'SKY', 'AIR'],
                color: '#00ff00', // Green
                points: 15, // Higher points for difficulty
                spawnWeight: 25 // 25% spawn chance
            },
            standard: {
                name: 'Standard Fighter',
                speed: 1, // Normal speed
                health: 1,
                size: 1, // Normal size
                words: ['FIRE', 'WING', 'RADAR', 'PILOT', 'SPEED', 'POWER', 'ARMOR', 'FLIGHT'],
                color: '#ff1744', // Red
                points: 10,
                spawnWeight: 40 // 40% spawn chance
            },
            heavy: {
                name: 'Heavy Bomber',
                speed: 0.5, // Slower
                health: 2, // Takes 2 hits
                size: 1.4, // Larger
                words: ['DESTROYER', 'FORTRESS', 'THUNDER', 'MASSIVE', 'CRUSHING', 'BOMBARD', 'ASSAULT'],
                color: '#9c27b0', // Purple
                points: 25, // More points for tankiness
                spawnWeight: 20 // 20% spawn chance
            },
            stealth: {
                name: 'Stealth Fighter',
                speed: 1.2, // Slightly faster
                health: 1,
                size: 0.9, // Slightly smaller
                words: ['SHADOW', 'GHOST', 'HIDDEN', 'STEALTH', 'PHANTOM', 'COVERT', 'SILENT'],
                color: '#424242', // Dark gray
                points: 20,
                spawnWeight: 15, // 15% spawn chance
                special: 'stealth' // Special ability
            }
        };
        
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
        this.lives = 5;
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
        // Handle boss enemies differently
        if (enemy.isBoss) {
            // Reduce boss health instead of destroying immediately
            enemy.health--;
            
            // Update boss health bar
            const healthFill = enemy.element.querySelector('.boss-health-fill');
            if (healthFill) {
                healthFill.style.width = `${(enemy.health / enemy.maxHealth) * 100}%`;
                healthFill.style.backgroundColor = enemy.health <= 1 ? '#FF0000' : '#00FF00';
            }
            
            // Only destroy boss when health reaches 0
            if (enemy.health <= 0) {
                // Create big explosion
                this.createExplosion(enemy.x + 50, enemy.y + 40);
                this.createExplosion(enemy.x + 20, enemy.y + 60);
                this.createExplosion(enemy.x + 70, enemy.y + 20);
                
                // Boss defeated - give huge bonus
                const bossBonus = 500;
                this.score += bossBonus;
                
                // Show boss defeated notification
                this.showBossDefeatedNotification(bossBonus);
                
                // Remove boss
                const index = this.enemies.indexOf(enemy);
                if (index > -1) {
                    this.enemies.splice(index, 1);
                    enemy.element.remove();
                }
                
                // Clear current boss reference
                this.currentBoss = null;
            } else {
                // Boss hit but not destroyed - show damage effect
                enemy.element.style.animation = 'bossHit 0.5s ease-out';
                setTimeout(() => {
                    if (enemy.element) {
                        enemy.element.style.animation = '';
                    }
                }, 500);
            }
            
            // Track statistics for boss hits
            this.typingStats.correctWords++;
            this.typingStats.totalWords++;
            this.typingStats.correctCharacters += enemy.word.length;
            this.typingStats.totalCharacters += enemy.word.length;
            
            this.updateUI();
            this.updateStatsDisplay();
            return;
        }
        
        // Handle multi-health regular enemies (like Heavy Bombers)
        if (enemy.health && enemy.health > 1) {
            // Reduce enemy health instead of destroying immediately
            enemy.health--;
            
            // Update enemy health bar
            const healthFill = enemy.element.querySelector('.enemy-health-fill');
            if (healthFill) {
                healthFill.style.width = `${(enemy.health / enemy.maxHealth) * 100}%`;
                if (enemy.health <= 1) {
                    healthFill.style.backgroundColor = '#FF0000';
                }
            }
            
            // Only destroy when health reaches 0
            if (enemy.health <= 0) {
                // Create explosion
                this.createExplosion(enemy.x + 35, enemy.y + 25);
                
                // Remove enemy
                const index = this.enemies.indexOf(enemy);
                if (index > -1) {
                    this.enemies.splice(index, 1);
                    enemy.element.remove();
                }
            } else {
                // Show damage effect
                enemy.element.style.animation = 'enemyHit 0.3s ease-out';
                setTimeout(() => {
                    if (enemy.element) {
                        enemy.element.style.animation = '';
                    }
                }, 300);
            }
            
            // Track statistics for multi-health enemy hits
            this.typingStats.correctWords++;
            this.typingStats.totalWords++;
            this.typingStats.correctCharacters += enemy.word.length;
            this.typingStats.totalCharacters += enemy.word.length;
            
            // Calculate score with enemy type bonus (only when fully destroyed)
            if (enemy.health <= 0) {
                const basePoints = enemy.points || (enemy.word.length * 10);
                const comboBonus = this.calculateComboBonus();
                const totalPoints = basePoints + comboBonus;
                this.score += totalPoints;
                
                // Increase combo only when enemy is fully destroyed
                this.combo++;
                if (this.combo > this.maxCombo) {
                    this.maxCombo = this.combo;
                }
                this.updateComboMultiplier();
                this.adaptiveSettings.wordsCompleted++;
                
                // Show combo notification if combo is significant
                if (this.combo >= 3) {
                    this.showComboNotification(this.combo, comboBonus);
                }
            }
            
            this.updateUI();
            this.updateStatsDisplay();
            return;
        }
        
        // Regular single-health enemy destruction logic
        // Create explosion
        this.createExplosion(enemy.x + 35, enemy.y + 25);
        
        // Increase combo
        this.combo++;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        
        // Calculate combo multiplier
        this.updateComboMultiplier();
        
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
        
        // Calculate score with enemy type bonus and combo bonus
        const basePoints = enemy.points || (enemy.word.length * 10);
        const comboBonus = this.calculateComboBonus();
        const totalPoints = basePoints + comboBonus;
        
        this.score += totalPoints;
        
        // Show combo notification if combo is significant
        if (this.combo >= 3) {
            this.showComboNotification(this.combo, comboBonus);
        }
        
        // Update adaptive difficulty every 5 words
        if (this.adaptiveSettings.wordsCompleted % 5 === 0) {
            this.updateAdaptiveDifficulty();
        }
        
        this.updateUI();
        this.updateStatsDisplay();
        
        // Check for level up and boss spawning
        const previousScore = this.score - totalPoints;
        const currentLevel = Math.floor(this.score / 500);
        const previousLevel = Math.floor(previousScore / 500);
        
        if (currentLevel > previousLevel) {
            this.levelUp();
            
            // Spawn boss when crossing 500-point thresholds (but not if already have a boss)
            if (!this.currentBoss) {
                this.spawnBoss();
                this.lastBossScore = this.score;
            }
        }
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
    
    levelUp() {
        this.level++;
        this.enemySpeed += 0.5;
        this.spawnRate = Math.max(1000, this.spawnRate - 100);
        
        // Update and save progress for level achievement
        if (this.level > this.saveData.maxLevel) {
            this.saveData.maxLevel = this.level;
            this.saveProgress();
            this.showAchievement('Level Up!', `Reached Level ${this.level}`);
        }
        
        console.log(`Level up! Level ${this.level}`);
    }
    
    startSpawning() {
        this.spawnInterval = setInterval(() => {
            if (this.gameState === 'playing' && this.enemies.length < this.maxEnemies) {
                this.spawnEnemy();
            }
        }, this.spawnRate);
    }
    
    spawnEnemy() {
        // Select enemy type based on weighted random selection
        const enemyType = this.selectEnemyType();
        
        // Select word from enemy type's word list or fallback to custom categories
        let word;
        if (this.currentWordCategory === 'programming') {
            word = this.getCustomWord('programming');
        } else if (this.currentWordCategory === 'science') {
            word = this.getCustomWord('science');
        } else if (this.currentWordCategory === 'custom' && this.customWordLists.custom.length > 0) {
            word = this.getCustomWord('custom');
        } else {
            // Use enemy type specific words
            word = enemyType.words[Math.floor(Math.random() * enemyType.words.length)];
        }
        
        const enemy = {
            word: word,
            x: this.gameArea.offsetWidth,
            y: Math.random() * (this.gameArea.offsetHeight - 100) + 50,
            element: document.createElement('div'),
            type: enemyType.name,
            speed: enemyType.speed,
            health: enemyType.health,
            maxHealth: enemyType.health,
            size: enemyType.size,
            color: enemyType.color,
            points: enemyType.points,
            special: enemyType.special || null,
            stealthVisible: true, // For stealth enemies
            stealthTimer: 0
        };
        
        // Create enemy element with type-specific styling
        enemy.element.className = `enemy enemy-${enemyType.name.toLowerCase().replace(' ', '-')}`;
        enemy.element.style.left = enemy.x + 'px';
        enemy.element.style.top = enemy.y + 'px';
        enemy.element.style.transform = `scaleX(-1) rotate(-2deg) scale(${enemy.size})`;
        enemy.element.style.filter = `drop-shadow(0 0 12px ${enemy.color}) drop-shadow(0 4px 12px #0008)`;
        
        // Add health bar for multi-health enemies
        if (enemy.health > 1) {
            const healthBar = document.createElement('div');
            healthBar.className = 'enemy-health-bar';
            const healthFill = document.createElement('div');
            healthFill.className = 'enemy-health-fill';
            healthFill.style.width = '100%';
            healthFill.style.backgroundColor = enemy.color;
            healthBar.appendChild(healthFill);
            enemy.element.appendChild(healthBar);
        }
        
        // Create word element
        const wordElement = document.createElement('div');
        wordElement.className = 'enemy-word';
        wordElement.style.borderColor = enemy.color;
        wordElement.textContent = word;
        enemy.element.appendChild(wordElement);
        
        this.enemiesContainer.appendChild(enemy.element);
        this.enemies.push(enemy);
    }
    
    selectEnemyType() {
        // Weighted random selection based on enemy spawn weights
        const types = Object.values(this.enemyTypes);
        const totalWeight = types.reduce((sum, type) => sum + type.spawnWeight, 0);
        let random = Math.random() * totalWeight;
        
        for (const type of types) {
            random -= type.spawnWeight;
            if (random <= 0) {
                return type;
            }
        }
        
        // Fallback to standard if something goes wrong
        return this.enemyTypes.standard;
    }
    
    spawnBoss() {
        // Boss words are longer and more challenging
        const bossWords = [
            'DESTRUCTION', 'ANNIHILATION', 'DEVASTATION', 'OBLITERATION',
            'COMMANDER', 'BATTLEFIELD', 'OVERWHELMING', 'UNSTOPPABLE',
            'LEGENDARY', 'INVINCIBLE', 'FORMIDABLE', 'CATASTROPHIC',
            'EXTRAORDINARY', 'PHENOMENAL', 'UNCONQUERABLE', 'MAGNIFICENT'
        ];
        
        const word = bossWords[Math.floor(Math.random() * bossWords.length)];
        
        const boss = {
            word: word,
            x: this.gameArea.offsetWidth,
            y: this.gameArea.offsetHeight / 2 - 50, // Center vertically
            element: document.createElement('div'),
            isBoss: true,
            health: 3, // Boss takes 3 hits to destroy
            maxHealth: 3
        };
        
        // Create boss element
        boss.element.className = 'enemy boss';
        boss.element.style.left = boss.x + 'px';
        boss.element.style.top = boss.y + 'px';
        
        // Create word element
        const wordElement = document.createElement('div');
        wordElement.className = 'enemy-word boss-word';
        wordElement.textContent = word;
        boss.element.appendChild(wordElement);
        
        // Create health bar
        const healthBar = document.createElement('div');
        healthBar.className = 'boss-health-bar';
        const healthFill = document.createElement('div');
        healthFill.className = 'boss-health-fill';
        healthFill.style.width = '100%';
        healthBar.appendChild(healthFill);
        boss.element.appendChild(healthBar);
        
        this.enemiesContainer.appendChild(boss.element);
        this.enemies.push(boss);
        this.currentBoss = boss;
        
        // Show boss warning
        this.showBossWarning();
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
            
            // Handle stealth enemy visibility
            if (enemy.special === 'stealth') {
                enemy.stealthTimer += 16; // Add frame time
                
                // Toggle visibility every 2 seconds
                if (enemy.stealthTimer >= 2000) {
                    enemy.stealthVisible = !enemy.stealthVisible;
                    enemy.element.style.opacity = enemy.stealthVisible ? '1' : '0.3';
                    enemy.stealthTimer = 0;
                }
            }
            
            // Calculate movement speed based on enemy type
            let speed;
            if (enemy.isBoss) {
                speed = this.enemySpeed * 0.5;
            } else if (enemy.speed) {
                speed = this.enemySpeed * enemy.speed;
            } else {
                speed = this.enemySpeed;
            }
            
            enemy.x -= speed;
            enemy.element.style.left = enemy.x + 'px';
            
            // Check if enemy reached the left side (player loses life)
            if (enemy.x < -100) {
                this.enemies.splice(i, 1);
                enemy.element.remove();
                
                // If it was a boss, clear boss reference
                if (enemy.isBoss) {
                    this.currentBoss = null;
                }
                
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.endGame();
                }
                
                // Clear target if it was this enemy
                if (this.targetEnemy === enemy) {
                    this.targetEnemy = null;
                    this.currentInput = '';
                    this.updateInputDisplay();
                }
            }
        }
    }
    
    endGame() {
        this.gameState = 'gameOver';
        
        // Update and save high scores
        this.updateHighScores();
        
        // Clear intervals
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        if (this.gameLoop) clearInterval(this.gameLoop);
        
        // Show game over screen with stats
        const finalScore = document.getElementById('finalScore');
        const finalStats = document.getElementById('finalStats');
        
        finalScore.textContent = `Final Score: ${this.score}`;
        
        // Show comprehensive final stats
        finalStats.innerHTML = `
            <div class="final-stats-content">
                <div class="stat-row">
                    <span>Level Reached:</span> <span>${this.level}</span>
                </div>
                <div class="stat-row">
                    <span>Max Combo:</span> <span>${this.maxCombo}x</span>
                </div>
                <div class="stat-row">
                    <span>Final WPM:</span> <span>${this.typingStats.wpm}</span>
                </div>
                <div class="stat-row">
                    <span>Accuracy:</span> <span>${this.typingStats.accuracy}%</span>
                </div>
                <div class="stat-row">
                    <span>Words Typed:</span> <span>${this.typingStats.correctWords}</span>
                </div>
                ${this.score > this.saveData.highScore ? '<div class="new-record">🎉 NEW HIGH SCORE! 🎉</div>' : ''}
            </div>
        `;
        
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
        this.calculateTypingStats();
        
        const wpmElement = document.getElementById('wpmDisplay');
        const accuracyElement = document.getElementById('accuracyDisplay');
        const difficultyElement = document.getElementById('difficultyDisplay');
        const comboElement = document.getElementById('comboDisplay');
        
        if (wpmElement) {
            wpmElement.textContent = `WPM: ${this.typingStats.wpm}`;
        }
        if (accuracyElement) {
            accuracyElement.textContent = `Accuracy: ${this.typingStats.accuracy}%`;
        }
        if (difficultyElement) {
            difficultyElement.textContent = `Difficulty: ${this.adaptiveSettings.difficultyLevel}`;
        }
        if (comboElement) {
            comboElement.textContent = `Combo: ${this.combo}x`;
            
            // Update combo display color based on combo level
            if (this.combo >= 15) {
                comboElement.style.background = 'rgba(255, 0, 255, 0.3)'; // Magenta for epic combo
                comboElement.style.color = '#FF00FF';
            } else if (this.combo >= 10) {
                comboElement.style.background = 'rgba(255, 69, 0, 0.3)'; // Red for great combo
                comboElement.style.color = '#FF4500';
            } else if (this.combo >= 5) {
                comboElement.style.background = 'rgba(255, 165, 0, 0.3)'; // Orange for good combo
                comboElement.style.color = '#FFA500';
            } else if (this.combo >= 3) {
                comboElement.style.background = 'rgba(255, 215, 0, 0.3)'; // Gold for basic combo
                comboElement.style.color = '#FFD700';
            } else {
                comboElement.style.background = 'rgba(255, 255, 255, 0.1)'; // Default
                comboElement.style.color = '#FFFFFF';
            }
        }
    }
    
    updateInputDisplay() {
        if (!this.currentInput) {
            this.inputDisplay.textContent = 'Type words and press Enter...';
            this.inputDisplay.style.color = '#00ff00';
            this.inputDisplay.style.borderColor = '#00ff00';
            return;
        }
        
        this.inputDisplay.textContent = this.currentInput;
        
        if (this.targetEnemy) {
            const word = this.targetEnemy.word.toLowerCase();
            const input = this.currentInput.toLowerCase();
            
            if (word === input) {
                // Perfect match - ready to submit
                this.inputDisplay.style.color = '#00ff00';
                this.inputDisplay.style.borderColor = '#00ff00';
                this.inputDisplay.textContent = this.currentInput + ' (Press Enter!)';
            } else if (word.startsWith(input)) {
                // Correct so far
                this.inputDisplay.style.color = '#ffff00';
                this.inputDisplay.style.borderColor = '#ffff00';
            } else {
                // Wrong
                this.inputDisplay.style.color = '#ff0000';
                this.inputDisplay.style.borderColor = '#ff0000';
            }
        } else {
            this.inputDisplay.style.color = '#00ff00';
            this.inputDisplay.style.borderColor = '#00ff00';
        }
    }
    
    // === NEW FEATURES ===
    
    // Adaptive Word List - adjusts difficulty based on performance
    updateAdaptiveDifficulty() {
        this.calculateTypingStats();
        
        const { wpm, accuracy } = this.typingStats;
        const wordsCompleted = this.adaptiveSettings.wordsCompleted;
        
        // Adjust difficulty based on performance
        if (wpm > 40 && accuracy > 90 && wordsCompleted > 10) {
            this.adaptiveSettings.difficultyLevel = 'hard';
        } else if (wpm > 25 && accuracy > 80 && wordsCompleted > 5) {
            this.adaptiveSettings.difficultyLevel = 'medium';
        } else {
            this.adaptiveSettings.difficultyLevel = 'easy';
        }
        
        console.log(`Adaptive difficulty: ${this.adaptiveSettings.difficultyLevel} (WPM: ${wpm}, Accuracy: ${accuracy}%)`);
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
    
    // Combo System Methods
    updateComboMultiplier() {
        // Update multiplier based on combo thresholds
        for (let i = this.streakThresholds.length - 1; i >= 0; i--) {
            if (this.combo >= this.streakThresholds[i]) {
                this.comboMultiplier = 1 + (i + 1) * 0.2; // 1.2x, 1.4x, 1.6x, 1.8x, 2.0x
                break;
            }
        }
    }
    
    calculateComboBonus() {
        if (this.combo < 3) return 0;
        
        // Base bonus increases with combo length
        let bonus = this.baseBonusPoints;
        
        // Apply threshold bonuses
        for (let i = 0; i < this.streakThresholds.length; i++) {
            if (this.combo >= this.streakThresholds[i]) {
                bonus += (i + 1) * 5; // +5, +10, +15, +20, +25 points
            }
        }
        
        // Apply multiplier
        return Math.floor(bonus * this.comboMultiplier);
    }
    
    showComboNotification(combo, bonus) {
        // Create floating notification element
        const notification = document.createElement('div');
        notification.className = 'combo-notification';
        notification.innerHTML = `
            <div class="combo-text">${combo}x COMBO!</div>
            <div class="combo-bonus">+${bonus} bonus points</div>
        `;
        
        // Position it in the center-top of the game area
        notification.style.position = 'absolute';
        notification.style.left = '50%';
        notification.style.top = '20%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.zIndex = '30';
        notification.style.color = '#FFD700';
        notification.style.fontWeight = 'bold';
        notification.style.fontSize = `${Math.min(20 + combo * 2, 40)}px`;
        notification.style.textAlign = 'center';
        notification.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        notification.style.animation = 'comboFloat 2s ease-out forwards';
        
        this.gameArea.appendChild(notification);
        
        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }

    showBossWarning() {
        // Create boss warning notification
        const warning = document.createElement('div');
        warning.className = 'boss-warning';
        warning.innerHTML = `
            <div class="boss-warning-text">⚠️ BOSS INCOMING! ⚠️</div>
            <div class="boss-warning-subtitle">Prepare for battle!</div>
        `;
        
        // Position it in the center of the screen
        warning.style.position = 'absolute';
        warning.style.left = '50%';
        warning.style.top = '50%';
        warning.style.transform = 'translate(-50%, -50%)';
        warning.style.zIndex = '50';
        warning.style.color = '#FF0000';
        warning.style.fontWeight = 'bold';
        warning.style.fontSize = '36px';
        warning.style.textAlign = 'center';
        warning.style.textShadow = '3px 3px 6px rgba(0,0,0,0.9)';
        warning.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        warning.style.border = '3px solid #FF0000';
        warning.style.borderRadius = '15px';
        warning.style.padding = '20px';
        warning.style.animation = 'bossWarning 3s ease-out forwards';
        
        this.gameArea.appendChild(warning);
        
        // Remove warning after animation
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 3000);
    }

    showBossDefeatedNotification(bonus) {
        // Create boss defeated notification
        const notification = document.createElement('div');
        notification.className = 'boss-defeated';
        notification.innerHTML = `
            <div class="boss-defeated-text">🏆 BOSS DEFEATED! 🏆</div>
            <div class="boss-defeated-bonus">+${bonus} BONUS POINTS!</div>
        `;
        
        // Position it in the center of the screen
        notification.style.position = 'absolute';
        notification.style.left = '50%';
        notification.style.top = '40%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.zIndex = '50';
        notification.style.color = '#FFD700';
        notification.style.fontWeight = 'bold';
        notification.style.fontSize = '42px';
        notification.style.textAlign = 'center';
        notification.style.textShadow = '3px 3px 6px rgba(0,0,0,0.9)';
        notification.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
        notification.style.border = '3px solid #FFD700';
        notification.style.borderRadius = '15px';
        notification.style.padding = '25px';
        notification.style.animation = 'bossDefeated 4s ease-out forwards';
        
        this.gameArea.appendChild(notification);
        
        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    // Progress Save System Methods
    loadProgress() {
        try {
            const savedData = localStorage.getItem('f16TypingGameProgress');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.saveData = { ...this.saveData, ...parsed };
                console.log('Progress loaded:', this.saveData);
                this.updateProgressDisplay();
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
    
    updateHighScores() {
        let updated = false;
        
        // Update high score
        if (this.score > this.saveData.highScore) {
            this.saveData.highScore = this.score;
            updated = true;
            this.showAchievement('New High Score!', `${this.score} points`);
        }
        
        // Update max level
        if (this.level > this.saveData.maxLevel) {
            this.saveData.maxLevel = this.level;
            updated = true;
            this.showAchievement('New Level Reached!', `Level ${this.level}`);
        }
        
        // Update best combo
        if (this.maxCombo > this.saveData.bestCombo) {
            this.saveData.bestCombo = this.maxCombo;
            updated = true;
            if (this.maxCombo >= 10) {
                this.showAchievement('Combo Master!', `${this.maxCombo}x combo`);
            }
        }
        
        // Update typing stats
        if (this.typingStats.wpm > this.saveData.bestWPM) {
            this.saveData.bestWPM = this.typingStats.wpm;
            updated = true;
            if (this.typingStats.wpm >= 60) {
                this.showAchievement('Speed Demon!', `${this.typingStats.wpm} WPM`);
            }
        }
        
        if (this.typingStats.accuracy > this.saveData.bestAccuracy) {
            this.saveData.bestAccuracy = Math.round(this.typingStats.accuracy);
            updated = true;
            if (this.typingStats.accuracy >= 98) {
                this.showAchievement('Accuracy Master!', `${Math.round(this.typingStats.accuracy)}% accuracy`);
            }
        }
        
        // Update challenge scores
        if (this.challengeMode === 'speed' && this.challengeScore > this.saveData.bestSpeedChallenge) {
            this.saveData.bestSpeedChallenge = this.challengeScore;
            updated = true;
        }
        
        if (this.challengeMode === 'accuracy' && this.challengeScore > this.saveData.bestAccuracyChallenge) {
            this.saveData.bestAccuracyChallenge = this.challengeScore;
            updated = true;
        }
        
        // Update total stats
        this.saveData.totalWordsTyped += this.typingStats.correctWords;
        this.saveData.totalGamesPlayed++;
        
        if (updated) {
            this.saveProgress();
        }
        
        return updated;
    }
    
    showAchievement(title, description) {
        // Create achievement notification
        const achievement = document.createElement('div');
        achievement.className = 'achievement-notification';
        achievement.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <div class="achievement-title">${title}</div>
                <div class="achievement-description">${description}</div>
            </div>
        `;
        
        // Style the achievement notification
        achievement.style.position = 'fixed';
        achievement.style.top = '20px';
        achievement.style.right = '20px';
        achievement.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        achievement.style.color = '#000';
        achievement.style.padding = '15px';
        achievement.style.borderRadius = '10px';
        achievement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        achievement.style.zIndex = '100';
        achievement.style.animation = 'achievementSlide 4s ease-out forwards';
        achievement.style.display = 'flex';
        achievement.style.alignItems = 'center';
        achievement.style.gap = '10px';
        achievement.style.maxWidth = '300px';
        
        document.body.appendChild(achievement);
        
        // Remove after animation
        setTimeout(() => {
            if (achievement.parentNode) {
                achievement.parentNode.removeChild(achievement);
            }
        }, 4000);
    }
    
    updateProgressDisplay() {
        // Update the game menu with progress information
        let progressHTML = '';
        
        if (this.saveData.highScore > 0) {
            progressHTML += `
                <div class="progress-stats">
                    <h3>Your Best Records</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">High Score:</span>
                            <span class="stat-value">${this.saveData.highScore.toLocaleString()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Max Level:</span>
                            <span class="stat-value">${this.saveData.maxLevel}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Best Combo:</span>
                            <span class="stat-value">${this.saveData.bestCombo}x</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Best WPM:</span>
                            <span class="stat-value">${this.saveData.bestWPM}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Best Accuracy:</span>
                            <span class="stat-value">${this.saveData.bestAccuracy}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Words:</span>
                            <span class="stat-value">${this.saveData.totalWordsTyped.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Add progress display to menu
        let progressContainer = document.getElementById('progressDisplay');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'progressDisplay';
            
            const gameMenu = document.getElementById('gameMenu');
            const instructions = document.getElementById('instructions');
            if (gameMenu && instructions) {
                gameMenu.insertBefore(progressContainer, instructions);
            }
        }
        
        progressContainer.innerHTML = progressHTML;
    }

    // Start Speed Challenge
    startSpeedChallenge() {
        this.challengeMode = 'speed';
        this.challengeTimer = 30; // 30 seconds
        this.challengeScore = 0;
        this.gameState = 'challenge';
        
        this.hideAllMenus();
        this.showChallengeUI();
        this.startChallengeCountdown();
    }
    
    // Start Accuracy Challenge
    startAccuracyChallenge() {
        this.challengeMode = 'accuracy';
        this.challengeTimer = 0;
        this.challengeScore = 0;
        this.gameState = 'challenge';
        this.lives = 1; // No mistakes allowed
        
        this.hideAllMenus();
        this.showChallengeUI();
        this.startSpawning();
        this.startGameLoop();
    }
    
    // Challenge countdown timer
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
    
    // End challenge and show results
    endChallenge() {
        this.gameState = 'menu';
        this.stopGame();
        
        // Update challenge high scores
        let newRecord = false;
        if (this.challengeMode === 'speed' && this.challengeScore > this.saveData.bestSpeedChallenge) {
            this.saveData.bestSpeedChallenge = this.challengeScore;
            newRecord = true;
        } else if (this.challengeMode === 'accuracy' && this.challengeScore > this.saveData.bestAccuracyChallenge) {
            this.saveData.bestAccuracyChallenge = this.challengeScore;
            newRecord = true;
        }
        
        // Update typing stats
        this.updateHighScores();
        
        let message = '';
        if (this.challengeMode === 'speed') {
            message = `Speed Challenge Complete!\nWords typed: ${this.challengeScore}\nWPM: ${this.typingStats.wpm}`;
            if (newRecord) message += '\n🎉 NEW SPEED RECORD! 🎉';
        } else if (this.challengeMode === 'accuracy') {
            message = `Accuracy Challenge Complete!\nWords typed: ${this.challengeScore}\nAccuracy: ${this.typingStats.accuracy}%`;
            if (newRecord) message += '\n🎉 NEW ACCURACY RECORD! 🎉';
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
    
    // Get word from custom dictionary
    getCustomWord(category = 'custom') {
        const wordList = this.customWordLists[category];
        if (wordList && wordList.length > 0) {
            return wordList[Math.floor(Math.random() * wordList.length)];
        }
        return getRandomWord('easy'); // fallback
    }
    
    // Pause functionality
    togglePause() {
        if (this.gameState === 'playing' || this.gameState === 'challenge') {
            // Pause the game
            this.gameState = 'paused';
            this.pauseStartTime = Date.now();
            
            // Stop intervals
            if (this.spawnInterval) clearInterval(this.spawnInterval);
            if (this.gameLoop) clearInterval(this.gameLoop);
            
            // Show pause menu
            document.getElementById('pauseMenu').classList.remove('hidden');
            
            console.log('Game paused');
        } else if (this.gameState === 'paused') {
            // Resume the game
            this.gameState = this.challengeMode ? 'challenge' : 'playing';
            
            // Adjust start time to account for pause duration
            if (this.pauseStartTime && this.typingStats.startTime) {
                const pauseDuration = Date.now() - this.pauseStartTime;
                this.typingStats.startTime += pauseDuration;
            }
            
            // Hide pause menu
            document.getElementById('pauseMenu').classList.add('hidden');
            
            // Restart game loops
            this.startSpawning();
            this.startGameLoop();
            
            console.log('Game resumed');
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