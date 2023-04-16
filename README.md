# ALC Mobile App

## Pre-reqs

Node.js (last tested w/ v18.15.0)
Expo EAS CLI: `npm install -g eas-cli`

## Install deps

`npm ci`

**Note:** When installing new deps that are related to ReactNative/Expo, use `npx expo install [pkg name]` to be sure that compatible versions are installed.


## Running the Expo dev server

`npm run start`

## Formatting code

`npm run fmt`

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

