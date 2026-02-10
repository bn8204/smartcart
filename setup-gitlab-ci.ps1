# GitLab CI/CD Complete Setup Script (Windows PowerShell)
# Run as Administrator

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  SmartCart GitLab CI/CD Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "STEP 1: Checking prerequisites..." -ForegroundColor Green
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✓ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if in a git repository
if (Test-Path .git) {
    Write-Host "✓ Currently in a git repository" -ForegroundColor Green
} else {
    Write-Host "❌ Not in a git repository" -ForegroundColor Red
    exit 1
}

# Check git remote
Write-Host ""
Write-Host "Current git remotes:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Step 2: Set up GitLab remote
Write-Host "STEP 2: Adding GitLab remote..." -ForegroundColor Green
Write-Host ""

$gitlabUsername = Read-Host "Enter your GitLab username"
$gitlabProject = Read-Host "Enter your GitLab project name (default: smartcart)"
if ([string]::IsNullOrWhiteSpace($gitlabProject)) {
    $gitlabProject = "smartcart"
}

$gitlabUrl = "https://gitlab.com/${gitlabUsername}/${gitlabProject}.git"
Write-Host ""
Write-Host "GitLab repository URL: $gitlabUrl" -ForegroundColor Yellow
Write-Host ""

# Check if gitlab remote already exists
$remotes = git remote
if ($remotes -contains "gitlab") {
    Write-Host "✓ GitLab remote already exists, updating..." -ForegroundColor Green
    git remote remove gitlab
}

# Add gitlab remote
git remote add gitlab $gitlabUrl
Write-Host "✓ GitLab remote added" -ForegroundColor Green
Write-Host ""

# Step 3: Push all branches to GitLab
Write-Host "STEP 3: Pushing code to GitLab..." -ForegroundColor Green
Write-Host ""
Write-Host "Pushing branches to GitLab:" -ForegroundColor Yellow

# Push master or main
try {
    git push -u gitlab master 2>$null
    Write-Host "✓ Master branch pushed" -ForegroundColor Green
} catch {
    try {
        git push -u gitlab main 2>$null
        Write-Host "✓ Main branch pushed" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Master/main branch not pushed (may not exist)" -ForegroundColor Yellow
    }
}

# Push develop
try {
    git push -u gitlab develop 2>$null
    Write-Host "✓ Develop branch pushed" -ForegroundColor Green
} catch {
    Write-Host "⚠ Develop branch not pushed (may not exist)" -ForegroundColor Yellow
}

# Push payment-cancellation-fix
try {
    git push -u gitlab payment-cancellation-fix 2>$null
    Write-Host "✓ Payment-cancellation-fix branch pushed" -ForegroundColor Green
} catch {
    Write-Host "⚠ Payment-cancellation-fix branch not pushed (may not exist)" -ForegroundColor Yellow
}

# Push all branches
Write-Host ""
Write-Host "Pushing all branches and tags..." -ForegroundColor Yellow
git push -u gitlab --all
git push -u gitlab --tags

Write-Host "✓ All branches pushed to GitLab" -ForegroundColor Green
Write-Host ""

# Step 4: Display configuration information
Write-Host "STEP 4: Configuration Summary" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Repository Information:" -ForegroundColor Yellow
Write-Host "  GitHub: https://github.com/bn8204/smartcart.git"
Write-Host "  GitLab: $gitlabUrl"
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. GO TO GITLAB:" -ForegroundColor Cyan
Write-Host "   - Open: https://gitlab.com/$gitlabUsername/$gitlabProject"
Write-Host "   - Go to Settings → CI/CD → Runners"
Write-Host ""

Write-Host "2. INSTALL GITLAB RUNNER:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   On Windows (PowerShell as Administrator):"
Write-Host "   `$ Invoke-WebRequest -Uri 'https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe' -OutFile 'gitlab-runner.exe'"
Write-Host "   `$ .\gitlab-runner.exe install"
Write-Host "   `$ .\gitlab-runner.exe start"
Write-Host ""

Write-Host "3. REGISTER RUNNER:" -ForegroundColor Cyan
Write-Host "   `$ gitlab-runner register"
Write-Host ""
Write-Host "   When prompted, provide:"
Write-Host "     - GitLab instance URL: https://gitlab.com/"
Write-Host "     - Registration token: (from GitLab CI/CD settings)"
Write-Host "     - Description: smartcart-runner"
Write-Host "     - Tags: docker"
Write-Host "     - Executor: docker"
Write-Host "     - Default image: node:18"
Write-Host ""

Write-Host "4. CONFIGURE ENVIRONMENT VARIABLES:" -ForegroundColor Cyan
Write-Host "   In GitLab project → Settings → CI/CD → Variables, add:"
Write-Host ""
Write-Host "   DATABASE_URL=mysql://root:password@localhost:3306/smartcart_db"
Write-Host "   JWT_SECRET=your_secret_key"
Write-Host "   NODE_ENV=production"
Write-Host "   API_BASE_URL=http://localhost:3000/api"
Write-Host ""

Write-Host "5. VERIFY PIPELINE:" -ForegroundColor Cyan
Write-Host "   - Go to Build → Pipelines"
Write-Host "   - Your pipelines should start automatically"
Write-Host "   - View logs in Build → Jobs"
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✓ Setup script completed!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "For more details, see: GITLAB_CI_CD_SETUP.md" -ForegroundColor Yellow
Write-Host ""

# Optional: Open GitLab in browser
$openBrowser = Read-Host "Open GitLab project in browser? (y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    Start-Process "https://gitlab.com/$gitlabUsername/$gitlabProject"
}
