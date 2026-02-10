# Advanced GitLab CI/CD Configuration & Docker Setup

## 🐳 Docker Configuration for GitLab Runner

### Docker Desktop Installation (Windows)
```powershell
# Download from: https://www.docker.com/products/docker-desktop
# Or use Chocolatey:
choco install docker-desktop

# Verify installation
docker --version
docker ps

# Start Docker Desktop
# (Can be set to autostart)
```

### Docker Resource Allocation
For optimal CI/CD performance, allocate:
- **Memory:** 4GB minimum, 8GB recommended
- **CPU:** 2-4 cores
- **Disk:** 50GB+ for images and builds

**Steps to increase resources:**
1. Right-click Docker icon → Settings
2. Resources tab
3. Increase Memory slider to 4GB+
4. Apply changes (Docker will restart)

## 📦 Custom Docker Images for CI/CD

### Using Different Node Versions

Edit `.gitlab-ci.yml` to use different Node versions:

```yaml
# Use Node 20
backend-build:
  image: node:20

# Use Node 18 (LTS)
frontend-build:
  image: node:18

# Use Node 16 (older)
legacy-build:
  image: node:16
```

### Add Services (Database for Testing)

```yaml
backend-test:
  services:
    - mysql:8.0
    - redis:7-alpine
  
  variables:
    MYSQL_ROOT_PASSWORD: testpass
    MYSQL_DATABASE: smartcart_test
    
  script:
    - npm ci
    - npm test
```

## 🔧 Advanced .gitlab-ci.yml Features

### Conditional Job Execution

```yaml
# Only run on specific branches
deploy_staging:
  only:
    - master
    - /^release\/.*$/  # Matches release/* branches

# Run on all branches except
never_on_dev:
  except:
    - develop

# Only on merge requests
test_mr:
  only:
    - merge_requests

# Only on scheduled pipelines
nightly_test:
  only:
    - schedules
```

### Job Dependencies & Artifacts

```yaml
quality_check:
  stage: test
  artifacts:
    paths:
      - coverage/
      - reports/
    expire_in: 7 days

deploy:
  stage: deploy
  dependencies:
    - quality_check
  script:
    - echo "Using artifacts from quality_check"
    - ls coverage/
```

### Parallel Job Execution

```yaml
# These jobs run in parallel within same stage
unit_tests:
  stage: test
  script:
    - npm test

integration_tests:
  stage: test
  script:
    - npm run test:integration

lint_check:
  stage: test
  script:
    - npm run lint
```

### Matrix Builds (Test Multiple Versions)

```yaml
test_matrix:
  stage: test
  image: node:${NODE_VERSION}
  parallel:
    matrix:
      - NODE_VERSION: ["16", "18", "20"]
  script:
    - npm ci
    - npm test
```

### Retry Policies

```yaml
frontend-build:
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure
      - api_failure
```

### Timeout Settings

```yaml
# Global timeout
default:
  timeout: 1h

# Per-job timeout
long_build:
  timeout: 2h
  script:
    - echo "Long running job"
    - sleep 3600
```

## 🔐 Secrets Management

### Creating & Using Protected Variables

```yaml
# Define in gitlab-ci.yml template
deploy:
  script:
    - echo "API Key: $API_SECRET"  # Value not shown in logs if marked as Masked
    - curl -H "Authorization: Bearer $API_SECRET" https://api.example.com
```

### Using Variable Files

```yaml
deploy:
  variables:
    FILE_VARIABLE: "value"
  script:
    - source variables.env  # Load from file
    - echo $LOADED_VARIABLE
```

### Sensitive Files (SSH Keys, Certificates)

```yaml
# For SSH deployments
deploy:
  before_script:
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
  script:
    - scp -r build/ user@$DEPLOY_HOST:/var/www/
```

## 📡 Integration with External Services

### Slack Notifications

```yaml
# Add to .gitlab-ci.yml
success_notification:
  stage: deploy
  script:
    - curl -X POST $SLACK_WEBHOOK -d '{"text":"Deployment successful!"}'
  when: on_success

failure_notification:
  stage: deploy
  script:
    - curl -X POST $SLACK_WEBHOOK -d '{"text":"Deployment failed!"}'
  when: on_failure
```

### GitHub Integration

```bash
# Push to GitHub as well
git remote add github https://github.com/username/smartcart.git
git push github --all
git push github --tags
```

### Docker Registry Push

```yaml
docker_build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:latest
```

## 🚀 Deploy Strategies

### Blue-Green Deployment

