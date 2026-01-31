#!/bin/bash

# GitLab CI/CD Complete Setup Script
# This script will help you set up GitLab CI/CD for your SmartCart project

echo "========================================="
echo "  SmartCart GitLab CI/CD Setup"
echo "========================================="
echo ""

# Step 1: Check prerequisites
echo "✓ STEP 1: Checking prerequisites..."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi
echo "✓ Git is installed"

# Check if in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi
echo "✓ Currently in a git repository"

# Check git remote
echo ""
echo "Current git remotes:"
git remote -v
echo ""

# Step 2: Set up GitLab remote
echo "✓ STEP 2: Adding GitLab remote..."
echo ""
read -p "Enter your GitLab username: " gitlab_username
read -p "Enter your GitLab project name (default: smartcart): " gitlab_project
gitlab_project=${gitlab_project:-smartcart}

gitlab_url="https://gitlab.com/${gitlab_username}/${gitlab_project}.git"
echo ""
echo "GitLab repository URL: $gitlab_url"
echo ""

# Check if gitlab remote already exists
if git remote | grep -q gitlab; then
    echo "✓ GitLab remote already exists"
    git remote remove gitlab
fi

# Add gitlab remote
git remote add gitlab "$gitlab_url"
echo "✓ GitLab remote added"
echo ""

# Step 3: Push all branches to GitLab
echo "✓ STEP 3: Pushing code to GitLab..."
echo ""
echo "Pushing branches to GitLab:"
git push -u gitlab master 2>/dev/null || git push -u gitlab main || echo "Note: main/master branch may not exist"
git push -u gitlab develop 2>/dev/null || echo "Note: develop branch may not exist"
git push -u gitlab payment-cancellation-fix 2>/dev/null || echo "Note: payment-cancellation-fix branch may not exist"
git push -u gitlab --all
git push -u gitlab --tags
echo "✓ All branches pushed to GitLab"
echo ""

# Step 4: Display configuration information
echo "✓ STEP 4: Configuration Summary"
echo "========================================="
echo ""
echo "Repository Information:"
echo "  GitHub: https://github.com/bn8204/smartcart.git"
echo "  GitLab: $gitlab_url"
echo ""

echo "Next Steps:"
echo ""
echo "1. GO TO GITLAB:"
echo "   - Open: https://gitlab.com/${gitlab_username}/${gitlab_project}"
echo "   - Go to Settings → CI/CD → Runners"
echo ""

echo "2. INSTALL GITLAB RUNNER:"
echo ""
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "   On Windows (PowerShell as Administrator):"
    echo "   $ Invoke-WebRequest -Uri 'https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe' -OutFile 'gitlab-runner.exe'"
    echo "   $ .\gitlab-runner.exe install"
    echo "   $ .\gitlab-runner.exe start"
else
    echo "   On Linux/Mac:"
    echo "   $ curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | bash"
    echo "   $ sudo apt-get install gitlab-runner"
    echo "   $ sudo gitlab-runner start"
fi
echo ""

echo "3. REGISTER RUNNER:"
echo "   $ gitlab-runner register"
echo ""
echo "   When prompted, provide:"
echo "     - GitLab instance URL: https://gitlab.com/"
echo "     - Registration token: (from GitLab CI/CD settings)"
echo "     - Description: smartcart-runner"
echo "     - Tags: docker"
echo "     - Executor: docker"
echo "     - Default image: node:18"
echo ""

echo "4. CONFIGURE ENVIRONMENT VARIABLES:"
echo "   In GitLab project → Settings → CI/CD → Variables, add:"
echo ""
echo "   DATABASE_URL=mysql://root:password@localhost:3306/smartcart_db"
echo "   JWT_SECRET=your_secret_key"
echo "   NODE_ENV=production"
echo "   API_BASE_URL=http://localhost:3000/api"
echo ""

echo "5. VERIFY PIPELINE:"
echo "   - Go to Build → Pipelines"
echo "   - Your pipelines should start automatically"
echo "   - View logs in Build → Jobs"
echo ""

echo "========================================="
echo "✓ Setup script completed!"
echo "========================================="
echo ""
echo "For more details, see: GITLAB_CI_CD_SETUP.md"
