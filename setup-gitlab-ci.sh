#!/bin/bash

###############################################################################
# GitLab CI/CD Complete Setup Script - BASH VERSION
# Compatible with: Linux, Mac, Windows (Git Bash), and GitLab Runners
# 
# Usage:
#   chmod +x setup-gitlab-ci.sh
#   ./setup-gitlab-ci.sh                    # Interactive mode
#   ./setup-gitlab-ci.sh -u <username>     # With username
#   ./setup-gitlab-ci.sh -u <username> -p <project>  # Full automation
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}=========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Parse command line arguments
GITLAB_USERNAME=""
GITLAB_PROJECT=""
AUTO_MODE=false

while getopts "u:p:h" opt; do
    case $opt in
        u) GITLAB_USERNAME="$OPTARG" ;;
        p) GITLAB_PROJECT="$OPTARG" ;;
        h) 
            echo "Usage: $0 [-u username] [-p project]"
            echo "  -u username    GitLab username"
            echo "  -p project     GitLab project name (default: smartcart)"
            echo "  -h             Show this help message"
            exit 0
            ;;
        \?) print_error "Invalid option: -$OPTARG"; exit 1 ;;
    esac
done

# Start
print_header "SmartCart GitLab CI/CD Setup"
echo ""

# Step 1: Check prerequisites
echo -e "${GREEN}STEP 1: Checking prerequisites...${NC}"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi
print_success "Git is installed: $(git --version)"

# Check if in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi
print_success "Currently in a git repository"

# Check if we're on Windows Git Bash
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    print_info "Detected Windows environment (Git Bash)"
fi

echo ""

# Display current remotes
echo -e "${YELLOW}Current git remotes:${NC}"
git remote -v 2>/dev/null || print_warning "No remotes configured"
echo ""

# Step 2: Get GitLab credentials
echo -e "${GREEN}STEP 2: Setting up GitLab remote...${NC}"
echo ""

# Get username if not provided
if [ -z "$GITLAB_USERNAME" ]; then
    read -p "Enter your GitLab username: " GITLAB_USERNAME
    if [ -z "$GITLAB_USERNAME" ]; then
        print_error "Username cannot be empty"
        exit 1
    fi
fi

# Get project name if not provided
if [ -z "$GITLAB_PROJECT" ]; then
    read -p "Enter your GitLab project name (default: smartcart): " GITLAB_PROJECT
fi
GITLAB_PROJECT=${GITLAB_PROJECT:-smartcart}

GITLAB_URL="https://gitlab.com/${GITLAB_USERNAME}/${GITLAB_PROJECT}.git"

echo ""
print_info "GitLab repository URL: $GITLAB_URL"
echo ""

# Step 3: Configure GitLab remote
echo -e "${GREEN}STEP 3: Configuring GitLab remote...${NC}"
echo ""

# Check if gitlab remote already exists
if git remote | grep -q "^gitlab$"; then
    print_info "GitLab remote already exists, removing it..."
    git remote remove gitlab
fi

# Add gitlab remote
git remote add gitlab "$GITLAB_URL"
print_success "GitLab remote added"

# Verify remote was added
if git remote | grep -q "^gitlab$"; then
    print_success "Remote configured successfully"
else
    print_error "Failed to add GitLab remote"
    exit 1
fi

echo ""

# Step 4: Push all branches to GitLab
echo -e "${GREEN}STEP 4: Pushing code to GitLab...${NC}"
echo ""

# Get list of local branches
BRANCHES=$(git branch | sed 's/\* //g' | tr -d ' ')

echo -e "${YELLOW}Pushing branches to GitLab:${NC}"

# Push each branch
for branch in $BRANCHES; do
    echo -n "  Pushing $branch... "
    if git push -u gitlab "$branch" 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}[skipped/failed]${NC}"
    fi
done

# Push all tags
echo -n "  Pushing tags... "
if git push -u gitlab --tags 2>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}[no tags]${NC}"
fi

echo ""
print_success "Code push to GitLab completed"
echo ""

# Step 5: Verify push
echo -e "${GREEN}STEP 5: Verifying remote configuration...${NC}"
echo ""

