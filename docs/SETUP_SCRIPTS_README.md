# GitLab Setup Scripts

This directory contains automated setup scripts for GitLab CI/CD configuration.

## Available Scripts

### 1. Bash Version (Linux, Mac, Git Bash)
**File:** `setup-gitlab-ci.sh`

Works on:
- ✅ Linux (Ubuntu, Debian, CentOS, etc.)
- ✅ macOS
- ✅ Windows (Git Bash / MSYS2)
- ✅ WSL (Windows Subsystem for Linux)

**Usage:**
```bash
# Make executable
chmod +x setup-gitlab-ci.sh

# Run interactively
./setup-gitlab-ci.sh

# Run with username
./setup-gitlab-ci.sh -u your_username

# Run fully automated
./setup-gitlab-ci.sh -u your_username -p smartcart
```

**Features:**
- ✓ Detects OS automatically
- ✓ Shows OS-specific installation instructions
- ✓ Colored terminal output
- ✓ Error handling and verification
- ✓ Pushes all branches and tags to GitLab
- ✓ Verifies GitLab remote configuration
- ✓ Command-line arguments for automation

### 2. PowerShell Version (Windows Only)
**File:** `setup-gitlab-ci.ps1`

Works on:
- ✅ Windows PowerShell 5.0+
- ✅ Windows Terminal (recommended)

**Usage:**
```powershell
# Allow script execution (if needed)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Run the script
.\setup-gitlab-ci.ps1
```

**Features:**
- ✓ Windows-native colored output
- ✓ Browser auto-open for GitLab project
- ✓ Git operations using native PowerShell
- ✓ Clear error messages
- ✓ Interactive prompts

---

## Quick Start Guide

### For Linux/Mac Users:
```bash
cd /path/to/E-com
chmod +x setup-gitlab-ci.sh
./setup-gitlab-ci.sh
```

### For Windows Users (Recommended - PowerShell):
```powershell
cd C:\APPLICATION\E-com
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\setup-gitlab-ci.ps1
```

### For Windows Users (Git Bash Alternative):
```bash
cd C:\APPLICATION\E-com
chmod +x setup-gitlab-ci.sh
./setup-gitlab-ci.sh
```

---

## What These Scripts Do

Both scripts perform the same operations:

1. ✓ **Verify Prerequisites**
   - Check if Git is installed
   - Verify you're in a git repository

2. ✓ **Configure GitLab Remote**
   - Prompt for GitLab username and project name
   - Add `gitlab` remote to your repository
   - Remove existing GitLab remote if present

3. ✓ **Push Code to GitLab**
   - Push all local branches to GitLab
   - Push all tags
   - Verify remote configuration

4. ✓ **Display Next Steps**
   - How to install GitLab Runner
   - How to register a runner
   - How to configure environment variables
   - How to verify pipelines

---

## Output Example

```
=========================================
  SmartCart GitLab CI/CD Setup
=========================================

STEP 1: Checking prerequisites...

✓ Git is installed: git version 2.39.0
✓ Currently in a git repository

Current git remotes:
origin  https://github.com/bn8204/smartcart.git (fetch)
origin  https://github.com/bn8204/smartcart.git (push)

STEP 2: Setting up GitLab remote...

Enter your GitLab username: your_username
Enter your GitLab project name (default: smartcart): smartcart

ℹ GitLab repository URL: https://gitlab.com/your_username/smartcart.git

STEP 3: Configuring GitLab remote...

✓ GitLab remote added
✓ Remote configured successfully

STEP 4: Pushing code to GitLab...

Pushing branches to GitLab:
  Pushing master... ✓
  Pushing develop... ✓
  Pushing payment-cancellation-fix... ✓
  Pushing tags... ✓

✓ Code push to GitLab completed

...
```

---

## Troubleshooting

### "Permission denied" error (Linux/Mac)
```bash
chmod +x setup-gitlab-ci.sh
./setup-gitlab-ci.sh
```

### Script not found
Make sure you're in the correct directory:
```bash
cd /c/APPLICATION/E-com
ls setup-gitlab-ci.*
```

### Git push fails
- Verify GitHub credentials are still working
- Check internet connection
- Ensure you have push access to the repository

### GitLab remote not added
- Check your GitLab username spelling
- Verify your GitLab project exists
- Manually add remote: `git remote add gitlab https://gitlab.com/USERNAME/PROJECT.git`

---

## Next Steps After Running Script

1. **Create GitLab Project**
   - Go to https://gitlab.com/projects/new
   - Create project with name matching your project name
   - Make it empty (don't initialize with README)

2. **Install GitLab Runner** (see script output for OS-specific instructions)

3. **Register Runner**
   ```bash
   gitlab-runner register
   ```

4. **Configure Variables** in GitLab UI:
   - Settings → CI/CD → Variables
   - Add: DATABASE_URL, JWT_SECRET, NODE_ENV, API_BASE_URL

5. **Verify Pipeline**
   - Go to Build → Pipelines
   - Push a commit to trigger
   - Watch your first pipeline run!

---

## Environment Detection

The Bash script automatically detects your operating system and provides:

| OS | Detection | Runner Instructions |
|----|-----------|-------------------|
| Linux (Debian/Ubuntu) | `linux-gnu` | apt-get install |
| Linux (Alpine) | `linux-musl` | apk add |
| macOS | `darwin` | brew install |
| Windows | `msys`, `win32` | .exe download |
| Other | Generic | Link to docs |

---

## Files Reference

| File | Purpose | Platform |
|------|---------|----------|
| `setup-gitlab-ci.sh` | Main setup script | Linux, Mac, Git Bash |
| `setup-gitlab-ci.ps1` | Windows PowerShell script | Windows |
| `GITLAB_CI_CD_SETUP.md` | Detailed documentation | All |
| `GITLAB_QUICK_START.md` | 5-minute quick start | All |
| `.gitlab-ci.yml` | Pipeline configuration | Used by runners |

---

## Support

- **GitLab Documentation:** https://docs.gitlab.com/ee/ci/
- **GitLab Runner:** https://docs.gitlab.com/runner/
- **Examples:** https://gitlab.com/gitlab-examples

---

## Tips

1. **For Automation:** Use the `-u` and `-p` flags to skip prompts
   ```bash
   ./setup-gitlab-ci.sh -u myusername -p smartcart
   ```

2. **Commit Often:** Keep your .gitlab-ci.yml tracked in git
   ```bash
   git add .gitlab-ci.yml
   git commit -m "GitLab CI/CD configuration"
   git push
   ```

3. **Test Locally:** Before pushing major changes, verify locally
   ```bash
   # Check syntax
   cat .gitlab-ci.yml | yamllint -
   ```

4. **Monitor Pipelines:** Check runner status regularly
   - GitLab UI: Settings → CI/CD → Runners
   - Runner status: `gitlab-runner status`

---

**Last Updated:** January 31, 2026
**Repository:** https://github.com/bn8204/smartcart.git
**GitLab Support:** https://docs.gitlab.com/
