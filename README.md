# Win-Device-Disabler

## Description

Win-Device-Disabler is an Electron-based application with a React frontend that allows users to manage USB devices on their system. The application enables users to retrieve a list of connected USB devices, create groups of saved devices, and disable or enable them in bulk.

## Features

- Retrieve a list of connected USB devices
- Create and manage groups of saved devices
- Enable or disable devices in groups
- User-friendly interface built with React and Ant Design

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/win-device-disabler.git
   cd win-device-disabler
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the application in development mode:
   ```sh
   npm run dev
   ```
4. To build the production version:
   ```sh
   npm run build
   ```
5. To start the built application:
   ```sh
   npm run electron
   ```

## Project Structure

```
win-device-disabler/
│-- dist/                     # Compiled output
│-- node_modules/             # Dependencies
│-- src/                      # Source code
│   ├── main/                 # Electron main process
│   │   ├── index.js          # Entry point for the main process
│   │   ├── preload.js        # Preload script for renderer
│   ├── renderer/             # Frontend
│   │   ├── public/           # Static assets
│   │   │   ├── index.html    # Main HTML file
│   │   ├── src/              # React application
│   │   │   ├── App.js        # Main React component
│   │   │   ├── index.js      # React entry point
│   │   │   ├── styles.css    # Styling
│-- .babelrc                  # Babel configuration
│-- .gitignore                # Files to ignore in git
│-- package.json              # Project dependencies and scripts
│-- webpack.config.js         # Webpack configuration
```

## Scripts

- `npm run dev`: Builds the project and starts Electron in development mode.
- `npm run build`: Uses Webpack to bundle the application for production.
- `npm run electron`: Starts Electron with the built files.
- `npm start`: Runs `build` and then starts Electron (used for production builds).

## Dependencies

### Runtime Dependencies

- **`electron`**: Main framework for building desktop applications.
- **`react` & `react-dom`**: Used for building the user interface.
- **`antd`**: UI library for a modern and clean interface.

### Development Dependencies

- **`@babel/core`, `@babel/preset-env`, `@babel/preset-react`**: Transpiles modern JavaScript and JSX for compatibility.
- **`babel-loader`**: Loads Babel-transpiled code in Webpack.
- **`concurrently`**: Runs multiple npm scripts in parallel.
- **`css-loader`, `style-loader`**: Handles CSS imports in JavaScript.
- **`electron-builder`**: Creates installers for Windows.
- **`electron-reloader`**: Enables live reloading during development.
- **`html-webpack-plugin`**: Generates an optimized HTML file.
- **`webpack`, `webpack-cli`, `webpack-dev-server`**: Bundles JavaScript and serves it during development.
- **`wait-on`**: Ensures required services are running before starting.

## Building for Production

To package the app into an installer, use:

```sh
npm run build
```

Electron Builder will generate the executable in the `dist/` folder.

## License

This project is licensed under the ISC License.