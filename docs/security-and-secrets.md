# Security & secrets (local + agent loop)

This design system (`@ktbsh/ui`) must stay **secure by default**: no secrets in source, no secrets in published artifacts, least-privilege automation tokens.

## Golden rules

1. **Never commit secrets.** `.env` and `.env.*` are gitignored (except `.env.example`).
2. **Never ship secrets in the package.** Components, Storybook static builds, and `dist/` must not embed API keys, tokens, or private URLs.
3. **Least privilege.** Prefer fine-grained PATs / GitHub Apps over classic PATs with broad `repo` scope.
4. **Two secret stores, two purposes:**

| Store | Used by | What goes here |
|-------|---------|----------------|
| **Local `.env`** (this machine) | Path A CLI agent / `gh` / review tools | Keys for *local* autonomy |
| **GitHub Actions secrets** | Path B workflows on runners | Keys the *cloud* runner needs |

Copying values into `.env` does **not** make them available to Actions. Actions only see **repository / environment secrets** in GitHub settings.

---

## Path A vs Path B (autonomy)

### Path A — local polling (current default)

```text
You / CLI agent on your machine
  → branch, implement, review, commit, open PR
  → poll gh until MERGED
  → pull main → next task from docs/TASKS.md
```

- Secrets live in **local `.env`** (or `gh auth` / SSH).
- You stay in control of cost, context, and when the loop runs.
- This Grok/CLI session **is** the agent (when authenticated).

### Path B — GitHub Actions “factory”

```text
PR merged
  → workflow on pull_request closed (merged == true)
  → fetch next GitHub Issue (label todo-ai)
  → run a *headless* AI CLI on the runner
  → that CLI commits + opens the next PR
```

Important limitations (be honest):

1. **Path B does not run “this chat”.** Actions runs a **headless** tool you install in the workflow (custom script, `aider`, Claude Code headless, Codex, etc.). Wiring “Grok Build TUI” as-is into Actions usually does not work without a dedicated non-interactive runner.
2. **`secrets.GITHUB_TOKEN` is not enough** for a full loop that opens PRs *and* re-triggers workflows. Default `GITHUB_TOKEN` is job-scoped; pushes with it often **do not trigger new workflows** (by design). You need a **fine-grained PAT** or **GitHub App** installation token stored as a secret (e.g. `AGENT_GITHUB_TOKEN`).
3. **Runaway risk.** Merge → spawn agent → PR → merge → spawn again can burn money and thrash the repo. You need: concurrency locks, max steps, issue labels (`todo-ai` / `ai-in-progress` / `ai-blocked`), and human merge gates if desired.
4. **Security surface.** A write-capable token + LLM in CI is a high-value target. Pin Actions by SHA, minimal permissions, no `pull_request_target` with untrusted code + secrets, never echo secrets in logs.

**Recommendation for kitbash-ui right now**

| Phase | Use |
|-------|-----|
| Foundation + DS build-out | **Path A** + normal CI (lint/typecheck/build) |
| Later optional | Path B **orchestration only** (enqueue next issue) **or** full headless agent once a real CLI entrypoint exists |

You can put Path B secrets in `.env` for *local experiments*, but production Path B secrets must live in **GitHub → Settings → Secrets and variables → Actions**.

---

## Tokens you need (and where to get them)

### 1. `GH_TOKEN` / `AGENT_GITHUB_TOKEN` (GitHub)

**Why:** `gh pr create`, `gh issue list`, push branches, comment on PRs.

**Local (Path A) options (pick one):**

| Option | How | Notes |
|--------|-----|--------|
| **A. `gh auth login`** (preferred) | https://cli.github.com/ — `gh auth login` (browser or token) | No long-lived token in `.env` if you use secure login |
| **B. Fine-grained PAT in `.env`** | See steps below | Set `GH_TOKEN=...` for non-interactive `gh` |

**Create a fine-grained PAT (recommended):**

