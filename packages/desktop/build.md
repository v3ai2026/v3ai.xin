## Build Desktop

Run the following commands in the `packages/desktop` directory:

```bash
pnpm dev:desktop   # development
pnpm build:desktop # build desktop app
```

Before building, `pnpm run prepare` is executed automatically. It decides whether to use a remote
URL or local static assets based on the `frontendDist` value.

---

## 1. Bundle a deployed website (remote URL)

If you want the desktop app to open an already deployed website (for example,
`https://your-production-url`):

1. Edit `src-tauri/tauri.conf.json`:

```jsonc
{
    "build": {
        "devUrl": "http://localhost:4090",
        "frontendDist": "https://your-production-url",
        "beforeDevCommand": "pnpm run prepare",
        "beforeBuildCommand": "pnpm run prepare",
    },
}
```

2. Run:

```bash
pnpm build:desktop
```

In this case `frontendDist` is a URL. The `prepare-frontend.js` script **skips any change** and uses
the remote URL as-is.

---

## 2. Bundle local static assets

If you want to package the built frontend assets into the desktop app:

1. At the project root, build your web app first (command depends on your web project):

```bash
# Example
pnpm build:web
```

The final static files should be output to:

- Prefer: `public/web`
- Fallback: `public`

2. Keep or set `frontendDist` in `src-tauri/tauri.conf.json` to a local directory path, for example:

```jsonc
{
    "build": {
        "devUrl": "http://localhost:4090",
        "frontendDist": "../../../public/web",
        "beforeDevCommand": "pnpm run prepare",
        "beforeBuildCommand": "pnpm run prepare",
    },
}
```

3. Run:

```bash
pnpm build:desktop
```

In this case `frontendDist` is a local directory. The `prepare-frontend.js` script will
automatically choose between `public/web` and `public`, and write the final value back to the config
file.
