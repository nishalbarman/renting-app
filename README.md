# RENTING_APP

## What's inside?

Inside this monorepo we have 3 different repo's -- Admin, Native, and Server;

- admin
  - Admin contains the source code for admin panel. created with ReactJS (vite).
- native
  - Native contains the source code for the native application, created with expo react native.
- server
  - Server contains the source code for the server of the whole application, created with ExpressJS

## Installing the dependencies for project

Run the command on the root directory

```sh
yarn install
```

## How to run the application

\*NOTE:- Node modules should be installed first before starting up the application

### Native App

```sh
yarn workspace native start
```

### Admin Panel and Server

```sh
yarn workspace workspace=<>WORKSPACE_NAME<> dev
```

\*NOTE:- Replace <>WORKSPACE_NAME<> with the respective name of the workspace you want to run (can be either server or admin).

### Technologies Used

- ReactJS
- ReactNative (EXPO)
- MongoDB
- ExpressJS
