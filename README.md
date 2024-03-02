# RENTING_APP

## What's inside?

Inside this monorepo we have 3 different repo's -- Admin, Native, and Server;

- Admin
  - Admin contains the source code for admin panel. created with ReactJS (vite).
- Native
  - Native contains the source code for the native application, created with expo react native.
- Server
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
npm run start --workspace=native
```

### Admin Panel and Server

```sh
npm run dev --workspace=<>WORKSPACE_NAME<>
```

\*NOTE:- Replace workspace name with the respective name of the workspace (can be either server or admin).

### Technologies Used

- ReactJS
- ReactNative (EXPO)
- MongoDB
- ExpressJS
