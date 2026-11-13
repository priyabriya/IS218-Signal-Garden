# Should AI help write the clues?

**Working notes · November 12, 2026.** For classmates reviewing a first game design, the question is whether an AI-assisted clue helps a new player recognize a repeating signal while leaving the next move for them to infer.

## What the sources establish

| Original source · checked November 12, 2026 | Evidence | Consequence for this plan |
| --- | --- | --- |
| [GDC’s November industry survey](https://gdconf.com/state-of-the-game-industry-november-2026/) | Among respondents, 40% used generative AI in their work and 55% judged its industry impact negatively. Those questions measure different things. | Adoption alone gives us no measure of clue quality. Compare drafts on a player task. |
| [Valve’s Steamworks Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) | Valve distinguishes AI-assisted content created during development from content generated while the game runs. The survey asks about safeguards for live generation. | Keep a record of any generated wording retained for players. Recheck the survey if Steam distribution becomes a goal. |
| [Course project instructions](https://kaw393939.github.io/is218-studio/projects/individual.html) | The project calls for a complete account journey, private history and a pattern comparison. | Give one saved prediction enough context to be meaningful on a return visit. |
| [Instructor’s local game example](https://kaw393939.github.io/is218-studio/examples/full-game.html) | Its account application runs locally and its public preview covers the game core. | Host this research on Pages. Plan a separate server for private records when implementation begins. |

## Two ways to generate a clue

**Draft during design.** Ask for three phrasings of a known rule, check each against two cycles on paper, then keep one reviewed sentence. Every player who draws the same puzzle can receive the same text. Revising a clue requires editing the game content.

**Generate during play.** A model could adapt a hint to a player's previous guesses. That adds delay, variable wording and another place to accidentally reveal the answer. We have no player evidence yet that adaptation earns that cost.

**Working choice.** Try design-time drafting for story 2. The server will own the answer and score independently of the clue. A hand-authored clue remains available if every draft gives too much away.

**Assumption to challenge.** A wrong guess followed by a rule explanation may teach more than a hint that names the next symbol. The [paper experiment](./project-record#paper-experiment) gives a reviewer a way to challenge that assumption.

## AI assistance

Codex located sources, drafted these notes and proposed the concepts and tests. During drafting, the GDC percentages were checked against the November report summary, the generation categories against Valve’s survey, and the assignment scope against the two course pages. The expected benefit of a clue is a hypothesis. A human player trial is still planned.
