# F-16 Fighting Falcon Typing Game ✈️

An exciting typing game where you pilot an F-16 fighter jet and defeat enemy aircraft by typing words accurately and quickly!

![Game Preview](https://img.shields.io/badge/Game-F--16%20Typing%20Battle-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyTDMgMTJNMjEgMTJMMTUgMThNMjEgMTJMMTUgNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+)

## 🎮 Game Overview

Take control of an F-16 Fighting Falcon and engage in aerial combat through the power of typing! Enemy fighter jets approach with words displayed above them. Type the words correctly and press Enter to destroy enemies before they reach your base.

## ✨ Features

- **Authentic F-16 Fighter Jets**: Beautiful SVG graphics of F-16 Fighting Falcons
- **Progressive Difficulty**: Words get harder as you advance through levels
- **Real-time Feedback**: Visual indicators for correct/incorrect typing
- **Score System**: Points based on word complexity and accuracy
- **Lives System**: Start with 3 lives - don't let enemies through!
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Explosion effects and aircraft movement

## 🚀 How to Play

1. **Start the Game**: Click the "Start Game" button
2. **Type Words**: Enemy F-16s will appear with words above them
3. **Submit with Enter**: Type the complete word and press Enter to fire
4. **Defend Your Base**: Don't let enemy aircraft reach the left side
5. **Score Points**: Longer words give more points
6. **Survive**: You have 3 lives - game over when they're gone!

### 🎯 Controls

| Key | Action |
|-----|--------|
| `A-Z` | Type letters |
| `Space` | Add space (for multi-word phrases) |
| `Backspace` | Delete last character |
| `Enter` | Submit word and fire at enemy |

## 🛠️ Installation

### Option 1: Direct Download
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start playing immediately!

### Option 2: Local Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/Ceyhun2056/Typing-game.git

# Navigate to the directory
cd Typing-game

# Serve locally (Python 3)
python -m http.server 8000

# Or with Node.js
npx serve .

# Open http://localhost:8000 in your browser
```

## 📁 Project Structure

```
Typing-game/
├── index.html              # Main game page
├── css/
│   └── style.css           # Game styling and animations
├── js/
│   ├── game.js            # Main game logic
│   └── words.js           # Word lists and difficulty management
├── assets/
│   ├── clean-jet-plane.svg # F-16 fighter jet graphics
│   └── explosion.svg      # Explosion animation
├── LICENSE                # MIT License
└── README.md             # This file
```

## 🎨 Game Mechanics

### Difficulty Levels
- **Easy Words**: 3-4 letters (cat, dog, run, fly)
- **Medium Words**: 4-6 letters (plane, magic, brave)
- **Hard Words**: 6-8 letters (thunder, warrior, crystal)

### Scoring System
- Points = Word Length × 10
- Level up every 500 points
- Enemy speed increases with each level
- More enemies spawn as difficulty increases

### Visual Feedback
- 🟡 **Yellow**: Word being typed (partial match)
- 🟢 **Green**: Word completed correctly
- 🔴 **Red**: Incorrect typing
- 💥 **Explosions**: Enemy destroyed!

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Structure and canvas
- **CSS3**: Styling, animations, and responsive design
- **Vanilla JavaScript**: Game logic and mechanics
- **SVG Graphics**: Scalable F-16 fighter jet illustrations

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Performance
- 60 FPS gameplay
- Lightweight (< 100KB total)
- No external dependencies
- Optimized for smooth performance

## 🎯 Game Features

### Word System
- **Dynamic targeting**: Auto-selects closest matching enemy
- **Flexible input**: Backspace to correct mistakes
- **Manual submission**: Press Enter to confirm and fire
- **Visual highlighting**: See your progress as you type

### Aircraft System
- **Player F-16**: Blue fighter jet (you)
- **Enemy F-16s**: Red fighter jets with color filtering
- **Realistic design**: Authentic F-16 Fighting Falcon appearance
- **Smooth movement**: Enemies fly from right to left

## 🏆 Tips for High Scores

1. **Type Accurately**: Avoid mistakes to maintain speed
2. **Target Strategically**: Focus on closest enemies first
3. **Learn Patterns**: Memorize common words for faster typing
4. **Stay Calm**: Don't panic when multiple enemies appear
5. **Practice**: Improve your typing speed over time

## 🔄 Game States

- **Menu**: Start screen with instructions
- **Playing**: Active gameplay with enemies and typing
- **Game Over**: Final score display and restart option

## 🐛 Troubleshooting

### Common Issues

**Game won't start?**
- Ensure JavaScript is enabled in your browser
- Check browser console for any error messages

**Graphics not loading?**
- Verify all files are in the correct directories
- Try refreshing the page or clearing browser cache

**Typing not working?**
- Click on the game area to ensure it has focus
- Check if Caps Lock or other modifiers are affecting input

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Typing-game.git

# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes and test locally
# Commit and push when ready
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

