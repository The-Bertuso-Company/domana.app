Rollback Playbook (Fast and Safe)

Goal: quickly undo a bad deploy without losing history.

If a single PR or merge caused it:
1) Identify the merge commit on main.
2) Revert and redeploy:
   git checkout main
   git pull --ff-only
   git revert BAD_COMMIT_SHA -m 1   (use -m 1 only for merge commits)
   git push origin main

If a range needs revert:
   git checkout main
   git pull --ff-only
   git revert --no-commit OLD_SHA^..NEW_SHA
   git commit -m revert: rollback range
   git push origin main

Ownership
- DRI: Release owner of the change
- Escalation: @
TheBertusoCompany
