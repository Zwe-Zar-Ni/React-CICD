
# React Project with CI/CD Pipeline

This project demonstrates a React application with a complete CI/CD pipeline including:
- Pre-commit hooks with Husky
- Linting and formatting
- Commit message validation
- GitHub Actions for CI/CD
- Automatic deployment to GitHub Pages

## 🛠️ Setup Instructions

### 1. Project Initialization
```bash
npx create-react-app my-app
cd my-app
git init
```
### 2. Install Development Dependencies
```bash
npm install --save-dev husky lint-staged prettier @commitlint/{cli,config-conventional}
```
### 3. ESLint Configuration

Add to  `eslint.config.js`:
```
settings: {
  react: {
    version: "detect"
  }
}
// Add additional rules as needed
```
### 4. Package.json Configuration
```
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "pre-push": "npm run lint && npm run format"
  }
},
"lint-staged": {
  "src/**/*.{js,jsx,ts,tsx}": [
    "npm run lint",
    "npm run format"
  ]
},
"scripts": {
  "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0 --fix",
  "format": "prettier --write src",
  "prepare": "husky"
}
```
### 5. Initialize Husky
```
npm run prepare
```
### 6. Pre-commit Hook

Create  `.husky/pre-commit`:
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```
## 🔏 Strict Commit Message Convention

### 1. Commitlint Configuration

Create  `commitlint.config.cjs`:
```
module.exports = {
  extends: [],
  rules: {
    "header-min-length": [2, "always", 20],
    "header-case-start-capital": [2, "always"],
    "header-end-period": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "header-case-start-capital": ({raw}) => {
          return [
            /[A-Z]/.test(raw),
            "Header must start with capital letter"
          ]
        },
        "header-end-period": ({header}) => {
          return [
            header.endsWith("."),
            "Header must end with period"
          ]
        }
      }
    }
  ]
}
```
### 2. Commit Message Hook

Create  `.husky/commit-msg`:
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx --no-install commitlint --edit "$1"
```
## ⚙️ GitHub Actions Setup

### 1. CI Workflow (`.github/workflows/ci.yml`)
```
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "22.17.0"
      - name: Install dependencies
        run: npm install
      - name: Run lint
        run: npm run lint
      - name: Run Format
        run: npm run format
      - name: Check commits
        uses: wagoid/commitlint-github-action@v5
        with:
          configFile: "commitlint.config.cjs"
```
### 2. CD Workflow (`.github/workflows/deploy.yml`)
```
name: CD
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          persist-credentials: false
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "22.17.0"
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: dist
```
### 3. Deployment Troubleshooting

1.  If deployment fails:
    
    -   Go to Repository Settings > Actions > General
        
    -   Under "Workflow permissions", select "Read and write permissions"
        
    -   Click "Save"
        
2.  After successful workflow:
    
    -   Go to Settings > Pages
        
    -   Select  `gh-pages`  branch and  `/root`  folder
        
    -   Click "Save"
        
3.  Update  `vite.config.js`:
```
base: "/your-repo-name/"  // e.g., "/react-cicd/"
```
graph TD
    A[Local Development] --> B[Commit with Validation]
    B --> C[CI Pipeline Runs]
    C --> D{Lint & Format Checks}
    D -->|Pass| E[CD Pipeline]
    D -->|Fail| F[Developer Notification]
    E --> G[Build Production]
    G --> H[Deploy to GitHub Pages]