```yaml
deploy_blue:
  stage: deploy
  script:
    - cp -r smartcart-backend /var/www/smartcart-blue
    - /var/www/smartcart-blue/start.sh
  environment:
    name: production-blue
    url: http://blue.example.com

deploy_green:
  when: manual
  stage: deploy
  script:
    - cp -r smartcart-backend /var/www/smartcart-green
    - /var/www/smartcart-green/start.sh
    - # Switch load balancer
  environment:
    name: production-green
    url: http://green.example.com
```

### Rolling Deployment

```yaml
deploy_rolling:
  script:
    - for server in $PRODUCTION_SERVERS; do
        ssh user@$server "./deploy.sh"
        sleep 10  # Wait before next server
      done
```

### Canary Deployment

```yaml
deploy_canary:
  script:
    - # Deploy to 5% of traffic
    - ./deploy-canary.sh 5
    
canary_smoke_tests:
  script:
    - npm run test:smoke
    
promote_canary:
  when: manual
  script:
    - # Promote canary to 100%
    - ./promote-canary.sh 100
```

## 🧪 Testing Strategies

### Unit Tests

```yaml
unit_tests:
  stage: test
  script:
    - cd smartcart-backend
    - npm run test:unit
  coverage: '/TOTAL.+?(\d+%)$/'
```

### Integration Tests

```yaml
integration_tests:
  services:
    - mysql:8.0
  script:
    - npm run test:integration
```

### E2E Tests (with Selenium/Cypress)

```yaml
e2e_tests:
  image: node:18-browsers
  script:
    - npm run test:e2e
  artifacts:
    paths:
      - test-results/screenshots/
    when: on_failure
```

## 📊 Performance Optimization

### Cache Strategy

```yaml
cache:
  key:
    files:
      - package-lock.json
    prefix: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/
```

### Build Speed Tips

```bash
# 1. Use npm ci instead of npm install
npm ci --prefer-offline --cache .npm

# 2. Limit what you build
CI=false npm run build  # Skip tests during build

# 3. Use Docker layer caching
docker build --cache-from registry.gitlab.com/user/project:latest
```

### Artifact Cleanup

```yaml
artifacts:
  paths:
    - build/
  expire_in: 1 hour  # Auto-delete after 1 hour
  exclude:
    - build/**/*.map  # Don't save source maps
```

## 🔍 Debugging & Monitoring

### Enable Debug Logging

```yaml
build:
  variables:
    CI_DEBUG_TRACE: "true"  # Enable debug output
  script:
    - npm ci
```

### Job Timing

```bash
# Add timing to your scripts
date && echo "Start" && npm ci && date

# Or use GitLab's built-in timing display
# View in job logs → Duration column
```

### Monitor Pipeline Health

```bash
# From command line
curl "https://gitlab.com/api/v4/projects/ID/pipelines" \
  --header "PRIVATE-TOKEN: YOUR_TOKEN"
```

## 🆘 Troubleshooting Advanced Issues

### Pipeline Hangs on Docker Layer

```yaml
# Disable DinD caching
docker_build:
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_DRIVER: overlay2
    DOCKER_TLS_CERTDIR: ""
```

### Out of Space Errors

```bash
# Clean up old Docker images
docker image prune -a --force

# Clean up volumes
docker volume prune -f

# In pipeline
script:
  - docker rmi $(docker images -q) || true
```

### Memory/CPU Issues

```yaml
# Reduce parallel jobs
parallel: 2  # Run max 2 parallel jobs

# Increase available resources in Docker Desktop
# Settings → Resources → Memory: 8GB+
```

## 📚 Advanced Examples

### Full CI/CD with Notifications

```yaml
stages:
  - build
  - test
  - deploy
  - notify

variables:
  SLACK_WEBHOOK: $SLACK_WEBHOOK_URL

build:
  stage: build
  script:
    - npm ci
    - npm run build

test:
  stage: test
  script:
    - npm test
  coverage: '/Coverage: \d+\.\d+%/'

deploy:
  stage: deploy
  environment:
    name: production
    url: https://example.com
  script:
    - ./deploy.sh

notify_success:
  stage: notify
  when: on_success
  script:
    - curl -X POST $SLACK_WEBHOOK -d "@slack-success.json"

notify_failure:
  stage: notify
  when: on_failure
  script:
    - curl -X POST $SLACK_WEBHOOK -d "@slack-failure.json"
```

---

**Advanced Configuration Ready:** ✅
**Last Updated:** February 10, 2026
