# Routine Sandbox — Claude Code Instructions

This repo exists to run a post-meeting routine triggered by the user. When the user asks to run the routine (or any equivalent phrasing), follow the full procedure below.

---

## Post-Meeting Routine

### Guard Clause — Already Ran Check
1. Call `list_meetings` (Fathom) to get the most recent recording.
2. Search the Notion Daily Work Notes database for an entry matching that meeting's date.
3. **If an entry already exists for that date → do nothing and tell the user.**
4. If no entry exists → proceed with all steps below.

---

### Step 1 — Get the Full Transcript
- Call `get_meeting_transcript` with the recording_id and url of the latest meeting.
- Do not summarize from the Fathom AI summary alone — always read the full transcript.

---

### Step 2 — Check Open & Overdue ClickUp Tasks
Before creating any new tasks:
- Search ClickUp for all open tasks assigned to the user in the **List** list.
- Identify any **overdue tasks** (due date has passed, still open).
- Identify any **tasks that overlap** with new action items from the transcript — flag these as potential duplicates instead of creating a new task.
- Keep this list in context for use in Steps 4 and 6.

**Key IDs (do not re-discover these):**
| Resource | ID |
|---|---|
| ClickUp Workspace | `90132299797` |
| ClickUp Space (Local Handyman St. Louis) | `901313745132` |
| ClickUp List (List) | `901326813470` |
| ClickUp Assignee (St. Louis Admin / Lourdes) | `162138227` |
| Notion Daily Work Notes database | `7d360a23-5d92-43cc-9782-3cb1be4e77b0` |
| Notion Daily Work Notes data source | `4734ed0c-4d14-4bb0-9155-c2c019fdbdcb` |
| Notion "Today's Notes" template | `375c2133-f755-809d-9ab7-d5fe00848791` |

---

### Step 3 — Analyze the Transcript
Extract and organize the following from the transcript:

**A. Meeting summary** — all topics discussed, clearly and thoroughly, in bullet points. Include what was decided, what is pending, and any context that helps understand follow-up work.

**B. Action items for Lourdes (the user)** — for each one, also determine:
- **Category tag:** `Social Media`, `Automations`, `Operations`, `ClickUp Admin`, `Marketing`, `Content`, `Website`, or other as appropriate
- **Priority:** `urgent` (deadline this week or imminent), `high` (deadline within 2 weeks or explicitly emphasized), `normal` (no strong urgency), `low` (vague / someday)
- **Due date:** extract from transcript if mentioned; estimate if strongly implied (e.g., "by next week," "before Sunday")
- **Subtask flag:** if the item is a demo, test, or review tied to an existing ClickUp task, note the parent task to link it under

**C. Action items for Nikki** — list these separately; they go in the summary and a draft message (Step 7), not into ClickUp

**D. Nikki's previous action items** — check the most recent previous Notion entry (the one before today's). Cross-reference Nikki's listed action items against the current transcript. Note which were mentioned as completed and which appear to still be outstanding. Include this in the summary under a "Nikki Follow-Up Status" sub-section.

**E. Ambiguous items** — anything where it's unclear who owns it, or whether it should be a task. List these separately and ask the user before creating tasks for them.

**F. Questions for next meeting** — generate two types:
  1. **Clarifying questions for Nikki** — for each topic or project discussed, what would be useful to know to do the work better, faster, or with less back-and-forth? Frame these as things Lourdes could ask at the next meeting.
  2. **Unresolved / pending items** — decisions not yet made, inputs still waiting on Nikki, or anything left open-ended in the transcript.

---

### Step 4 — Create ClickUp Tasks (Lourdes's Items Only)
For each of Lourdes's action items:
- If a **duplicate or very similar open task** already exists in ClickUp → skip creation, flag the duplicate to the user.
- If it's a **subtask** of an existing task (demo, review, test) → create as a subtask under the parent using `parent` field.
- Otherwise → create a new task with:
  - `name`: clear, action-oriented task name
  - `markdown_description`: brief description + context from the meeting + specific instructions (what exactly to do, how, any constraints or notes from Nikki)
  - `list_id`: `901327095107`
  - `assignees`: `["162138227"]`
  - `status`: `to do`
  - `due_date`: YYYY-MM-DD if available
  - `priority`: urgent / high / normal / low (see Step 3B)
  - `tags`: category tag (see Step 3B) — only if the tag already exists in the space
- **Save the URL of every created task** to embed in the Notion entry (Step 6).

---

