# Appassionata Website — Staff Change Guide

A step-by-step guide for adding or removing faculty members from the website.

---

## Key Links

| Resource | URL |
|---|---|
| **Live website** | https://www.amusicva.com/ |
| **GitHub repository** | https://github.com/irenology/amusicva-site |
| **Vercel dashboard** | https://vercel.com (log in with the account that owns the project) |

---

## Overview

All faculty data lives in one file:

```
client/src/pages/Home.tsx
```

There are **three places** inside that file you must update whenever a teacher is added or removed.

---

## How to Remove a Faculty Member

### Step 1 — Clone the repo (first time only)

```bash
git clone https://github.com/irenology/amusicva-site.git
cd amusicva-site
```

If you already have it cloned, pull the latest changes first:

```bash
git pull
```

### Step 2 — Install dependencies (first time only)

```bash
pnpm install
```

### Step 3 — Open the file to edit

```
client/src/pages/Home.tsx
```

### Step 4 — Find and delete the faculty entry (Place 1 of 3)

Search for the teacher's name. You will find an object inside the `faculty` array near the top of the file (around line 103). Delete the entire object block, from `{` to `},`.

**Example — what was removed for Teymour Saifi:**

```tsx
// DELETE this entire block:
{
  name: "Teymour Saifi",
  instrument: "Electric Bass",
  short: "...",
  long: "...",
  unsplash: "...",
},
```

### Step 5 — Remove the lesson-to-teacher mapping (Place 2 of 3)

Further down the file, find the `lessonToTeacher` object. Delete the line that maps the teacher's instrument.

```tsx
// BEFORE:
const lessonToTeacher: Record<string, string> = {
  "Piano": "Norman Charette",
  "Electric Bass": "Teymour Saifi",   // ← DELETE this line
  ...
};
```

### Step 6 — Remove the lesson card (Place 3 of 3)

Inside the `Lessons` function, find the `lessons` array. Delete the object for the instrument that teacher taught.

```tsx
// DELETE this line:
{ icon: "🎸", title: "Electric Bass", desc: "Rock, jazz, ambient, and experimental. Improvisation and composition." },
```

### Step 7 — Verify your changes

Run this command to confirm no references remain:

```bash
grep -n "TeacherName\|InstrumentName" client/src/pages/Home.tsx
```

If nothing is printed, you're clean.

### Step 8 — Test locally (optional but recommended)

```bash
pnpm dev
```

Open http://localhost:5000 in your browser and check:
- Faculty section: teacher's card should be gone
- Lessons section: instrument card should be gone
- Clicking remaining lesson cards should still open the booking modal

### Step 9 — Commit your changes

```bash
git add client/src/pages/Home.tsx
git commit -m "Remove [Teacher Name] from faculty and lessons"
git push
```

---

## Deployment

The site auto-deploys via **Vercel**. As soon as you `git push` to the `main` branch on GitHub, Vercel picks up the change and redeploys automatically — no extra steps needed.

You can watch the deploy progress at:  
https://vercel.com → your project → Deployments tab

The live site will update within 1–2 minutes.

---

## How to Add a New Faculty Member

The process is the reverse of removal. Add entries in the same three places:

### Place 1 — Add to the `faculty` array

```tsx
{
  name: "New Teacher Name",
  instrument: "Their Instrument",
  short: "One-sentence bio shown on the card.",
  long: "Full bio paragraph shown when expanded.",
  unsplash: "https://link-to-their-photo.jpg",
},
```

### Place 2 — Add to `lessonToTeacher`

```tsx
"Their Instrument": "New Teacher Name",
```

### Place 3 — Add a lesson card

```tsx
{ icon: "🎷", title: "Their Instrument", desc: "Short description of what they teach." },
```

Then commit and push as in Step 9 above.

---

## Changing a Teacher's Bio or Photo

Only edit Place 1 (the `faculty` array). Change the `short`, `long`, or `unsplash` fields as needed. Commit and push.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `pnpm: command not found` | Run `npm install -g pnpm` first |
| Site not updating after push | Check the Vercel Deployments tab for build errors |
| TypeScript error after editing | Make sure you didn't accidentally delete a trailing comma or brace |
| Build passes but wrong content shows | Hard-refresh the browser (Cmd+Shift+R on Mac) to clear cache |
