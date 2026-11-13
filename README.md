# Game Fieldnotes

A working VitePress research notebook about AI-assisted clue writing for **Signal Garden**, a proposed small prediction game.

<!-- pages-link:start -->
**Website:** Awaiting first GitHub Pages deployment.
<!-- pages-link:end -->

[Project record](docs/project-record.md) · [Research](docs/research.md) · [Checks and partner review](docs/review.md)

## Publish on GitHub Pages

1. Extract the download. Create a public GitHub repository with `main` as its default branch. Commit the extracted **contents**, including the hidden `.github` folder, at the repository root.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Open **Actions → Publish notebook → Run workflow** on `main`. Later pushes to `main` deploy edits automatically.
4. Open the deployment URL shown by the workflow. Its final job puts that exact URL above. If branch protection prevents the README edit, paste the deployment URL here manually.

## Edit the draft

Use Node.js 22 or 24. Run `npm ci`, then `npm run docs:dev` for live editing. Run `npm run docs:build` to check the production build. Replace the career-site note in the project record once its URL exists, and link back from the career site.

## Plan submission

Use the same project record for later reviews. Replace the pending fields with actual links.

**Current work** · [Project record](docs/project-record.md) · [Check log](docs/review.md) · Repository URL pending upload · Peer issue/change links pending review.

**Changed** — Drafted the concept comparison, five stories and paper experiment.  
**Checked** — Matched source claims to the originals. Application checks and peer review are planned.  
**Next** — Publish both site links and ask a partner to try the walkthrough.