### Step 5 — Create the Notion Entry
1. Create a new page in the Daily Work Notes database using the data source ID `4734ed0c-4d14-4bb0-9155-c2c019fdbdcb`.
2. Apply the **"Today's Notes"** template (id: `375c2133-f755-809d-9ab7-d5fe00848791`).
3. Set `Name` to the date in the format **"[Weekday], [Month] [Day]th"** (e.g., "Thursday, June 19th"), set `date:Date:start` to the meeting date (YYYY-MM-DD), and set `Type` to `["Meeting Notes", "Priorities"]`.
4. After creation, use `replace_content` to fill in the page with the following structure. **Do NOT fill in End of Day Report or Notes & Pending Questions.**

```
# 🎯 Top priorities today
- [ ] [Priority 1 — most urgent/time-sensitive from today's meeting]
- [ ] [Priority 2]
- [ ] [Priority 3]
- [ ] [Priority 4 if applicable]

---

## Carryover from Last Meeting
[List any items from the previous Notion entry (Nikki's or Lourdes's) that appear to still be open or unresolved. If none, write "None identified."]

---

# 👥 Meeting notes

## [Meeting Title] — [Date]
**Participants:** [Names]

### [Topic 1]
[Bullet-point summary]

### [Topic 2]
...

### Nikki Follow-Up Status
[For each of Nikki's action items from the previous meeting: ✅ Completed / ⏳ Still pending / ❓ Not mentioned]

---

### Action Items — Nikki
- [ ] [Item 1]
- [ ] [Item 2]
...

---

# **Action items**
- [ ] [Item 1] → [ClickUp task URL]
- [ ] [Item 2] → [ClickUp task URL]
...

---

# 📋 Questions for Next Meeting

### Clarifying Questions for Nikki
**[Topic/Project Name]**
- [Question 1]
- [Question 2]

**[Topic/Project Name]**
- [Question 1]
...

### Open / Unresolved Items
- [Item still waiting on a decision or input]
...

---

# ✅ End of day report
  End of Day Report
✅
✅ 
✅ 

---

# 💡 Notes & Pending Questions
Random thoughts, follow-ups to research, things to remember…
```

---

### Step 6 — Draft Nikki's Action Item Message
Write a short, plain-language message Lourdes can send to Nikki (via WhatsApp or Slack) listing Nikki's action items from the meeting. Keep it brief, friendly, and scannable — bullet points, no jargon. Label it clearly so the user can copy-paste it.

Format:
```
--- Nikki's Action Items (copy to send) ---
Hey Nikki! Here's a quick recap of your to-dos from today:
• [Item 1]
• [Item 2]
...
Let me know if I missed anything!
```

---

### Step 7 — Deliver the Full Output to the User
Present everything in this order:

1. **Meeting Summary** (from Step 3A) — full, thorough, all topics covered
2. **Nikki's Action Items** — listed separately in the summary
3. **Nikki Follow-Up Status** — from previous meeting (Step 3D)
4. **⚠️ Flags / Ambiguous Items** — anything to confirm before acting (Step 3E)
5. **ClickUp Tasks Created** — table: task name, priority, due date, URL; plus any duplicates skipped
6. **Notion Entry Created** — confirm with link
7. **Nikki's Message Draft** — copy-paste ready (Step 6)
8. **Questions for Next Meeting** — both clarifying questions by topic + open/unresolved items (Step 3F)
9. **What I Can Help You Check Off** — list tasks from the action items where Claude can directly help (drafting, structuring, researching, building) and how

---

## Tone & Style Notes
- The transcript is not always precise about who is speaking. Use context to infer speaker — "St. Louis Admin" is Lourdes (the user); "Nikki Zavradinos" is the business owner.
- Be thorough and clear. This summary replaces re-watching the meeting.
- Flag anything ambiguous about task ownership before creating ClickUp tasks.
- ClickUp task descriptions should always include: where this came from (meeting date), the context, and specific instructions so the task is self-contained.

---

## Known People
- **Lourdes / St. Louis Admin** — the user running this routine; stlouis-admin@localhandyman.com
- **Nikki Zavradinos** — business owner; gives direction, reviews work, assigns tasks
- **Bridget** — handles estimates and some client-facing work; also has a contact assignment in GHL
- **Dan** — co-owner, estimator, Nikki's husband
- **Mary** — newer hire; taking over smaller estimates and phone calls
- **Pareto** — the business coaching/training program Nikki uses

## Known Systems
- **GHL / GoHighLevel / HighLevel** — CRM and marketing automation platform
- **HCP / Housecall Pro** — field service management (scheduling, estimates, invoicing)
- **ClickUp** — project management (primary task tracker for this routine)
- **Meta / Meta Business Suite** — social media scheduling
- **Slack** — team communication (being rolled out to replace WhatsApp group chats)
- **Fathom** — AI meeting recorder; source of transcripts for this routine
- **Google Drive** — document storage (newsletter drafts, GHL guides, etc.)
