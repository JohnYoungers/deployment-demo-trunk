# Deployment Demo - GitHub Environments

A demonstration project showcasing GitHub Actions workflows with environment-based deployments, manual approvals, and progressive deployment strategies.

## 🏗️ Deployment Flow

This project demonstrates a complete CI/CD pipeline with multi-region deployments across three AWS regions:

```
┌─────────┐    ┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│  Build  │ -> │             Dev                 │ -> │             RC                  │
└─────────┘    │ us-east-1 -> eu-central-1 ->   │    │ us-east-1 -> eu-central-1 ->   │
                │           ap-southeast-1        │    │           ap-southeast-1        │
                └─────────────────────────────────┘    └─────────────────────────────────┘
                              ↓                                        ↓
                          Automatic                                Automatic
                              
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│            Stage                │ -> │            Prod                 │
│ us-east-1 -> eu-central-1 ->   │    │ us-east-1 -> eu-central-1 ->   │
│           ap-southeast-1        │    │           ap-southeast-1        │
└─────────────────────────────────┘    └─────────────────────────────────┘
              ↓                                        ↓
         Manual Approval                          Manual Approval
```

### Deployment Regions

All environments deploy to three AWS regions in sequence:
1. **🇺🇸 US East 1** (`us-east-1`) - Primary region
2. **🇪🇺 EU Central 1** (`eu-central-1`) - European region  
3. **🇸🇬 AP Southeast 1** (`ap-southeast-1`) - Asia-Pacific region

### Environment Details

| Environment | Purpose | Deployment | Regions |
|-------------|---------|------------|---------|
| **Dev** | Development testing | Automatic after build | All 3 regions sequentially |
| **RC** | Release candidate validation | Automatic after dev | All 3 regions sequentially |
| **Stage** | Pre-production testing | Manual approval required | All 3 regions sequentially |
| **Prod** | Production | Manual approval required | All 3 regions sequentially |

### Regional URLs

**Development:**
- US East 1: `https://dev-us-east-1.example.com`
- EU Central 1: `https://dev-eu-central-1.example.com`
- AP Southeast 1: `https://dev-ap-southeast-1.example.com`

**Release Candidate:**
- US East 1: `https://rc-us-east-1.example.com`
- EU Central 1: `https://rc-eu-central-1.example.com`
- AP Southeast 1: `https://rc-ap-southeast-1.example.com`

**Staging:**
- US East 1: `https://stage-us-east-1.example.com`
- EU Central 1: `https://stage-eu-central-1.example.com`
- AP Southeast 1: `https://stage-ap-southeast-1.example.com`

**Production:**
- US East 1: `https://us-east-1.example.com`
- EU Central 1: `https://eu-central-1.example.com`
- AP Southeast 1: `https://ap-southeast-1.example.com`

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm
- GitHub repository with Actions enabled

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/deployment-demo-trunk.git
   cd deployment-demo-trunk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

The application will be available at `http://localhost:3000`

### API Endpoints

- `GET /` - Main application info
- `GET /health` - Health check endpoint
- `GET /version` - Version and build information

## 🔧 GitHub Environment Setup

To enable the full deployment workflow, you need to configure GitHub environments:

### 1. Create Environments

In your GitHub repository, go to **Settings > Environments** and create:

- `dev` - No protection rules
- `rc` - No protection rules  
- `stage` - Require reviewers (add team members)
- `prod` - Require reviewers + wait timer (optional)

### 2. Environment Configuration

For each environment, you can configure:

**Protection Rules:**
- Required reviewers
- Wait timer
- Deployment branches (restrict to `main`)

**Environment Secrets (per region):**
- `AWS_ACCESS_KEY_ID_US_EAST_1` / `AWS_ACCESS_KEY_ID_EU_CENTRAL_1` / `AWS_ACCESS_KEY_ID_AP_SOUTHEAST_1`
- `AWS_SECRET_ACCESS_KEY_US_EAST_1` / `AWS_SECRET_ACCESS_KEY_EU_CENTRAL_1` / `AWS_SECRET_ACCESS_KEY_AP_SOUTHEAST_1`
- `DATABASE_URL_US_EAST_1` / `DATABASE_URL_EU_CENTRAL_1` / `DATABASE_URL_AP_SOUTHEAST_1`
- `API_KEYS_US_EAST_1` / `API_KEYS_EU_CENTRAL_1` / `API_KEYS_AP_SOUTHEAST_1`

