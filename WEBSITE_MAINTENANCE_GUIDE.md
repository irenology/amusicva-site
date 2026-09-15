# Appassionata Music School — Website Maintenance Guide

This guide covers everything you need to maintain and update the Appassionata website from scratch. No prior experience with this project is assumed.

There are **two ways** to make changes — choose whichever suits you:

- **Method A (Recommended): Claude Code** — chat with an AI assistant that reads and edits the code for you. No need to manually edit files or understand code syntax.
- **Method B: Manual editing** — edit the code yourself in a text editor. Requires more steps but no AI subscription needed.

---

## Important Links

| Resource | URL |
|---|---|
| **Live website** | https://www.amusicva.com/ |
| **GitHub repository** | https://github.com/irenology/amusicva-site |
| **Vercel dashboard** | https://vercel.com (no login needed for publishing — see below) |

---

## Part 1 — Access You Need

### GitHub access
✅ **Already done** — GitHub Collaborator (Write) access has been shared with **appassionatava@gmail.com**.

Check your inbox for an invitation email from GitHub and click **Accept invitation**. If you can't find it, check your spam folder or visit https://github.com/irenology/amusicva-site/invitations directly.

> This is the only access you need. **You do not need Irene's Vercel account or password.** Vercel automatically deploys the site whenever anyone with GitHub Write access pushes code — it's connected to the repository, not to a specific person. Your GitHub account is enough.

---

## Part 2 — One-Time Setup (Both Methods)

The following steps are required regardless of which method you use.

### Step 1 — Install Git

Git is the tool that syncs code between your computer and GitHub.

- **Mac:** Open Terminal and run `git --version`. If it prompts you to install, follow the prompt.
- **Windows:** Download from https://git-scm.com/download/win and install with default settings.

Verify:
```bash
git --version
# Should print: git version 2.x.x
```

### Step 2 — Install Node.js

- Download the **LTS** version from https://nodejs.org and install with default settings.

Verify:
```bash
node --version
# Should print: v20.x.x or higher
```

### Step 3 — Install pnpm

```bash
npm install -g pnpm
```

### Step 4 — Configure Git with your identity

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Step 5 — Generate a GitHub Personal Access Token

This token is your password for pushing code to GitHub.

1. Go to https://github.com/settings/tokens
2. Click **Generate new token → Generate new token (classic)**
3. Give it a name like `amusicva-site`
4. Set expiration to **No expiration** (or 1 year)
5. Under **Select scopes**, check **repo**
6. Click **Generate token**
7. **Copy the token now** — GitHub only shows it once. It looks like `ghp_xxxxxxxxxxxx`

Save it somewhere safe (e.g. a password manager).

### Step 6 — Clone the repository

```bash
git clone https://YOUR_GITHUB_USERNAME:YOUR_TOKEN@github.com/irenology/amusicva-site.git
cd amusicva-site
```

Example:
```bash
git clone https://johnsmith:ghp_abc123xyz@github.com/irenology/amusicva-site.git
cd amusicva-site
```

### Step 7 — Install project dependencies

```bash
pnpm install
```

Takes 1–2 minutes. Do this once.

---

## Method A — Using Claude Code (Recommended)

Claude Code is an AI assistant that runs in your terminal. Instead of editing code manually, you describe what you want in plain English and it makes the changes for you.

### Step A1 — Create an Anthropic account

Go to https://claude.ai and sign up for a free account (or use an existing one).

### Step A2 — Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Verify:
```bash
claude --version
```

### Step A3 — Log in

```bash
claude
```

The first time you run this, it will open a browser window asking you to log in with your Anthropic (claude.ai) account. Follow the prompts.

### Step A4 — Navigate to the project folder

```bash
cd amusicva-site
```

### Step A5 — Make changes by chatting

Run Claude Code inside the project folder:

```bash
claude
```

You'll see a prompt. Just describe what you want in plain English. Examples:

> "Remove Jane Smith from the faculty section and delete her violin lesson card"

> "Add a new teacher: John Lee, instrument is Cello, short bio is '...' "

> "Change the phone number in the contact section to 703-555-1234"

Claude Code will find the relevant code, make the change, and show you what it did.

### Step A6 — Publish the changes

After Claude Code makes the edits, run these three commands:

```bash
git add client/src/pages/Home.tsx
git commit -m "Brief description of what you changed"
git push
```

