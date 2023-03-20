# Simple Chat by GPT-4

Simple chat with authorization and registration written in React and NodeJS with GPT-4 (ChatGPT)

The project was created to analyze the capabilities of ChatGPT and possible ideas for the implementation of this tool in the future.
## Launch

The server is started with the command

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The NodeJS server runs at [http://localhost:8080](http://localhost:8080)


## Description

The application uses the following technologies:
- React
- Redux
- Socket.IO
- PostCSS
- TailwindCSS
- JWT
- Express

## Limitations

The current project configuration is not suitable for its production deployment due to the fact that logins and passwords are stored in plain text, as well as the hardcoded path to the server and port.

## Changelog

### v0.1

- Created basic functionality of the chat application
- Added authorization functionality using JWT token

