# 🎨 Simple Download Gallery (SDG)

A lightweight, no‑bloat WordPress plugin for **beautiful image galleries with direct downloads**.
Built for speed, accessibility and clean integration – no jQuery, no bullshit.

---

## ✨ Features

* 📐 **Responsive grid gallery** (4 / 3 / 2 / 1 columns)
* 🔍 **Fullscreen lightbox** with smooth zoom animation
* ⬅️➡️ **Keyboard & swipe navigation**
* ⬇️ **Direct download buttons** per image
* ♿ **Accessible** (ARIA roles, focus handling, keyboard support)
* 🚀 **Vanilla JavaScript** – zero dependencies
* 🎯 **Theme‑agnostic** (works perfectly with Divi, Gutenberg, Classic Editor)

---

## 🧠 Why this plugin?

Most gallery plugins are:

* overloaded
* slow
* locked behind paywalls
* impossible to customize

**SDG does one thing well:**
Show images cleanly and let users download them.
Perfect for freebies, printables, resources, mockups or media kits.

---

## 🧩 How it works

The plugin outputs a simple HTML structure:

* `.sdg-gallery` → grid container
* `.sdg-item` → single image card
* `View` → opens the lightbox
* `Download` → direct file download

The lightbox is injected dynamically and only when needed.

---

## 🛠 Installation

1. Download or clone this repository
2. Copy the folder into:

   ```
   /wp-content/plugins/simple-download-gallery
   ```
3. Activate **Simple Download Gallery** in WordPress
4. Use the provided shortcode or block (depending on your setup)

---

## 🧪 Tech Stack

* PHP (WordPress Plugin API)
* Vanilla JavaScript (ES5 compatible)
* Modern CSS Grid + Flexbox
* Zero external libraries

---

## ♿ Accessibility highlights

* `role="dialog"` & `aria-modal`
* Keyboard navigation (ESC, ← →)
* Focus trapping & focus return
* Screen‑reader friendly image titles
* Body scroll lock while lightbox is open

---

## 📱 Mobile friendly

* Swipe left / right to navigate
* Large tap targets
* Optimized layout for phones & tablets
* No accidental background scrolling

---

## 🎨 Customization

All styles are located in:

```
sdg-styles.css
```

You can safely override colors, spacing or animations in your theme or child theme.

---

## 🚧 Roadmap (optional ideas)

* [ ] Gutenberg block
* [ ] Download counter
* [ ] Masonry layout option
* [ ] File type icons (PDF, ZIP, PNG…)
* [ ] Admin UI for galleries

---

## 📄 License

MIT License
Use it. Fork it. Sell it. Improve it.
Just don’t pretend you wrote it alone 😉

---

## 💬 Author

Built with ❤️ and way too much attention to detail.
If you like clean WordPress plugins – you’ll feel at home here.

---

Have fun & happy downloading 🚀
