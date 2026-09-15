# TradeRath Frontend

The frontend is a React application built with Vite.

## Prerequisites

- Install Node.js 22.12 or newer in the Node 22 series, with npm. The repository's
  root `.nvmrc` selects Node 22; the locked Vite version requires at least 22.12
  when using Node 22.
- Check that both commands work in your terminal:

```powershell
node --version
npm --version
```

## Run locally on Windows

Open PowerShell and run:

```powershell
cd C:\Users\itachi\git\traderath\frontend
npm ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Replace the path if you cloned the repository elsewhere. Run npm commands inside
`frontend/`, where `package.json` and `package-lock.json` are located.
`npm ci` installs the exact dependencies from the lockfile and requires access to
the npm registry. The copy command creates local configuration only if it does
not already exist.

Open <http://localhost:3000> in your browser. The project's development script
requests port **3000**, not Vite's usual default of 5173. If that port is busy,
use the actual URL printed in the terminal. Keep the terminal running while you
use the app; source edits update the browser automatically. Press **Ctrl+C** to
stop the server.

For later sessions, run `npm run dev` from `frontend/`. Repeat `npm ci` when the
lockfile changes or dependencies need to be reinstalled.

### macOS/Linux alternative

From the repository root:

```bash
cd frontend
npm ci
test -f .env.local || cp .env.example .env.local
npm run dev
```

## Recovery used when localhost refused to connect

On this Windows checkout, `http://localhost:3000` returned
`ERR_CONNECTION_REFUSED` because no frontend server was listening. The dependency
installation was incomplete: `node_modules/` existed, but Vite and its React
plugin were missing. The default Node.js version was also **20.11.1**, below the
locked Vite version's requirement (`^20.19.0 || >=22.12.0`).

The successful recovery used the available bundled **Node.js 24.19.0** runtime,
completed the dependency installation with `npm ci`, and launched Vite directly.
This did not upgrade the system Node installation or change the npm scripts.

### 1. Select the compatible runtime

These paths were verified on this computer. They are specific to this installation
and may change when the bundled runtime is updated. On another computer, use the
standard Node 22 setup above.

```powershell
cd C:\Users\itachi\git\traderath\frontend
$frontendNode = 'C:\Users\itachi\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$frontendNpm = 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js'
$env:PATH = (Split-Path -Parent $frontendNode) + ';' + $env:PATH
& $frontendNode --version
```

The `&` operator runs the executable stored in the variable. The PATH change
applies to this PowerShell session and its child processes, so installation
scripts also find the compatible Node version. It does not change the permanent
Windows PATH.

### 2. Complete the dependency installation

Run in the same PowerShell window, with any existing frontend server stopped:

```powershell
& $frontendNode $frontendNpm ci --no-audit --no-fund
```

This invokes npm explicitly through the selected Node runtime, installs the
versions in `package-lock.json`, and replaces an incomplete `node_modules/`.
The two flags skip the audit request and funding messages; they do not skip
dependency installation. Wait for the command to finish successfully before
continuing. The recovery installed 487 packages.

### 3. Start the server

In the same window:

```powershell
& $frontendNode node_modules\vite\bin\vite.js --host localhost --port 3000 --strictPort
```

Wait for Vite to print `Local: http://localhost:3000/`, then open that URL and
refresh any previous error page. `--host localhost` binds the server locally;
`--strictPort` makes it report an error if port 3000 is occupied instead of silently
choosing another port. Keep the terminal open; **Ctrl+C** stops the server.

To restart later with this workaround, repeat step 1 and step 3 in a new
PowerShell window. Repeat step 2 only when dependencies need to be installed
again, and stop Vite before doing so. Opening the browser URL alone does not
start the server.

### 4. Verify that it responds

From a second PowerShell window:

```powershell
(Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing).StatusCode
(Invoke-WebRequest -Uri http://localhost:3000/src/main.jsx -UseBasicParsing).StatusCode
```

Both checks returned **200** after the recovery, confirming that Vite served the
page and transformed JavaScript entry point. These checks do not verify login or
data features. No `.env.local` file was created during this recovery; the client
used its built-in PocketBase URL fallback, `http://127.0.0.1:8090`.

## Connect login and data

The frontend can start independently, but login and data features currently
require a running PocketBase service with the application's collections.
Starting only the FastAPI health endpoint on port 8000 does not provide those
features yet.

The default setting in `frontend/.env.local` is:

```dotenv
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

Use the address of your development PocketBase service if it differs. Restart
`npm run dev` after changing this file. Keep credentials out of `VITE_*` variables:
these values are exposed to the browser.

For a local PocketBase instance, install the version recorded in
`backend/pocketbase/.pocketbase-version` and put its executable on `PATH`, as
described in the [backend README](../backend/README.md). In a second PowerShell
terminal, run:

```powershell
cd C:\Users\itachi\git\traderath\backend\pocketbase
$env:TRADERATH_DEMO_USER_PASSWORD = Read-Host 'Choose a local-only demo password (input is visible)'
pocketbase serve --http=127.0.0.1:8090
```

Running from this directory makes the repository's `pb_hooks` and `pb_migrations`
available to PocketBase. A fresh database's demo migration requires the password
environment variable. After successful initialization, the seeded account is
`demo@rathtrade.com` with the password you supplied. If the account already exists,
this variable does not reset its password. Keep this service running alongside
Vite. Do not commit the password, executable, or generated `pb_data` directory.

## Preview a production build locally

From `frontend/`, run:

```powershell
npm run build
npm run start
```

The build creates `frontend/dist/`; `start` serves that build with Vite preview
on port 3000. Stop the development server first or use the URL printed by preview.
Rebuild after source changes. This preview is for local checking, not production
hosting.

## Troubleshooting

- **`npm` or `node` is not recognized:** install Node.js and reopen your terminal.
  If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm` in these commands.
- **`package.json` is missing:** change into the repository's `frontend/` folder.
- **Unsupported Node version:** check `node --version` against the prerequisites.
- **`vite` is not recognized:** run `npm ci` successfully before starting Vite.
- **Port or IPv6 binding problem:** try
  `npm run dev -- --host 127.0.0.1 --port 3001`, then open the printed URL.
- **Login or data requests fail:** check that PocketBase is running, its migrations
  completed, and `VITE_POCKETBASE_URL` points to it. Restart Vite after editing
  `.env.local`.

## Checks

Run these from `frontend/` in a POSIX-compatible shell such as Git Bash:

```bash
npm run lint
npm run build
```

The existing `lint` script uses POSIX shell syntax. For a direct lint check with
Windows' default npm shell, use `npm run lint:warn`.
