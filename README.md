# OrangeHRM Employee Lifecycle – Playwright Automation

This project implements the Employee Lifecycle Management assessment using **Playwright + TypeScript + Page Object Model (POM)**.

## Assessment coverage

1. Login with valid OrangeHRM credentials and verify Dashboard.
2. Add a new employee using JSON-driven data.
3. Upload a profile picture.
4. Search by Employee ID.
5. Update Job Title and Employment Status.
6. Validate employee-like data using a public API simulation through Playwright APIRequest.
7. Delete the employee from UI and validate API DELETE response.
8. Logout and verify the login page/session boundary.

The supplied assessment explicitly permits Playwright/Selenium with JavaScript/TypeScript/Python/Java, requires POM, meaningful assertions, a test runner, HTML reporting, video, and a README. 

## Why ReqRes is used

The OrangeHRM public demo is used for the complete UI lifecycle. The assessment allows a simulated public test API when an OrangeHRM API is not available. ReqRes provides CRUD endpoints suitable for API automation.

Important: the current ReqRes anonymous demo write endpoints return realistic CRUD responses but anonymous writes are not persistent. Therefore the API section validates the create/update payload and the DELETE contract/status, while the actual employee existence/deletion is verified against OrangeHRM UI. For persistent API-to-UI reconciliation, configure a ReqRes project/API key and replace the adapter with a persistent collection endpoint.

## Project structure

```text
pages/
  LoginPage.ts
  PimPage.ts
  DashboardPage.ts
tests/
  employee-lifecycle.spec.ts
data/
  employee.json
utils/
  apiClient.ts
  testData.ts
assets/
  profile-picture.png
playwright.config.ts
package.json
tsconfig.json
README.md
```

## Prerequisites

- Node.js 18+
- npm
- Internet access to OrangeHRM demo and ReqRes

## Setup

```bash
npm install
npx playwright install --with-deps chromium
```

Optional environment variables:

```bash
cp .env.example .env
```

Default OrangeHRM demo credentials are currently documented as `Admin` / `admin123`. Keep credentials in environment variables for a real submission rather than hard-coding them.

## Run

```bash
npm test
```

Headed:

```bash
npm run test:headed
```

Debug:

```bash
npm run test:debug
```

Open HTML report:

```bash
npm run report
```

Type-check:

```bash
npm run lint
```

## Reports and evidence

Playwright generates:

- HTML report: `playwright-report/`
- Video: `test-results/`
- Trace/screenshot on failure: `test-results/`

## CI/CD

The test can be run from GitHub Actions or Azure DevOps. Store credentials/API keys as secrets.

## Notes for reviewer

- Data is generated dynamically for Employee ID to reduce collisions between executions.
- Page Objects isolate UI locators and actions from test flow.
- `test.step()` creates readable business-level reporting.
- API validation is deliberately separated into an API client so the backend can be replaced without rewriting the UI test.
- The OrangeHRM demo site may change selectors or reset data. If selectors change, update only the affected Page Object.
