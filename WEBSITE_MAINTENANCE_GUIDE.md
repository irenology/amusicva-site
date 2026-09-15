# Appassionata Music School — Website Maintenance Guide

This guide covers everything you need to maintain and update the Appassionata website from scratch. No prior experience with this project is assumed.

---

## Important Links

| Resource | URL |
|---|---|
| **Live website** | https://www.amusicva.com/ |
| **GitHub repository** | https://github.com/irenology/amusicva-site |
| **Vercel dashboard** | https://vercel.com (log in with the shared account) |

---

## Part 1 — Access You Need

Before you can do anything, you need the following access granted by the site owner (Irene):

### 1. GitHub access
✅ **Already done** — GitHub Collaborator access has been shared with **appassionatava@gmail.com**.

Check your inbox for an invitation email from GitHub and click **Accept invitation**. If you can't find it, check your spam folder or visit https://github.com/irenology/amusicva-site/invitations directly.

> **Why:** Without Write access you can read the code but can't push changes. Every update to the site goes through GitHub.

### 2. Vercel access (optional but recommended)
Vercel is the platform that hosts the live site. Deployments happen automatically when you push to GitHub — you don't *need* Vercel access just to publish changes. However, having access lets you check deployment logs if something breaks.

- Irene goes to: https://vercel.com → the `amusicva-site` project → **Settings → Members**
- Invites you by email with **Member** role

> **Why:** The site auto-deploys from GitHub. Vercel access is only needed to monitor deployments or roll back if there's a problem.

### Summary of required access

| Access | Required to publish changes? | How to get it |
|---|---|---|
| GitHub Collaborator (Write) | ✅ Yes | Irene invites you via GitHub settings |
| Vercel Member | ❌ Optional | Irene invites you via Vercel settings |

---

## Part 2 — One-Time Setup on Your Computer

Do this once. Skip steps you've already completed.

### Step 1 — Install Git

Git is the tool that syncs code between your computer and GitHub.

- **Mac:** Open Terminal and run `git --version`. If it prompts you to install, follow the prompt.
- **Windows:** Download from https://git-scm.com/download/win and install with default settings.

Verify it works:
```bash
git --version
# Should print something like: git version 2.x.x
```

### Step 2 — Install Node.js

The project runs on Node.js.

- Download the **LTS** version from https://nodejs.org
- Install with default settings

Verify:
```bash
node --version
# Should print: v20.x.x or higher
```

### Step 3 — Install pnpm

pnpm is the package manager this project uses (similar to npm but faster).

```bash
npm install -g pnpm
```

Verify:
```bash
pnpm --version
# Should print: 9.x.x or similar
```

### Step 4 — Install a code editor

If you don't have one, download **Visual Studio Code** (free):
https://code.visualstudio.com

### Step 5 — Configure Git with your identity

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Step 6 — Generate a GitHub Personal Access Token

This token is your password for pushing code to GitHub.

1. Go to https://github.com/settings/tokens
2. Click **Generate new token → Generate new token (classic)**
3. Give it a name like `amusicva-site`
4. Set expiration to **No expiration** (or 1 year — your choice)
5. Under **Select scopes**, check **repo** (the top checkbox)
6. Click **Generate token**
7. **Copy the token now** — GitHub only shows it once. It looks like `ghp_xxxxxxxxxxxx`

Save it somewhere safe (e.g. a password manager).

### Step 7 — Clone the repository