The live site updates automatically within 1–2 minutes.

---

## Method B — Manual Editing

### Step B1 — Install a code editor

Download **Visual Studio Code** (free): https://code.visualstudio.com

### Step B2 — Pull latest code before every edit

```bash
git pull
```

### Step B3 — Open the file to edit

All faculty information lives in one file:

```
client/src/pages/Home.tsx
```

Open it in VS Code.

### How to remove a faculty member (4 places to edit)

Use **Find** (`Cmd+F` on Mac, `Ctrl+F` on Windows) to search for the teacher's name.

**Place 1 — The `faculty` array** (bio and photo)

Find and delete the entire block for that teacher:

```tsx
// Delete from { to },
{
  name: "Teacher Name",
  instrument: "Their Instrument",
  short: "...",
  long: "...",
  unsplash: "https://...",
},
```

**Place 2 — The `lessonToTeacher` mapping**

Search for `lessonToTeacher` and delete the teacher's line:

```tsx
"Their Instrument": "Teacher Name",   // ← delete this line
```

**Place 3 — The lesson card**

Search for the instrument name and delete its card:

```tsx
{ icon: "🎸", title: "Their Instrument", desc: "..." },   // ← delete this line
```

**Place 4 — Fix the faculty grid layout**

After removing a teacher, the photo grid needs to be updated so the remaining teachers stay evenly spaced and centered.

Search for `grid-cols-` in `Home.tsx`. You will find a line like:

```tsx
<div className="grid md:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
```

Change the number to match how many teachers remain:

| Teachers remaining | Change to |
|---|---|
| 5 | `md:grid-cols-5` and remove `max-w-4xl mx-auto` |
| 4 | `md:grid-cols-4 max-w-4xl mx-auto` ← current |
| 3 | `md:grid-cols-3 max-w-3xl mx-auto` |
| 2 | `md:grid-cols-2 max-w-xl mx-auto` |

### How to add a faculty member (same 4 places)

**Place 1 — Add to `faculty` array** (just before the closing `];`):

```tsx
{
  name: "New Teacher Name",
  instrument: "Their Instrument",
  short: "One sentence shown under their photo.",
  long: "Full bio paragraph shown when expanded.",
  unsplash: "https://direct-link-to-their-photo.jpg",
},
```

**Place 2 — Add to `lessonToTeacher`:**

```tsx
"Their Instrument": "New Teacher Name",
```

**Place 3 — Add a lesson card:**

```tsx
{ icon: "🎷", title: "Their Instrument", desc: "Short description." },
```

**Place 4 — Update the faculty grid layout**

Search for `grid-cols-` and update the number to match the new total count of teachers (see the table in the removal section above).

### Step B4 — Verify your changes

```bash
grep -n "TeacherName" client/src/pages/Home.tsx
```

If the command prints nothing, all references are removed.

### Step B5 — Publish the changes

```bash
git add client/src/pages/Home.tsx
git commit -m "Brief description of what you changed"
git push
```

---

## Part 3 — How Deployment Works

You never need to log into Vercel or manually deploy. The full flow is:

```
You edit code on your computer
       ↓
git push  (sends code to GitHub)
       ↓
Vercel automatically detects the push
       ↓
Vercel builds and deploys the site
       ↓
https://www.amusicva.com updates within ~2 minutes
```

If you want to check that the deployment succeeded, ask Irene to check https://vercel.com → `amusicva-site` → Deployments tab (green = success, red = error).

---

## Part 4 — Troubleshooting

| Problem | What to do |
|---|---|
| `pnpm: command not found` | Run `npm install -g pnpm` first |
| `claude: command not found` | Run `npm install -g @anthropic-ai/claude-code` first |
| `git push` fails with "authentication failed" | Your token may have expired — generate a new one at https://github.com/settings/tokens, then run: `git remote set-url origin https://YOUR_USERNAME:NEW_TOKEN@github.com/irenology/amusicva-site.git` |
| Site not updating after push | Ask Irene to check Vercel → Deployments for errors |
| Changes look wrong in browser | Hard-refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows) |

---

## Quick Reference

```bash
# One-time setup
git clone https://USERNAME:TOKEN@github.com/irenology/amusicva-site.git
cd amusicva-site
pnpm install

# Every time before editing
git pull

# After editing (both methods)
git add client/src/pages/Home.tsx
git commit -m "What you changed"
git push
```
