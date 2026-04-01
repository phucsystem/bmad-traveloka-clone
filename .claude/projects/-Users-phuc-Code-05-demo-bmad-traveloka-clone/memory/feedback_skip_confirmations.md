---
name: Skip repetitive confirmations in workflows
description: User wants autonomous execution when direction is clear, not step-by-step approval gates
type: feedback
---

When running multi-step BMad workflows (PRD, brainstorming, etc.), do NOT pause at every step for confirmation. When user says "continue" or "C", execute all remaining steps and produce the complete output.

**Why:** User explicitly said "continue to fulfill prd dont ask dumb questions" when faced with 11 steps of individual approval gates.

**How to apply:** For BMad workflows with many sequential steps, after user confirms direction, produce the complete artifact in one pass. Only pause for genuinely ambiguous decisions that require user input.
