# Monorepo for the Renting Application

This monorepo contains three distinct repositories, each dedicated to a specific component of our application.

## Admin Repository (admin)

- Source code for the admin panel.
- Developed with ReactJS using Vite as the build tool.

## Native Repository (native)

- Source code for the native application.
- Developed using Expo for React Native.

## Server Repository (server)

- Source code for the server powering the entire application.
- Developed with ExpressJS.

This modular structure allows for clear separation of concerns, making it easier to independently develop and maintain the admin panel, native application, and server components.

<b>Status Codes Used : 400 (Bad request), 401 (Unauthorized) and 403 (Forbidden)</b>

Feel free to explore each repository for more details on their respective implementations.

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
yarn workspace <>WORKSPACE_NAME<> dev
```

\*NOTE:- Replace <>WORKSPACE_NAME<> with the respective name of the workspace you want to run (can be either server or admin).

## Technologies Used

- ReactJS
- ReactNative (EXPO)
- MongoDB
- ExpressJS