**Environment Variables:**
- `NODE_ENV`
- `AWS_REGION` (automatically set per deployment job)
- `APP_URL_US_EAST_1` / `APP_URL_EU_CENTRAL_1` / `APP_URL_AP_SOUTHEAST_1`
- `LOG_LEVEL`

### 3. Required Approvers Setup

For **Stage Environment:**
```
✅ Required reviewers: 1
✅ Restrict pushes to protected branches
👥 Add team members or specific users
```

For **Production Environment:**
```
✅ Required reviewers: 2
✅ Wait timer: 5 minutes
✅ Restrict pushes to protected branches
👥 Add senior team members
```

## 🔄 Workflow Triggers

### Automatic Deployment (Push to main)

When code is pushed to the `main` branch:

1. **Build** - Runs tests and creates artifacts
2. **Dev Regions** - Deploys to US East 1 → EU Central 1 → AP Southeast 1 (with smoke tests)
3. **RC Regions** - Deploys to US East 1 → EU Central 1 → AP Southeast 1 (with integration tests)
4. **Stage Regions** - ⏸️ Waits for manual approval, then deploys to all regions (with E2E tests)
5. **Prod Regions** - ⏸️ Waits for manual approval, then deploys to all regions (with verification)

### Regional Deployment Strategy

Each environment deploys to regions **sequentially** rather than in parallel for several reasons:

✅ **Risk Mitigation** - If a deployment fails in the first region, it won't proceed to others
✅ **Resource Management** - Avoids overwhelming CI/CD resources with parallel jobs
✅ **Progressive Rollout** - Allows for canary-style deployments across regions
✅ **Issue Detection** - Regional-specific issues are caught early in the sequence

### Manual Deployment

You can manually trigger deployments to specific environments:

1. Go to **Actions** tab
2. Select **Deploy to Environments** workflow
3. Click **Run workflow**
4. Choose target environment
5. Click **Run workflow**

## 📋 Workflow Features

### ✅ Build Stage
- Dependency installation
- Test execution
- Application build
- Artifact creation and upload

### 🧪 Testing Strategy
- **Dev**: Smoke tests
- **RC**: Integration tests  
- **Stage**: End-to-end tests
- **Prod**: Verification tests

### 🔒 Security Features
- Environment-specific secrets
- Required approvals for sensitive environments
- Deployment branch restrictions
- Artifact integrity checks

### 📊 Monitoring & Notifications
- Environment URLs in deployment summary
- Stakeholder notifications
- Success/failure alerts
- Deployment verification

## 🛠️ Customization

### Adding New Environments

1. **Create the environment in GitHub Settings**
2. **Add a new job in `.github/workflows/deploy.yml`:**

```yaml
deploy-new-env:
  name: Deploy to New Environment
  runs-on: ubuntu-latest
  needs: [build, deploy-previous-env]
  environment:
    name: new-env
    url: https://new-env.example.com
  steps:
    # Add deployment steps
```

### Modifying Deployment Steps

Replace the echo commands in each deployment job with your actual deployment commands:

```yaml
- name: Deploy to Environment
  run: |
    # AWS S3 deployment
    aws s3 sync dist/ s3://your-bucket/
    
    # Docker deployment
    docker build -t app:${{ github.sha }} .
    docker push registry/app:${{ github.sha }}
    
    # Kubernetes deployment
    kubectl set image deployment/app app=registry/app:${{ github.sha }}
```

### Adding Environment Variables

```yaml
- name: Deploy with environment variables
  env:
    NODE_ENV: production
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    API_KEY: ${{ secrets.API_KEY }}
  run: |
    # Your deployment commands
```

## 📈 Monitoring Deployments

### GitHub Actions UI
- View deployment status in Actions tab
- See environment-specific deployment history
- Monitor approval workflows

### Environment Dashboard
- Check environment status in Settings > Environments
- View deployment history per environment
- Monitor protection rule compliance

## 🔍 Troubleshooting

### Common Issues

**Deployment stuck on approval:**
- Check if required reviewers are configured
- Ensure reviewers have proper permissions
- Verify branch protection rules

**Build failures:**
- Check Node.js version compatibility
- Verify dependencies in package.json
- Review test failures in Actions logs

**Environment access issues:**
- Confirm environment secrets are set
- Check environment protection rules
- Verify branch restrictions

## 📚 Additional Resources

- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Deployment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-protection-rules)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.