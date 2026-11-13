# Project record

**Signal Garden · Plan draft · November 12, 2026**  
Audience: a classmate playing a first, two-minute pattern puzzle between classes.

## Two possible first screens

| Concept | First interaction | Saved record | Trade-off |
| --- | --- | --- | --- |
| Signal Garden | Read a strip of leaf and bud symbols, then predict the next symbol. Each symbol also has a text label. | Sequence, guess, correct answer and outcome | One turn has an independently checkable answer. Ambiguous sequences need careful testing. |
| Scene Seed | Pick a setting and constraint, then revise a one-sentence game pitch. | Prompt, edited pitch and revision date | A useful private idea notebook, but judging whether a prompt improved the pitch requires a more subjective review. |

Choose **Signal Garden**. Its short turn makes it possible to test rules on paper and discuss whether a clue helped someone reason. The larger idea is a garden where different plants have recognizable rhythms. The first promise is one puzzle type.

## Five stories for the working promise

1. **Account access.** As a new player, I can register, sign in, see a useful error for invalid credentials and sign out when finished.
2. **Make a prediction.** I can read the rule that a short pattern repeats, inspect two complete cycles and choose a labeled symbol. After submitting, I see the answer and why it follows.
3. **Keep a result.** I can return after signing out and find my prediction saved once, even if I submitted twice. I can start another turn.
4. **Review my history.** My private dashboard shows correct guesses, total rounds and recent puzzles. An empty dashboard offers my first puzzle.
5. **Maintain my account.** I can edit my display name and change my password by supplying the current one. A successful password change ends my active sessions and lets me sign in again with the new password.

## Architecture sketch

```text
Browser · labeled forms, puzzle view, private dashboard
    │ session cookie and CSRF-protected form submission
    ▼
Flask · authenticate session, validate choice, resolve signed-in owner
    ├── Puzzle rules · derive next symbol and score from stored puzzle
    └── SQLite transaction · save round once for this owner
            ├── Users and revocable sessions
            └── Rounds · owner, puzzle, guess, answer, outcome, time
```

**Proposed stack.** Python, Flask, Jinja, Flask-Login, Flask-WTF, Werkzeug password hashing and SQLite. Use pytest for rule and request tests, plus a browser walkthrough. On each private request, resolve the user from the server-validated session and scope the query to that owner. A unique owner/turn constraint handles retries. Keep the database outside the static documentation and any disposable container.

**Pattern comparison.** Start with a conditional selecting alternating or paired symbols. Try two interchangeable sequence functions behind the same interface (Strategy). Run the same expected sequences against both designs. Add a third sequence on paper and compare the number and clarity of edits. Keep the conditional if the functions add more navigation than they save.

## Paper experiment

Show two short cycles, such as leaf–bud–bud / leaf–bud–bud. The next symbol is leaf. Compare a human clue (“Look for the shortest group that starts again”) with a reviewed AI draft on a second, equally long puzzle. Swap the clue order for a second reader if available. Ask each reader to predict the next symbol and explain the rule in their own words. Record wrong guesses, accidental spoilers and requests for clarification.

**Stopping point.** Review up to three AI drafts. Discard any clue that states the answer or contradicts either cycle. Keep the hand-written clue if readers cannot explain the pattern after the AI hint. No trials have run. The outcome and next revision belong in the [review log](./review).

## Portfolio connection

Career research site URL pending from the author. When available, replace this sentence with its link and add a return link there to this programming notebook. Both sites remain separate Plan deliverables. The posted RPS-001 assignment keeps its original scope.
