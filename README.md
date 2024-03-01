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

```sh
npm install  ## run on root directory
```

## How to run the application

### Native App

```sh
## npm install is requried to install the necessary modules
npm run start --workspace=native ## start the native application
```

### Admin Panel and Server

```sh
## npm install is requried to install the necessary modules
npm run dev --workspace=<>WORKSPACE_NAME<> ## can be either server or admin.
```

### Technologies Used

- ReactJS
- ReactNative (EXPO)
- MongoDB
- ExpressJS
