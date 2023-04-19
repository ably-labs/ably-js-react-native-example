# `ably-js` React Native example

This provides a simple example of how to use [`ably-js`](https://github.com/ably/ably-js) from within a [React Native](https://reactnative.dev) app.

It was written for manually testing the Webpack version 5 migration in https://github.com/ably/ably-js/issues/1184, but I think serves as a generally useful example.

## Usage

### How to run it

1. Copy `.env.example` to `.env`, and replace `insert_key_here` with your Ably API key.
2. Run `npm install`.
3. Run `npm start`, and choose the one of the options to run on either iOS or Android. This will launch an iOS simulator or Android emulator.

### Expected results after running

You should see the following log messages in your terminal (the last two may appear in the opposite order):

- `Hello World, from React Native!`
- `Attached to channel`
- `Published to Ably`
- `Got message from Ably`
