# ALC Mobile App

## Pre-reqs

Node.js (last tested w/ v20.10.0)
Expo EAS CLI: `pnpm i -g eas-cli`

## Install deps

`pnpm i`

**Note:** When installing new deps that are related to ReactNative/Expo, use `pnpm expo install [pkg name]` to be sure that compatible versions are installed.

## Running the Expo dev server

`pnpm start`

## Formatting code

`pnpm fmt`

## Building

```bash
# create a build
eas build --profile [dev, preview, prod]

# run a build
eas build:run

# submit to app store
eas submit
```

Be sure to bump **build number**, **version**, and **version code** in `app.json` when doing a prod build.

## Pushing js changes over the air w/o a new build

```
eas update --channel prod --message [short description of changes]
```

Then check status on the [Expo dashboard](https://expo.dev/accounts/dxetech/projects/alc-mobile-app/updates).