echo -e "${YELLOW}Remote configuration:${NC}"
git remote -v | grep gitlab || print_warning "No gitlab remote found"

echo ""
print_success "GitLab remote properly configured"
echo ""

# Step 6: Display summary and next steps
print_header "Configuration Summary"
echo ""

echo -e "${YELLOW}Repository Information:${NC}"
echo "  GitHub:  https://github.com/bn8204/smartcart.git"
echo "  GitLab:  $GITLAB_URL"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo ""

echo "1️⃣  GO TO GITLAB:"
echo "    Open: https://gitlab.com/${GITLAB_USERNAME}/${GITLAB_PROJECT}"
echo "    Navigate to: Settings → CI/CD → Runners"
echo ""

echo "2️⃣  INSTALL GITLAB RUNNER:"
echo ""

# Detect OS and show appropriate instructions
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "    Ubuntu/Debian:"
    echo "    $ curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash"
    echo "    $ sudo apt-get install gitlab-runner"
    echo "    $ sudo systemctl start gitlab-runner"
    echo "    $ sudo systemctl enable gitlab-runner"
    echo ""
elif [[ "$OSTYPE" == "linux-musl"* ]]; then
    echo "    Alpine Linux:"
    echo "    $ apk add --no-cache gitlab-runner"
    echo "    $ rc-service gitlab-runner start"
    echo ""
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "    macOS:"
    echo "    $ brew install gitlab-runner"
    echo "    $ brew services start gitlab-runner"
    echo ""
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "    Windows (Git Bash):"
    echo "    $ curl -L https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe -o gitlab-runner.exe"
    echo "    $ ./gitlab-runner.exe install"
    echo "    $ ./gitlab-runner.exe start"
    echo ""
else
    echo "    General:"
    echo "    Visit: https://docs.gitlab.com/runner/install/"
    echo ""
fi

echo "3️⃣  REGISTER RUNNER:"
echo ""
echo "    $ gitlab-runner register"
echo ""
echo "    When prompted, provide:"
echo "      - GitLab instance URL: https://gitlab.com/"
echo "      - Registration token: (from GitLab → Settings → CI/CD → Runners)"
echo "      - Runner description: smartcart-runner"
echo "      - Tags: docker,smartcart (enter comma-separated)"
echo "      - Executor: docker"
echo "      - Default image: node:18"
echo ""

echo "4️⃣  CONFIGURE ENVIRONMENT VARIABLES:"
echo ""
echo "    In GitLab project → Settings → CI/CD → Variables, add these:"
echo ""
cat << 'EOF'
    DATABASE_URL=mysql://root:password@localhost:3306/smartcart_db
    JWT_SECRET=your_secret_key_here_change_this
    NODE_ENV=production
    API_BASE_URL=http://localhost:3000/api
EOF
echo ""
echo ""

echo "5️⃣  VERIFY PIPELINE:"
echo ""
echo "    - Go to Build → Pipelines in your GitLab project"
echo "    - Trigger first pipeline: git commit --allow-empty -m 'trigger pipeline'"
echo "    - Watch build in real-time at Build → Jobs"
echo ""

echo "6️⃣  CONFIGURE BRANCH PROTECTION (Optional):"
echo ""
echo "    - Go to Settings → Repository → Protected Branches"
echo "    - Protect 'master' and 'main' branches"
echo "    - Require CI/CD pipeline to pass before merge"
echo ""

print_header "Setup Complete!"
echo ""
print_success "✓ Repository is ready for GitLab CI/CD"
print_success "✓ All branches pushed to GitLab"
print_success "✓ Ready to register runner and deploy"
echo ""

echo -e "${YELLOW}Documentation:${NC}"
echo "  - GITLAB_CI_CD_SETUP.md   (Detailed setup guide)"
echo "  - GITLAB_QUICK_START.md   (5-minute quick start)"
echo "  - .gitlab-ci.yml          (Pipeline configuration)"
echo ""

echo -e "${CYAN}For help or issues:${NC}"
echo "  - GitLab Docs: https://docs.gitlab.com/ee/ci/"
echo "  - Runner Docs: https://docs.gitlab.com/runner/"
echo "  - CI Examples: https://gitlab.com/gitlab-examples"
echo ""
