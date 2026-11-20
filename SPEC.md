# Signal Garden — project specification

Working plan · November 19, 2026 · Owner: Priya · Peer reviewer: to be named

This extends the [existing project record](https://github.com/priyabriya/IS218-Signal-Garden/blob/main/docs/project-record.md), [research notes](https://github.com/priyabriya/IS218-Signal-Garden/blob/main/docs/research.md) and [review log](https://github.com/priyabriya/IS218-Signal-Garden/blob/main/docs/review.md). Put this file at the repository root. Planning basis is the November 12 draft supplied in this project chat. Current repository changes could not be read during this revision, so reconcile differences before implementation. All application behavior, tests and commands below are **planned**. Earlier documentation build results do not establish application correctness.

## Problem, audience and scope

A classmate with two minutes between classes should be able to recognize a repeating symbol sequence, predict its next symbol and return to a private record of their attempts. We will investigate whether a reviewed, AI-assisted clue improves their explanation of the pattern.

The working promise is **register/sign in → predict → save once → review private history → update account → sign out**. Symbols have text labels and keyboard-operable controls. Start with alternating and paired-symbol sequences, showing two complete cycles and stating that the pattern repeats.

The earlier comparison favored Signal Garden over Scene Seed, a private game-pitch notebook. Prediction has an independently checkable result and supports a bounded clue experiment. A garden presentation offers a recognizable theme. A plain sequence worksheet is the simpler presentation alternative, retained if the theme obscures the task.

Scope includes authentication, one-turn puzzles, replay, persisted results, a private dashboard, display-name edits and password changes. Multiplayer, payments, leaderboards, social sharing, email recovery, runtime AI calls and a large puzzle library are out of scope. The separate RPS-001 assignment retains its original requirements. The career research site still needs its URL and reciprocal link.

## Prioritized backlog and acceptance criteria

Priya owns implementation, documentation and automated checks. A real classmate reviews comprehension and usability. Reviewer identity and meeting date remain open.

| Priority / story | Acceptance criteria | Depends on |
| --- | --- | --- |
| P0 · S1 Account access | Register a unique normalized username, sign in and sign out. Invalid credentials produce a useful generic error. Protected routes reject anonymous requests. Logout invalidates the active server session. | Database and session foundation |
| P0 · S2 Predict | Show two complete cycles, labeled choices and a clue. Compute the answer on the server from the stored puzzle. Reject unsupported choices and another user's turn. Show the result and explanation, then offer a fresh turn. | S1, pure rule functions |
| P0 · S3 Save | Save one result per owned turn atomically. Retrying or double-clicking returns the original result. A restart and new login preserve history. A failed transaction leaves no partial result. | S2, database constraints |
| P0 · S4 Dashboard | Show only the signed-in user's correct count, completed count and 20 most recent completed rounds, newest first. Empty history offers a first puzzle. Ownership checks protect direct URLs as well as lists. | S3 |
| P0 · S5 Maintain account | Edit a display name of 1–40 trimmed characters. Password changes require the current password and matching new-password confirmation. Change and session revocation commit together. All old sessions fail afterward, including the current session. | S1 |
| P1 · E1 Clue experiment | Compare a hand-written clue and up to three AI drafts on equivalent paper puzzles. Record actual guesses, explanations and spoilers. Keep the hand-written fallback if drafts confuse readers or reveal the answer. | S2 specification, real participants |
| P1 · R1 Peer revision | Partner opens a source, explains a choice and identifies an assumption. Record feedback, decision, linked change/check and retry in an issue. | Browsable documentation |

Proposed input limits are a 3–30 character ASCII username using letters, digits and underscores, and a 12–128 character password that preserves spaces. These are design choices to review before S1. Validate at the server and show the same limits on forms. Handle normalized username collisions with a database uniqueness constraint.

## Technical architecture and data flow

```text
Browser — Jinja forms, labeled puzzle, dashboard
   | HTTPS in hosted use; session cookie + CSRF token
   v
Flask routes — load session, identify owner, validate form
   |                    |
   v                    v
Pure puzzle rules     Account / round operations
   |                    | parameterized SQL + transaction
   +--------------------v
                     SQLite
                     Users 1 ─── * Sessions
                     Users 1 ─── * Rounds

GitHub → Actions → VitePress research site → GitHub Pages
```

An authenticated GET creates an owned puzzle turn and renders its public sequence. Submission looks up that turn by both ID and session owner, validates the guess, computes the expected answer, and conditionally completes the row in one transaction. A duplicate submission reads the saved outcome. Dashboard queries filter by the same owner and completed state. The client never supplies the score or trusted owner ID.

| Entity | Minimum fields and invariants |
| --- | --- |
| Users | ID, unique normalized username, display name, password hash, creation time |
| Sessions | ID, unique hash of random opaque session token, user foreign key, expiry, revocation time. Load and validate on every authenticated request. |
| Rounds | ID, user foreign key, rule version, sequence snapshot, expected symbol, optional guess/outcome/completion time, creation time. The row ID identifies a single turn. Completion fields must be populated together. |

Store UTC timestamps. Enable foreign keys on every connection. Use versioned schema migrations and test them on a copy of existing data. Preserve sequence snapshots so old history remains explainable after rule edits. Store the database and backups outside the source checkout and container image.

### Stack choices and alternatives

| Choice | Reason and trade-off |
| --- | --- |
| Python 3.12+, Flask, Jinja | Fits the course example and small server-rendered form flow. Django supplies more account machinery but increases framework scope. A React/API split adds a second application boundary without an identified interaction need. |
| Flask-Login, Flask-WTF, Werkzeug hashing | Reuse session integration, CSRF protection and password-hash utilities. Application code still owns registration, authorization and revocation. Check compatibility and pin dependencies during the first slice. |
| SQLite with Python's sqlite3 | Simple local persistence and transactional writes. PostgreSQL is the next candidate if multi-instance deployment or concurrent write volume requires it. |
| VitePress on GitHub Pages | Publishes research using the existing workflow. The Flask app needs its own running server. Start with a local demonstration; public app hosting remains undecided. |
| No external runtime service | The first application has no model API cost or dependency. AI drafting is a design activity, with retained prompts and reviewed outputs. |

Assume one application instance and a small class audience. Local development and the public research repository use existing resources. A hosted application may require paid persistent storage or compute, with provider and budget checked before selection. Use a production WSGI server and HTTPS for public deployment. Keep secrets in environment configuration, debug mode off, cookies HttpOnly and SameSite, and Secure cookies enabled under HTTPS. Escape user text, protect every state-changing form with CSRF, use parameterized queries and never log passwords or session tokens. Decide a login-throttling mechanism before any public app release.

## Code structure and design reasoning

| Proposed path | Responsibility |
| --- | --- |
| app/__init__.py | Application factory, environment configuration and extension setup |
| app/auth.py | Registration, login/logout, session loading and expiry/revocation |
| app/account.py | Display-name and password operations |
| app/game.py | Turn creation/submission and private dashboard routes |
| app/rules.py | Pure sequence generation, expected symbol and result evaluation |
| app/db.py + migrations/ | Connections, schema changes and focused persistence operations |
| app/forms.py | Shared field validation and CSRF forms |
| app/templates/ + app/static/ | Presentation, labels, focus styles and responsive layout |
| tests/unit/, tests/integration/, tests/e2e/ | Independently expected rule results, real request/database checks and browser journeys |

Apply SOLID proportionately. Single responsibility keeps rules free of web and database code. Open/closed design is useful if a new sequence can be added through a small function without editing submission logic. Substitutable sequence functions must accept the same inputs and meet the same output contract. Interface segregation favors a few focused functions over a general-purpose service object. Dependency inversion is achieved by passing configuration and database connections into operations, allowing a temporary database in tests. Avoid introducing inheritance or a dependency-injection framework for these goals alone.

The one pattern experiment compares a conditional selecting sequence types with a dictionary of interchangeable Strategy functions. Run identical expected outputs, add a third pattern, and record clarity and edit locations. Keep the conditional if the Strategy makes maintenance harder. Transactions and unique constraints solve save-once behavior directly.

## Efficient tests and quality checks

| Criteria / risk | Planned evidence |
| --- | --- |
| S2 rule correctness | Unit tests with independent expected results for alternating and paired sequences, shortest supported cycle, repeated calls and invalid rule/choice values. Avoid deriving expected answers through the function under test. |
| S1 and S5 account security | Integration tests for valid login, duplicate normalized username, wrong password, field limits immediately below/at/above boundaries, CSRF rejection, expired session, logout and all-session revocation after password change. |
| S2–S4 ownership/persistence | Two synthetic users A/B, empty history and 21 completed rounds. Test direct cross-user reads/writes, correct aggregates, ordering, retry with a changed guess, concurrent duplicate submissions, transaction failure and reopening the same database after an app restart. |
| Complete journey | One Chromium end-to-end test for signup → prediction → saved history → refresh → display-name change → logout. A second covers password change and an already-open old session. |
| Comprehension and accessibility | Real partner tries keyboard navigation, labels and a narrow screen, then explains the clue. Record the paper experiment separately from automated checks. |

Use pytest, Flask's test client, temporary file-backed SQLite databases and pytest-playwright. Fixtures seed synthetic data with known answers and deterministic ordering. Keep CSRF enabled in integration tests and submit actual tokens. Isolate databases per test. A file-backed database allows restart and locking behavior to be tested. Browser tests cover wiring and navigation while unit/integration tests carry the larger input matrix.

The following commands become executable after the first slice creates and pins development dependencies and the proposed paths. They have **not run** against an application.

```sh
python -m pip install -r requirements-dev.txt
python -m ruff format --check app tests
python -m ruff check app tests
python -m mypy app/rules.py
python -m bandit -r app
python -m pip_audit -r requirements.txt
python -m pytest tests/unit tests/integration -q
python -m playwright install chromium
python -m pytest tests/e2e -q --browser chromium
```

Configure Ruff formatting and E4/E7/E9/F/I/B rules in pyproject.toml, covering errors, unused names, import ordering and common bugs. Add strict mypy checking to pure rules first. Bandit checks application security patterns; pip-audit checks pinned runtime dependencies. Review findings individually and fix them before merge, or link a specific justified exception with owner and follow-up. Do not suppress whole categories to get a passing run.

Run formatting, lint and focused unit tests while editing. Before a pull request, run all fast checks and request/database tests. CI repeats these on application changes and runs the two browser tests after fast checks succeed. Install Chromium with its CI system dependencies there. Documentation changes run `npm ci` and `npm run docs:build`; combined changes run both paths. Avoid running the full browser suite repeatedly during every small edit. Keep failure traces as CI artifacts and add a regression test at the lowest useful level.

## Build and review sequence

| Milestone | Owner, dependencies and review exit |
| --- | --- |
| M0 · Agree on plan | Priya reconciles this SPEC with repository docs and names a peer. Peer reviews audience, input rules, first screen and the experiment. Create linked issues for open decisions. |
| M1 · First complete slice | Priya builds S1–S3 using one fixed puzzle, one saved result and signout. Depends on M0 and a temporary database test setup. Exit requires independently expected rule tests plus registration, ownership, duplicate-save and persistence checks. |
| M2 · Return and maintain | Priya completes S4/S5, schema migration checks and two browser journeys. Depends on M1. Peer follows the journey and records concrete confusion in an issue. |
| M3 · Learn and revise | Priya compares the Strategy alternative and runs the clue trial with participants. Depends on working rules and available reviewers. Link actual evidence, make accepted changes and ask the reviewer to retry. |
| M4 · Handoff | Priya verifies setup from a fresh checkout, current CI, docs links and demonstration instructions. Discuss Docker startup with data on a persistent volume and secrets outside the image when that course work is due. Public hosting depends on a provider/budget decision. |

Keep milestones small and assign dates after confirming the class schedule and reviewer availability. Each pull request links its story issue, acceptance criteria, change and check run. The peer reviews user-facing clarity; Priya reviews implementation and explains ownership, transaction and session behavior. A second technical reviewer may be named if available. Record actual participation without implying a review occurred.

Use the existing [Plan review issue template](https://github.com/priyabriya/IS218-Signal-Garden/issues/new?template=plan-review.md). For each comment choose implement, investigate, defer or decline and give a reason. Link accepted changes and checks, record the reviewer's retry, then close resolved issues. Keep unfinished work open with a next action. Current issue/change/check links are pending creation; use the [issue list](https://github.com/priyabriya/IS218-Signal-Garden/issues) and [Actions history](https://github.com/priyabriya/IS218-Signal-Garden/actions) to connect evidence as it exists.

## Open decisions and AI review

- Priya and peer confirm whether the sequence instructions and proposed input limits make sense before M1.
- Priya supplies the career-site URL and adds reciprocal links during M0.
- Priya selects a public application host only if needed, after checking storage durability, backup/restore, HTTPS, costs and throttling.
- Priya records paper-trial observations before deciding whether to retain AI-written clues. A failed trial can justify the hand-written fallback.

Codex drafted this specification from the existing conversation record. Priya should review each proposed rule and explain why it fits the project. For AI-assisted changes, keep a short expectation/result/next-time note, verify factual claims with original sources, and test behavior using independently chosen examples. Real peer review remains pending.

Technical sources checked November 19, 2026: [Flask-Login responsibilities and limits](https://flask-login.readthedocs.io/en/latest/), [Flask-WTF CSRF protection](https://flask-wtf.readthedocs.io/en/1.2.x/csrf/), and [Ruff documentation](https://docs.astral.sh/ruff/). These support tool choices; they do not verify this application's behavior.
