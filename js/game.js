// F-16 Fighter Typing Game
class F16TypingGame {
    constructor() {
        this.gameState = 'menu'; // 'menu', 'playing', 'gameOver'
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemies = [];
        this.explosions = [];
        this.currentInput = '';
        this.targetEnemy = null;
        
        // Game settings
        this.enemySpeed = 1;
        this.spawnRate = 2000; // milliseconds
        this.maxEnemies = 5;
        
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
        this.enemiesContainer = document.getElementById('enemies');
        this.explosionsContainer = document.getElementById('explosions');
        
        this.init();
    }
    
    init() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        // Listen for keyboard input
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Initialize display
        this.updateUI();
        this.inputDisplay.textContent = '';
        
        console.log('Game initialized');
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
        
        // Hide menu, show game
        this.gameMenu.classList.add('hidden');
        this.gameOver.classList.add('hidden');
        
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
        if (this.gameState !== 'playing') return;
        
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
                // Word is incorrect or no target, just clear input
                this.currentInput = '';
                this.targetEnemy = null;
                this.clearEnemyHighlights();
                this.updateInputDisplay();
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
            this.currentInput += ' ';
        } else if (e.key.length === 1) {
            this.currentInput += e.key.toLowerCase();
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
        
        // Remove enemy
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            enemy.element.remove();
        }
        
        // Update score
        this.score += enemy.word.length * 10;
        this.updateUI();
        
        // Check for level up
        if (this.score > 0 && this.score % 500 === 0) {
            this.levelUp();
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
        const word = getRandomMixedWord(this.level);
        const enemy = {
            word: word,
            x: this.gameArea.offsetWidth,
            y: Math.random() * (this.gameArea.offsetHeight - 100) + 50,
            element: document.createElement('div')
        };
        
        // Create enemy element
        enemy.element.className = 'enemy';
        enemy.element.style.left = enemy.x + 'px';
        enemy.element.style.top = enemy.y + 'px';
        
        // Create word element
        const wordElement = document.createElement('div');
        wordElement.className = 'enemy-word';
        wordElement.textContent = word;
        enemy.element.appendChild(wordElement);
        
        this.enemiesContainer.appendChild(enemy.element);
        this.enemies.push(enemy);
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
            enemy.x -= this.enemySpeed;
            enemy.element.style.left = enemy.x + 'px';
            
            // Check if enemy reached the left side (player loses life)
            if (enemy.x < -100) {
                this.enemies.splice(i, 1);
                enemy.element.remove();
                
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
        
        // Clear intervals
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        if (this.gameLoop) clearInterval(this.gameLoop);
        
        // Show game over screen
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
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
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    new F16TypingGame();
});