1. Open: [Fine-grained personal access tokens](https://github.com/settings/personal-access-tokens/new)  
   (GitHub → avatar → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**)
2. **Resource owner:** your user (or org that owns the repo)
3. **Repository access:** **Only select repositories** → `dandrok/kitbash-ui` (and `kitbash-sdk` only if the agent must read it)
4. **Permissions (minimum for agent loop):**

   | Permission | Access | Why |
   |------------|--------|-----|
   | **Contents** | Read and write | Branch push, commits |
   | **Pull requests** | Read and write | Open/list/update PRs |
   | **Issues** | Read and write | Path B task queue (`todo-ai`) |
   | **Metadata** | Read | Always required |
   | **Workflows** | Read and write | Only if the agent must edit `.github/workflows/*` |

5. Set expiration (30–90 days). Generate → **copy once**.
6. Local: put in `.env` as `GH_TOKEN=github_pat_...`  
   Actions: repo **Settings → Secrets and variables → Actions → New repository secret** name `AGENT_GITHUB_TOKEN`

**Classic PAT (avoid unless blocked):**  
[Tokens (classic)](https://github.com/settings/tokens) with `repo` + `workflow` — broader blast radius.

**Built-in `GITHUB_TOKEN` in Actions:**  
Auto-provided. Good for CI (checkout, status). **Insufficient alone** for “agent opens PR that should re-trigger the factory.” Use `AGENT_GITHUB_TOKEN` for that job.

Repo setting if using default token for simple PR ops:  
**Settings → Actions → General → Workflow permissions** → read/write + “Allow GitHub Actions to create and approve pull requests” (still prefer a dedicated agent token for loops).

### 2. AI provider key (only if Path B runs an LLM in CI)

Depends on the **runner CLI**, not on the design system:

| If the agent uses… | Env var (typical) | Where to get it |
|--------------------|-------------------|-----------------|
| xAI / Grok API | `XAI_API_KEY` | [xAI Console](https://console.x.ai/) → API keys |
| OpenAI | `OPENAI_API_KEY` | [OpenAI API keys](https://platform.openai.com/api-keys) |
| Anthropic | `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/) |

Local: `.env`. Path B: GitHub Actions secret with the **same name**.

**This package must never import these keys.** They belong only to agent/CI tooling.

### 3. Optional review tools (Path A)

| Tool | Secret | Where |
|------|--------|--------|
| CodeRabbit CLI | per their docs | Local / their cloud |
| Other LLM review | provider key | Local `.env` only unless you run review in CI |

### 4. npm publish (later, not needed for DS build)

| Secret | Where |
|--------|--------|
| `NPM_TOKEN` | npmjs.com → Access tokens (Automation) → GitHub Actions secret |

Not required until a release workflow exists.

---

## Local setup checklist

```bash
cp .env.example .env
# edit .env — never commit it

# verify GitHub auth (either works):
gh auth status
# or
export $(grep -v '^#' .env | xargs) && gh api user --jq .login
```

`.env` is already ignored via:

```gitignore
.env
.env.*
!.env.example
```

---

## Path B secrets in GitHub (when you enable it)

Repo: **Settings → Secrets and variables → Actions**

| Secret name | Value |
|-------------|--------|
| `AGENT_GITHUB_TOKEN` | Fine-grained PAT (Contents + PRs + Issues write) |
| `XAI_API_KEY` (or provider of choice) | Only if the headless agent calls that API |

Workflow sketch (do **not** enable until a real headless CLI exists):

```yaml
# .github/workflows/ai-loop.yml  — future / optional
name: AI Autonomous Loop Runner
on:
  pull_request:
    types: [closed]

concurrency:
  group: ai-loop
  cancel-in-progress: false

jobs:
  next_task:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    permissions:
      contents: read   # prefer AGENT_GITHUB_TOKEN for writes
    steps:
      - uses: actions/checkout@v4
      - name: Next todo-ai issue
        env:
          GH_TOKEN: ${{ secrets.AGENT_GITHUB_TOKEN }}
        run: |
          gh issue list --label todo-ai --state open --limit 1 --json number,body
      # - name: Run headless agent (only when implemented)
      #   env:
      #     GH_TOKEN: ${{ secrets.AGENT_GITHUB_TOKEN }}
      #     XAI_API_KEY: ${{ secrets.XAI_API_KEY }}
      #   run: bun run agent:next
```

Safeguards to add before “full autonomy”:

- Label state machine: `todo-ai` → `ai-in-progress` → `ai-done` / `ai-blocked`
- `concurrency.group: ai-loop` so only one agent runs
- Budget caps / max PRs per day
- Require human approval to merge agent PRs (branch protection)
- Never log secret values; mask in Actions

---

## Design-system security bar (product code)

`@ktbsh/ui` is a **UI library**. Security means:

| Area | Expectation |
|------|-------------|
| Secrets | None in components, stories, or `dist/` |
| XSS | No `innerHTML` of untrusted strings; prefer text/slots; sanitize if any rich HTML lands later |
| Shadow DOM | Prefer encapsulation; document when parts/slots accept HTML |
| Supply chain | Lockfile, pin CI actions, audit deps on upgrades |
| Forms | Safe defaults (no auto-focus traps that break a11y; no silent credential fields) |
| Docs | Public Storybook must not load private tokens |

---

## What you should add to `.env` now (Path A)

Minimum to make me fully useful **on your machine**:

```bash
# Required for non-interactive gh (if not using `gh auth login`)
GH_TOKEN=github_pat_xxxxxxxx

# Only if a local tool needs the xAI API directly
# XAI_API_KEY=xai-xxxxxxxx
```

Then either:

```bash
export GH_TOKEN=...   # from .env
gh auth login --with-token <<< "$GH_TOKEN"
```

or keep `GH_TOKEN` in the environment when running the agent.

After `gh` works, we can open the design-spec PR and continue the foundation loop.

---

## References

- [Managing personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GITHUB_TOKEN in workflows](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- Design: `docs/superpowers/specs/2026-07-19-kitbash-ui-design-system-design.md`
