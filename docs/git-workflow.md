# Git Workflow — SmartLab

This repository is not connected to a remote by default. Follow these steps whenever you need to synchronize with GitHub or any other remote service.

## 1. Configure the Remote Once
1. Copy the repository URL from GitHub (HTTPS or SSH).
2. Run:
   ```bash
   git remote add origin <YOUR_REPO_URL>
   ```
3. Verify:
   ```bash
   git remote -v
   ```

> If `origin` already exists and points somewhere else, update it with:
> ```bash
> git remote set-url origin <YOUR_REPO_URL>
> ```

## 2. Pull the Latest Main Branch
```bash
git fetch origin
git checkout main
git pull origin main
```
Resolve any conflicts locally before continuing.

## 3. Push Your Local Work to Main
1. Check status: `git status -sb`
2. Stage files: `git add <paths>`
3. Commit: `git commit -m "feat: describe your change"`
4. Push:
   ```bash
   git push origin main
   ```

If your deploy pipeline requires pull requests, push to a feature branch first:
```bash
git checkout -b feature/my-update
git push origin feature/my-update
```
Then open a PR on GitHub and merge into `main` through the UI.

## 4. Merge Locally (Fast-Forward)
If you have approval to merge locally without PRs, ensure you are on `main`, pull the latest changes, and fast-forward merge your feature branch:
```bash
git checkout main
git pull origin main
git merge --ff-only feature/my-update
git push origin main
```

## 5. Troubleshooting
- **Remote not found**: add it using step 1.
- **Permission denied**: make sure your SSH key or access token is configured.
- **Non-fast-forward errors**: pull the latest `main`, resolve conflicts, and push again.
- **Protected branches**: some remotes block direct pushes to `main`; create a PR instead.

Following this checklist ensures the SmartLab code stays in sync with GitHub and deployments from `main` remain healthy.
