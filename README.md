# GoVentAway

A safe, judgment-free space to vent and feel heard. Pick what's bothering you, take it out on a stress avatar, then talk it through.

## Live demo

Deploy to GitHub Pages (steps below) and you'll get a URL like:
`https://<your-username>.github.io/<your-repo>/`

## Local preview

The site is plain static HTML/CSS/JS — no build needed to run it. From the project root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Deploying to GitHub Pages

1. **Push this folder to GitHub.** If you don't have a repo yet:
   ```bash
   git init
   git add .
   git commit -m "Initial GoVentAway deploy"
   git branch -M main
   git remote add origin git@github.com:<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. **Enable Pages** in the repo:
   - Go to **Settings → Pages**.
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Pick **`main`** branch and **`/ (root)`** folder. Save.
3. Wait 30–60s. Your site appears at `https://<your-username>.github.io/<your-repo>/`.

That's it — no Actions, no build pipeline. The pre-compiled JS in `js/` is what loads in the browser.

## Project structure

```
.
├── index.html          ← entry point (loads React from CDN + the compiled JS)
├── 404.html            ← friendly fallback that redirects home
├── js/
│   ├── ios-frame.js    ← iOS device chrome (compiled from ios-frame.jsx)
│   ├── tweaks-panel.js ← live-tweak panel (compiled from tweaks-panel.jsx)
│   └── app.js          ← the four screens + main App (compiled from app.jsx)
├── ios-frame.jsx       ← source for ios-frame.js
├── tweaks-panel.jsx    ← source for tweaks-panel.js
└── GoVentAway.html     ← original prototype (kept for reference)
```

## Editing the source

The `js/*.js` files are **generated** from the `.jsx` files. If you edit a `.jsx`, recompile:

```bash
# one-time setup
npm install --save-dev @babel/core @babel/cli @babel/preset-react

# compile each file
npx babel ios-frame.jsx     --presets=@babel/preset-react --out-file js/ios-frame.js
npx babel tweaks-panel.jsx  --presets=@babel/preset-react --out-file js/tweaks-panel.js
npx babel app.jsx           --presets=@babel/preset-react --out-file js/app.js
```

> The original `app.jsx` source lives inside the `<script type="text/babel">` block in `GoVentAway.html`. The build extracts it to a standalone file before compiling. If you want the standalone source checked in, copy the relevant inline block out into an `app.jsx` at the project root.

## Notes on the AI chat

The chat screen (Hear Me Out) was originally wired to `window.claude.complete()` — a Claude.ai-only API that doesn't exist on a public site. For the GitHub Pages build, replies come from a small canned-response pool with light keyword detection (anger/sadness/loneliness/etc. trigger more specific replies, and the conversation rotates through opener → middle → healing phases). It feels supportive without needing a backend.

If you want real AI responses later, swap `pickCannedReply` in `app.jsx` for a `fetch('https://api.anthropic.com/...')` call and recompile.

## Tech

- React 18 (loaded from unpkg CDN)
- Pure inline styles + a single CSS keyframes block — no Tailwind, no CSS framework
- Pre-compiled with Babel — no in-browser transformation, no Babel runtime shipped to users

## License

Whatever you want. Be kind to people venting.