```bash
git clone https://YOUR_GITHUB_USERNAME:YOUR_TOKEN@github.com/irenology/amusicva-site.git
cd amusicva-site
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username and `YOUR_TOKEN` with the token you just generated.

Example:
```bash
git clone https://johnsmith:ghp_abc123xyz@github.com/irenology/amusicva-site.git
```

### Step 8 — Install project dependencies

```bash
pnpm install
```

This downloads all the libraries the project needs. It takes 1–2 minutes.

### Step 9 — Test that it runs locally

```bash
pnpm dev
```

Open http://localhost:5000 in your browser. You should see the Appassionata website. Press `Ctrl+C` to stop the server.

---

## Part 3 — How to Remove a Faculty Member

All faculty information lives in one file:

```
client/src/pages/Home.tsx
```

There are **three places** in that file you must update. Here is the exact process, using the removal of **Teymour Saifi** as a worked example.

---

### Before you start — pull the latest code

Always do this before making changes to make sure you have the most up-to-date version:

```bash
git pull
```

---

### Place 1 — The `faculty` array (bio and photo)

Open `client/src/pages/Home.tsx` in VS Code.

Use **Find** (`Cmd+F` on Mac, `Ctrl+F` on Windows) to search for the teacher's name.

You will find an entry inside the `faculty` array that looks like this:

```tsx
{
  name: "Teymour Saifi",
  instrument: "Electric Bass",
  short: "DC-based bassist, composer, and educator...",
  long: "Teymour Saifi is a versatile musician...",
  unsplash: "https://assets.zyrosite.com/.../teymour-saifi-1-jpeg.jpg",
},
```

**Delete the entire block** — from the opening `{` to the closing `},` (inclusive).

---

### Place 2 — The `lessonToTeacher` mapping

Still in `Home.tsx`, search for `lessonToTeacher`.

You will find a block like this:

```tsx
const lessonToTeacher: Record<string, string> = {
  "Piano": "Norman Charette",
  "Guitar & Ukulele": "Bogdan (Bobo) Pejić",
  "Violin & Viola": "Vesna Pejić",
  "Flute & Piccolo": "Erin McAfee",
  "Electric Bass": "Teymour Saifi",   // ← DELETE this line
  "Composition": "Bogdan (Bobo) Pejić",
};
```

Delete only the line that maps the teacher's instrument.

---

### Place 3 — The lesson card

Search for `Electric Bass` (or the instrument name for the teacher you're removing).

You will find a line inside the `lessons` array:

```tsx
{ icon: "🎸", title: "Electric Bass", desc: "Rock, jazz, ambient, and experimental. Improvisation and composition." },
```

**Delete this line.**

---

### Verify — confirm nothing is left

In your terminal, run:

```bash
grep -n "Teymour\|Electric Bass" client/src/pages/Home.tsx
```

If the command prints nothing, you're done. If it prints lines, go back and delete what's left.

---

### Test locally

```bash
pnpm dev
```

Open http://localhost:5000 and check:
- **Faculty section**: the teacher's photo card is gone
- **Lessons section**: the instrument card is gone
- **Other faculty cards**: still clickable and working

---

### Save and publish

```bash
git add client/src/pages/Home.tsx
git commit -m "Remove [Teacher Name] from faculty and lessons"
git push
```

That's it. Vercel detects the push and automatically redeploys the live site at https://www.amusicva.com within 1–2 minutes.

---

## Part 4 — How to Add a New Faculty Member

The reverse of removal. Add entries in the same three places.

### Place 1 — Add to `faculty` array

```tsx
{
  name: "New Teacher Name",
  instrument: "Their Instrument",
  short: "One sentence shown under their photo card.",
  long: "Full bio paragraph shown when the user clicks their photo.",
  unsplash: "https://direct-link-to-their-photo.jpg",
},
```

Add it at the end of the array, just before the closing `];`.

### Place 2 — Add to `lessonToTeacher`

```tsx
"Their Instrument": "New Teacher Name",
```

### Place 3 — Add a lesson card

```tsx
{ icon: "🎷", title: "Their Instrument", desc: "Short description of what they teach." },
```

Pick an appropriate emoji for the instrument.

Then commit and push as in Part 3.

---

## Part 5 — How Deployment Works

You never need to manually deploy. The workflow is:

```
You edit code on your computer
       ↓
git push (sends code to GitHub)
       ↓
Vercel automatically detects the push
       ↓
Vercel builds and deploys the site
       ↓
Live site updates within ~2 minutes
```

To check deployment status:
1. Go to https://vercel.com
2. Open the `amusicva-site` project
3. Click the **Deployments** tab
4. A green checkmark means success; a red X means something went wrong (click to see the error log)

---

## Part 6 — Troubleshooting

| Problem | What to do |
|---|---|
| `pnpm: command not found` | Run `npm install -g pnpm` and try again |
| `git push` fails with "authentication failed" | Your token may have expired — generate a new one at https://github.com/settings/tokens, then run: `git remote set-url origin https://YOUR_USERNAME:NEW_TOKEN@github.com/irenology/amusicva-site.git` |
| Site not updating after push | Check https://vercel.com → Deployments for errors |
| TypeScript error message in terminal | You likely deleted too much or left a stray character — check for missing commas or brackets |
| Changes look wrong in browser | Hard-refresh with `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows) to clear cache |
| Local site shows error page | Make sure `pnpm dev` is running and you opened http://localhost:5000 (not https) |

---

## Quick Reference

```bash
# One-time setup
git clone https://USERNAME:TOKEN@github.com/irenology/amusicva-site.git
cd amusicva-site
pnpm install

# Before every edit
git pull

# After every edit
git add client/src/pages/Home.tsx
git commit -m "Brief description of what you changed"
git push
```

**The only file you need to edit for faculty changes:**
```
client/src/pages/Home.tsx
```

**Three things to update in that file:**
1. `faculty` array — bio and photo
2. `lessonToTeacher` object — instrument-to-teacher mapping
3. `lessons` array — the lesson card on the homepage
