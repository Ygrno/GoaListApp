# GoalList Project

## Description

This is a React Native application that allows users to manage a list of goals. The goals can be fetched from a server or local storage, and the user can add, delete, and view goals.

## Important Note

This application shares the same server-side data among all users. This means that each user will be exposed to the same list of goals stored on the server. 
There is currently no separation of data between different devices or users, and the application does not support any kind of authentication or security.
Also, there's no use of a database, so if the server restarts the list of goals restarts with it.

The reason for that is that I never meant to publish this app, only using it as a prototype or proof of concept and sharing it with close group of friends.
Please be aware of this when using the application.

## Features

- Fetch goals from a server or local storage
- Add new goals
- Delete existing goals
- View a list of current goals
- Hebrew support on devices with hebrew as default system language

## Installation

To install the project, follow these steps:

1. Clone the repository: `git clone https://github.com/Ygrno/GoaListApp.git`
2. Install the dependencies: `npm install`

## Usage

Start the 'expo' server: 'npm-start'
If you have an android emulator installed on your device you can press 'a' and view the app. 

To build an apk file - I'm using the command: 'eas build -p android --profile preview'

## Dependencies

- React Native
- Expo

## Screenshots

Here are some screenshots of the GoalList app:

<p float="left" align="center">
  <img src="https://github.com/Ygrno/GoaListApp/assets/26521541/c94b28ff-c8b4-423a-aae4-53ff49310e7c" width="200" />
  <img src="https://github.com/Ygrno/GoaListApp/assets/26521541/a7e6014e-6a1e-44db-a467-74c9c9a1871c" width="200" /> 
</p>
