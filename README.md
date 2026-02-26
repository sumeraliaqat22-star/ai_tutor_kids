# 🚀 QuestLearn: Gamified Math & Coding Platform

Welcome to **QuestLearn**, a fun, interactive, and gamified web-based EdTech platform designed specifically for children! This project bridges the gap between learning and playing by turning Mathematics and Coding into exciting adventures.

## 🌟 What is this project?
QuestLearn is a frontend prototype built to demonstrate how gamification can make learning STEM subjects frictionless. 
- **The Student Hub:** A gamified dashboard with a progress map, XP (Experience Points) tracker, daily goals, and an achievement trophy case.
- **Math Pathway:** Features interactive puzzles covering Geometry (detecting shapes), Multiplication (visual arrays with apples), and Fractions (slicing pizza).
- **Code Canvas Sandbox:** A Scratch-inspired playground where kids can drag and drop code blocks to control a rocket ship on screen, with a toggle to view the real generated JavaScript!

---

## 🎨 Visual Design System

This project was built with a kid-friendly, high-contrast visual design system.

### **Color Palette**
- **Electric Blue (`#6366f1`)**: Primary actions, the Code Cove island.
- **Soft Purple (`#a855f7`)**: Secondary actions, the Math Island backgrounds.
- **Bright Yellow (`#facc15`)**: Highlights, XP bar glows, Gold badges.
- **Success Green (`#22c55e`)**: Correct feedback states, Level unlocks.
- **Warning Red (`#ef4444`)**: Error shakes, Daily Flame icons.
- **Dark IDE Slate (`#0f172a`)**: Isolated specifically for the Code Canvas editor to give it a "Hacker/Developer" vibe.

### **Typography**
- **Headings**: `Fredoka` (A rounded, incredibly friendly geometric font imported via Google Fonts).
- **Body Text**: `Nunito` (A highly legible, soft sans-serif for reading instructions).
- **Code Editor**: Browser-default `Monospace`.

### **Assets & Icons**
To keep the project lightweight and fast, all "Mascots" and "Icons" are rendered natively using high-quality Emojis (🤖, 🦊, 🍕, 🍎, 🚀). FontAwesome provides some structural icons.

---

## 🏃‍♂️ How to Run the Project Locally

Because QuestLearn is built with plain **HTML, CSS, and Vanilla JavaScript**, there are **NO build steps** or node_modules required!

1. Clone or download this repository to your computer.
2. Ensure you have the following files in the primary folder:
   - `index.html` (Landing Page)
   - `hub.html` (Student Hub Dashboard)
   - `math.html` (Math Pathway)
   - `code.html` (Code Canvas)
   - `math.js` (Math level logic)
   - `code.js` (Code sandbox execution engine)
   - `script.js` (Landing page interactions)
   - `styles.css` (The global stylesheet containing all CSS)
3. **Double-click `index.html`** or drag it into your web browser (Chrome, Firefox, Safari, Edge).
4. That's it! You can click any button to navigate between pages (e.g. from the Hub to the Code Canvas).

---

## 📂 Code Structure & Comments
The codebase has been purposely commented to explain which part does what:
- Internal JS files (like `code.js`) are separated into `State`, `Initializers`, `Drag & Drop Logic`, and the `Execution Engine`.
- The `styles.css` is separated by massive comment blocks (`/* ========================= */`) denoting global styles vs component-specific styles (e.g., Code Layout vs Math Layout).
