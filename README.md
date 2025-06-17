# Sentari Task Extractor

This project extracts **actionable tasks** from natural language diary or transcript entries using TypeScript. It was built as part of the Sentari interview challenge.

---

## ✨ Features

- ✅ Detects **actionable intent** using common verbs and time expressions
- 📆 Extracts structured fields:
  - `task_text`: full task phrase
  - `due_date`: relative or absolute date (e.g., “tomorrow”, “by July”)
  - `status`: defaulted to `"pending"`
  - `category`: inferred context like `health`, `home`, `work`, etc.
  - `priority`: derived from urgency indicators (`low`, `medium`, `high`)
- 🧪 Unit-tested with **>90% coverage** using Vitest

---
🧠 Explain Your Thinking
How do you detect actionable intent?

Actionable intent is detected using a combination of:
	•	Task-oriented verbs (e.g., call, schedule, submit, organize) matched via a curated set of keywords.
	•	Sentence segmentation to isolate individual actions from compound statements.
	•	Contextual clues (e.g., “I need to…”, “I should…”) that indicate the user is expressing a plan or intention.
This approach allows the parser to filter meaningful tasks from casual or reflective statements.

⸻

Why this structure?

The output format includes:
	•	task_text: the extracted actionable phrase
	•	due_date: relative or absolute, parsed from natural language
	•	status: defaulted to "pending"
	•	category: inferred from keywords (e.g., “doctor” → health)
	•	priority: optional, based on urgency indicators

This structure is:
	•	Cleanly aligned with typical to-do list schema and Supabase integration
	•	Scalable for filtering, summarizing, or displaying in UI
	•	Future-proof — easily supports extensions like reminders, calendar sync, or insights

⸻

How would this integrate into reminders or summaries?

With the structured task data:
	•	A reminder system can trigger notifications based on due_date and priority
	•	A daily or weekly summary can group tasks by category (e.g., health, home) or urgency
	•	The system could even generate insights like: “You’ve scheduled 5 work tasks this week”

⸻
