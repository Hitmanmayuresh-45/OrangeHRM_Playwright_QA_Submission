# QA Automation Technical Assessment

## Overview

This project automates the Employee Lifecycle Management flow using **Playwright, TypeScript, and Page Object Model (POM)** against the OrangeHRM demo application.

The automation covers employee creation, search, update, API validation, deletion, and logout.

## Assessment Coverage

The automated test covers the following flow:

1. Login to OrangeHRM using valid credentials.
2. Verify the Dashboard.
3. Navigate to PIM and add a new employee.
4. Read employee test data from JSON.
5. Upload an employee profile picture.
6. Search for the employee using Employee ID.
7. Update Job Title and Employment Status.
8. Validate employee-like data using a public API through Playwright APIRequest.
9. Delete the employee from the OrangeHRM UI.
10. Verify that the deleted employee is no longer available.
11. Logout and verify the login page/session boundary.

## Application Under Test

**OrangeHRM Demo**

https://opensource-demo.orangehrmlive.com/

## Technology Stack

- Playwright
- TypeScript
- Node.js
- Page Object Model (POM)
- Playwright APIRequest
- JSON test data
- GitHub Actions
- Playwright HTML Report

## Project Structure

```text
OrangeHRM_Playwright_QA_Submission/
│
├── pages/
│   ├── LoginPage.ts
│   ├── PimPage.ts
│   └── DashboardPage.ts
│
├── tests/
│   └── employee-lifecycle.spec.ts
│
├── data/
│   └── employee.json
│
├── utils/
│   ├── apiClient.ts
│   └── testData.ts
│
├── assets/
│   └── profile-picture.png
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md

**Test Flow**
Login
  ↓
Verify Dashboard
  ↓
Add Employee
  ↓
Upload Profile Picture
  ↓
Search Employee
  ↓
Update Job Title
  ↓
Update Employment Status
  ↓
API Validation
  ↓
Delete Employee
  ↓
Verify Employee Deleted
  ↓
Logout
  ↓
Verify Login Page
