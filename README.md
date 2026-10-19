# Streamr Hub

This is the Streamr Hub application frontend, which includes tooling for creating and editing Streamr resources
(streams, data unions, projects), and the data marketplace.

The Hub frontend runs against Ethereum smart contracts. For more information see [Backend](#backend).

## Folder structure

Although the frontend consists of a single app, the code is structured into different folders based on the different functionalities of the app. The code is under the `src` folder:

-   `marketplace` contains the data marketplace
-   `shared` has shared code and utilities
-   `userpages` contains the views for managing a user's Streamr resources
-   `utils` contains commonly used utilities, used throughout the App.
-   `stories` storybook stories.
-   `test` App unit tests.

## Getting Started

### Frontend

```
npm ci
npm start
```

Webpack is configured with live reloading and will be served on http://localhost once the backend stack is running on Docker (see [Backend](#backend)).

### Environment & Smart contract configuration

To be able to use the Marketplace, you'll need to configure these variables into your `.env` file:

| Variable        | Description                                               |
| --------------- | --------------------------------------------------------- |
| PORT            | Port used by webpack devServer                            |
| BUNDLE_ANALYSIS | Optional, enables generating bundle size analysis report. |

Default development values are taken from `.env.required` which can be overridden by values in your `.env` file.

Optional config values:

| Variable             | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| SENTRY_DSN           | Identifier for Sentry error reporting service                                                  |
| SENTRY_ORG           | Identifier for Sentry organisation                                                             |
| GTM_ID               | Google Tag Manager Identifier                                                                  |
| STORYBOOK_BASE_PATH  | Build path for Storybook stories                                                               |
| PLATFORM_PUBLIC_PATH | Public path for Webpack config. If not defined, relative paths are used.                       |
| PINATA_JWT           | Pinata API key JWT (scope: Files → Write). Required for image uploads (Operator & project images). |
| PINATA_GATEWAY_URL   | Pinata dedicated gateway base URL, e.g. `https://example.mypinata.cloud/ipfs/`. The gateway is expected to use a Host Origin access control, so leave this unset for local development to fall back to Pinata's rate-limited public gateway. |

### Backend

To run the app locally, you must install and start the development environment running on Docker.
Follow the instructions [here](https://github.com/streamr-dev/streamr-docker-dev) to start the full stack except the frontend:

`streamr-docker-dev start --except platform`

Note that the instructions also include login credentials for the local app.

### Git Branches

Master Branch (untagged) -> Production ready code

Master Branch (tagged releases) -> Production code - https://streamr.network/hub

### Deploying to Production

Follow these steps to push a new production release:

```
git checkout master
npm version patch # This will get you a tag, too, e.g. v3.1.15.
git push master
```

At this point it's a good idea to check that GitHub Actions confirms all tests are passing. Then, for example if the new version is `3.1.15`,

```
git push v3.1.15
```

### Production Hotfixes

Create new branch from master `hotfix/ticket-id-issue-title`
Merge the approved branch to master and push a tagged incremental release.

```
git checkout master
git merge hotfix/ticket-id-issue-title
npm version patch
git push master
```

At this point it's a good idea to check that GitHub Actions confirms all tests are passing. Then, for example if the new version is `3.1.15`,

```
git push v3.1.15
```

### Storybook

The project contains a Storybook including stories from the main components. The Storybook can be run with `npm run storybook` and built with `npm run build-storybook`. Storybook should be accessible after running `npm run storybook` at http://localhost:6006 or on your network at http://10.200.10.1:6006

### Sentry

JavaScript error tracking from Sentry helps developers easily fix and prevent JavaScript errors in production as part of your commit-deploy-iterate workflow. Ask a powerful developer for access to the Sentry alerts.
