# PROOFLEARN Learning Selection Specification

## 1. Product Flow

The core user experience begins immediately after authentication with a focused learning selection interface:

```
[Sign In with Google]
        ↓
[/learn: "What do you want to learn today?"]
        ↓
[1. Choose Subject (Python, Java, SQL, AI & ML, Data Science)]
        ↓
[2. Choose Concept (e.g. Variables, Functions, JOINs, Supervised Learning)]
        ↓
[Review Selection Summary]
        ↓
[Click "Start Learning"]
        ↓
[/learn/[subjectSlug]/[conceptSlug]] (Learning Session Ready)
```

---

## 2. Route Architecture

### 2.1 Catalog & Selection Route
- **Path**: `/learn`
- **Component**: [frontend/src/app/learn/page.tsx](file:///c:/Users/varap/Downloads/PROOFLEARN/frontend/src/app/learn/page.tsx)
- **Protection**: Server-side session verification via `supabase.auth.getUser()`. Unauthenticated requests redirect to `/auth/sign-in?redirectTo=/learn`.
- **Data Loading**: Server Component loads active curriculum subjects and concepts via the data access layer.

### 2.2 Concept Learning Route
- **Path**: `/learn/[subjectSlug]/[conceptSlug]`
- **Component**: [frontend/src/app/learn/[subjectSlug]/[conceptSlug]/page.tsx](file:///c:/Users/varap/Downloads/PROOFLEARN/frontend/src/app/learn/[subjectSlug]/[conceptSlug]/page.tsx)
- **Data Integrity**: Validates both URL slugs against the database and asserts relational ownership (`concept.subject_id === subject.id`).
- **Placeholder Foundation**: Displays concept metadata, difficulty tier, and outlines the 4-stage PROOFLEARN verification pipeline (AI Learning Room → Practice Engine → PROOF MODE → Transfer & LEI).

---

## 3. Data Access Layer

The data layer is abstracted into modular, typed helper functions:

### 3.1 Subjects Layer ([frontend/src/lib/data/subjects.ts](file:///c:/Users/varap/Downloads/PROOFLEARN/frontend/src/lib/data/subjects.ts))
- `getActiveSubjects(supabase)`: Fetches all `subjects` records with `is_active = true` ordered alphabetically.
- `getSubjectBySlug(supabase, slug)`: Retrieves a single active subject matching the URL slug.

### 3.2 Concepts Layer ([frontend/src/lib/data/concepts.ts](file:///c:/Users/varap/Downloads/PROOFLEARN/frontend/src/lib/data/concepts.ts))
- `getActiveConceptsBySubjectId(supabase, subjectId)`: Retrieves active concepts for a given subject.
- `getAllActiveConcepts(supabase)`: Retrieves all active concepts across all disciplines.
- `getSubjectAndConceptBySlugs(supabase, subjectSlug, conceptSlug)`: Queries the database and validates that the concept belongs strictly to the requested subject.

---

## 4. UI & Interactive Selection States

The interactive selection interface ([frontend/src/components/learning/learning-selector.tsx](file:///c:/Users/varap/Downloads/PROOFLEARN/frontend/src/components/learning/learning-selector.tsx)) adheres strictly to the Task 03 design system:

1. **Subject Cards**:
   - Distinct icons for each discipline (`Python`, `Java`, `SQL`, `AI & ML`, `Data Science`).
   - Selected state highlighted with emerald accent border, badge, and checkmark.
2. **Concept Cards**:
   - Filtered dynamically based on selected subject.
   - Semantic difficulty badges:
     - `Beginner`: Emerald accent (`border-emerald-500/40 text-emerald-400 bg-emerald-950/20`)
     - `Intermediate`: Amber accent (`border-amber-500/40 text-amber-400 bg-amber-950/20`)
     - `Advanced`: Rose accent (`border-rose-500/40 text-rose-400 bg-rose-950/20`)
3. **Selection Summary & Action**:
   - Shows live target summary: `Subject: Python / Concept: Functions`.
   - The **"Start Learning"** button is disabled until both a valid subject and concept are selected.

---

## 5. Security & Invariants

- **Row Level Security**: The `subjects` and `concepts` tables are public read-only (`is_active = true`). Ordinary users cannot create, edit, or delete curriculum topics.
- **Relational Integrity**: URLs with mismatched subjects and concepts (e.g. `/learn/sql/functions` where `functions` is a Python concept) are rejected and return a clean Not Found view.
- **Zero Client Trust**: All user identity checks are executed server-side via `@supabase/ssr`.

---

## 6. Future Task Boundary Reminder
- The AI Learning Room, Gemini API calls, Socratic dialogue, Practice engine, PROOF MODE lockdown, and LEI score computation are strictly omitted from Task 06 and will be implemented in subsequent tasks.
