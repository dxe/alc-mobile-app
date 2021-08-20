# ALC Mobile App

## Pre-reqs

Node.js LTS

Expo CLI: `npm install --global expo-cli`

## Install deps

`npm ci`

## Running the Expo dev server

`npm run start`

## Formatting code

`npm run fmt`

## Publishing changes to Expo to test using Expo Go

```expo publish```

## Publishing changes to PROD app via Expo
WARNING: This will push over-the-air updates to real app users!

```expo publish --release-channel prod```

## Building for app stores
This is to submit a new binary to the app stores. Note that this is not necessary if you are just making updates to JS, as Expo can publish OTA updates using the above commands.

```
expo build:ios --release-channel prod
expo build:android --release-channel prod
```
