# Phasmo Journal - GitHub Pages Version

A complete static version of the Phasmo Journal ghost evidence tracker, now deployable on GitHub Pages!

## 🌟 Features

### ✅ **Complete Feature Set**
- **20 Beautiful Themes** - Purple Aurora, Blue Sunset, Green Forest, Red Crimson, and 16 more!
- **Ghost Evidence Tracking** - Track all 7 evidence types with visual cycling
- **Difficulty Modes** - Amateur, Intermediate, Professional, Nightmare, Insanity
- **Smart Filtering** - Filter ghosts by evidence, speed, and hunt threshold
- **Ghost Library** - Complete database of all 27 ghosts with detailed information
- **Interactive Tools** - Speed scaler, BPM finder, sanity timers
- **Confirmation System** - Mark ghosts as confirmed or excluded
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🎨 **20 Themes Available**
1. Default Dark / Default Light
2. Purple Aurora / Blue Sunset
3. Green Forest / Red Crimson
4. Orange Sunset / Pink Rose
5. Teal Ocean / Indigo Dream
6. Emerald Forest / Amber Gold
7. Violet Magic / Cyan Electric
8. Rose Gold / Lime Bright
9. Slate Modern / Zinc Rain
10. Stone Earth / Neutral Warm / Mauve Delicate

### 📱 **Optimized Layout**
- **No Scrolling Sidebar** - All content fits perfectly without scrolling
- **Compact Design** - Efficient use of screen space
- **Clean Navigation** - Easy theme switching and mode toggling
- **Mobile Responsive** - Adapts to all screen sizes

## 🚀 **Deploy to GitHub Pages**

### **Step 1: Create GitHub Repository**
1. Create a new repository on GitHub
2. Name it `phasmo-journal` (or your preferred name)
3. Make it public (required for free GitHub Pages)

### **Step 2: Upload Files**
1. Upload all files from this folder to your repository:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `data.js`
   - `README.md`

### **Step 3: Enable GitHub Pages**
1. Go to your repository settings
2. Scroll down to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

### **Step 4: Access Your Site**
Your site will be available at: `https://yourusername.github.io/phasmo-journal/`

## 🔧 **Local Development**

### **Option 1: Simple Local Server**
1. Open terminal in the project folder
2. Run: `python -m http.server 8000` (Python) or `npx serve .` (Node.js)
3. Open: `http://localhost:8000`

### **Option 2: Live Server (VS Code)**
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📁 **File Structure**
```
phasmo-journal-gh-pages/
├── index.html          # Main HTML file
├── styles.css          # All 20 themes + CSS
├── app.js             # Main application logic
├── data.js            # Ghost data & utilities
└── README.md          # This file
```

## 🎯 **How to Use**

### **Theme Selection**
- Click the "Theme" button in the navigation
- Choose from 20 beautiful color schemes
- Themes are automatically saved

### **Evidence Tracking**
- Click evidence buttons to cycle through states:
  - **Unselected** → **Selected** → **Excluded**
- Evidence limit adjusts based on difficulty

### **Ghost Management**
- Click ghost cards to view detailed information
- Use confirm/exclude buttons for ghost management
- Filter by speed and hunt threshold

### **Tools**
- Switch between Filters and Tools modes
- Use timers, speed scaler, and BPM finder
- All tools work offline

## 🌐 **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 📊 **Technical Details**
- **Pure JavaScript** - No dependencies
- **CSS Custom Properties** - Dynamic theming
- **Local Storage** - Saves preferences
- **Responsive Design** - Mobile-first approach
- **Accessibility** - Keyboard navigation support

## 🎨 **Theme System**
Each theme uses CSS custom properties for:
- Background colors
- Text colors
- Accent colors
- Border colors
- Interactive states

Themes are stored in localStorage and persist across sessions.

## 🔮 **Future Enhancements**
Potential additions for future versions:
- Ghost behavior animations
- Sound effects for different ghosts
- Multiplayer session tracking
- Custom ghost creation
- Evidence combination hints

## 📝 **License**
This project is open source. Feel free to modify and distribute.

## 🤝 **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy Ghost Hunting! 👻**