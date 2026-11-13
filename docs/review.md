# Checks and peer review

**Working log · November 12, 2026.** This page tracks the same [Signal Garden project record](./project-record).

| Status | Check | Evidence or next action |
| --- | --- | --- |
| Observed | Documentation build | VitePress 1.6.4 built the notebook using a repository subpath. Live deployment is pending. |
| Observed | Source review | Matched the [research notes](./research) to GDC, Valve and the course pages. |
| Planned | Puzzle rules | For leaf–bud repeated twice expect leaf. For leaf–leaf–bud repeated twice expect leaf. Reject a symbol outside the allowed set. |
| Planned | Account and database | Use synthetic accounts A and B. Check invalid credentials, duplicate submission, persistence after restart, and denial when B requests A’s round or attempts an account edit. |
| Planned | Browser journey | Register, inspect empty history, play twice, refresh, update name, change password, verify old sessions and password fail, sign in again and sign out. |
| Planned | Design experiment | Compare the conditional and Strategy with the same expected outputs. Record one edit needed for an additional pattern. |
| Planned | Creative experiment | Run the two-clue paper trial and record what readers actually inferred. |
| Planned | Peer review | Awaiting a real partner, their feedback and a retry. |

## Partner walkthrough

1. Open an original source from the field notes. Point to the evidence behind one design choice.
2. Explain why the first version uses pre-written clues. Which alternative did we consider?
3. Identify one assumption or confusing instruction. Describe what you expected and what you found.

Open a **Plan review** issue in the repository with the partner’s actual words or an agreed paraphrase. Choose implement, investigate, defer or decline and explain why. For an accepted change, link the commit or pull request, verification and the partner’s retry. Close resolved issues. Leave unfinished items open with a named next action.

## Revision history

The first draft is ready for a partner. Add the issue URL and outcome here after the session. Source checks, automated tests and real peer feedback each have their own evidence.
