# PROOFLEARN Learning History & SaaS Navigation Architecture

## 1. Product Purpose & Philosophy

> "Learning History exists only to answer: *What have I actually learned and proved?*"

PROOFLEARN deliberately rejects gamified LMS anti-patterns (such as artificial XP, streaks, badges, leaderboards, and attendance tracking). Instead, Learning History serves as an **authoritative, student-owned proof ledger** recording genuine evidence of independent comprehension and conceptual transfer.

---

## 2. Returning Student Flow

```
Returning Student
       │
       ▼
   Login with Google
       │
       ▼
  "What do you want to learn today?" (/learn)  ◄──────►  "Learning History & Evidence" (/history)
       │                                                              │
       ├──────────────────────────────────────────┐                   │
       ▼                                          ▼                   ▼
Choose Subject & Concept                 Continue Active Session   View Historical LEI Record
       │                                          │                   │
       ▼                                          ▼                   ▼
AI Learning Room ──► Practice ──► Proof Mode ──► Transfer ──► Learning Evidence View
```

---

## 3. Learning History Data Model & Schema

Historical items distinguish between **Completed** sessions (which provide authoritative LEI records) and **In Progress** sessions (which can be resumed without data loss):

| Field | Type | Description |
| :--- | :--- | :--- |
| `session_id` | `string` | Unique identifier for the proof session |
| `subject_slug` | `string` | Subject slug (e.g. `python`, `sql`) |
| `concept_slug` | `string` | Concept slug (e.g. `functions`, `joins`) |
| `subject_name` | `string` | Display name of the subject |
| `concept_name` | `string` | Display name of the concept |
| `stage` | `string` | Current stage: `independent`, `transfer`, or `completed` |
| `status` | `string` | Session status: `active` or `completed` |
| `started_at` | `string` (ISO 8601) | Timestamp when Proof Mode was initiated |
| `completed_at` | `string \| null` | Timestamp when Transfer Challenge was submitted |
| `evidence_available` | `boolean` | `true` only if both Proof and Transfer are finished |
| `lei_score` | `number \| null` | Server-calculated LEI score ($0.0 - 100.0$) |
| `interpretation` | `string \| null` | Product evidence interpretation band |

---

## 4. API Endpoints

### Get Learning History
- **Route**: `GET /api/v1/learning/history`
- **Auth**: Required (`Authorization: Bearer <token>`)
- **Query Parameters**:
  - `limit`: `int` (default: 20, min: 1, max: 100)
  - `offset`: `int` (default: 0)
  - `subject_slug`: `Optional[str]` (e.g. `python`, `sql`, `ai-ml`)
  - `status`: `Optional[str]` (`completed` | `in_progress`)
- **Ordering**: Server-side sorted newest first by `started_at` descending.
- **IDOR Protection**: Strictly scopes database queries to `current_user.id`.
- **Response (200 OK)**:
  ```json
  {
    "items": [
      {
        "session_id": "proof-923fe894-3874-4b5c-b172-e1a5f4f0391d",
        "subject_slug": "python",
        "concept_slug": "functions",
        "subject_name": "Python",
        "concept_name": "Functions",
        "stage": "completed",
        "status": "completed",
        "started_at": "2026-08-23T09:30:00Z",
        "completed_at": "2026-08-23T09:40:00Z",
        "evidence_available": true,
        "lei_score": 87.4,
        "interpretation": "Strong evidence of independent understanding"
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
  ```

---

## 5. Security & Privacy Guarantees

1. **Zero Public Exposure**: Learning history and LEI records are strictly private to the owning user. No public profile sharing or social tracking exists.
2. **Server-Side Scoring Authority**: LEI scores are never calculated or mutated on the frontend.
3. **No Fabricated Data**: Incomplete sessions display `evidence_available = false` and `lei_score = null`.
