# SonarQube setup

This project uses GitHub Actions to run tests, generate coverage, send the
analysis to SonarQube Cloud, and run security checks.

## GitHub configuration

Create these repository settings before opening the first pull request to
`main`.

### Secret

- `SONAR_TOKEN`: token generated in SonarQube Cloud.

### Variables

- `SONAR_PROJECT_KEY`: project key generated in SonarQube Cloud.
- `SONAR_ORGANIZATION`: SonarQube Cloud organization key.

## Workflows

- `.github/workflows/sonarqube.yml`
  - Installs dependencies with `npm ci`.
  - Runs `npm run type-check`.
  - Runs `npm run test:coverage`.
  - Runs `npm run build`.
  - Sends `coverage/lcov.info` to SonarQube.
  - Runs `npm run security:audit` as a non-blocking dependency audit.

- `.github/workflows/codeql.yml`
  - Runs GitHub CodeQL for JavaScript and TypeScript on pushes, pull requests,
    and a weekly schedule.

## Current security note

`npm audit --audit-level=high` currently reports high-severity advisories for
installed dependencies, including Axios and Next.js. These dependency updates
were intentionally not applied in this CI setup branch. The audit job is
therefore non-blocking until the team approves dependency version changes in a
separate hardening task.
