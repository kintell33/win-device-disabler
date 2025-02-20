const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 650,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../../dist/renderer/index.html"));

  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  mainWindow.on("closed", () => (mainWindow = null));
}

function getUSBDevices() {
  exec(
    'powershell.exe -Command "Get-PnpDevice -Class USB | Select-Object DeviceID, FriendlyName, Status, Service, Manufacturer  | ConvertTo-Json"',
    (error, stdout) => {
      if (error) {
        console.error("Error fetching USB devices:", error);
        return;
      }

      try {
        const devices = JSON.parse(stdout);
        mainWindow.webContents.send("usb-devices", devices);
      } catch (err) {
        console.error("Error parsing USB device data:", err);
      }
    }
  );
}

function disableDeviceById(deviceId) {
  exec(
    `powershell.exe -Command "Disable-PnpDevice -InstanceId '${deviceId}' -Confirm:$false"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error disabling device ${deviceId}:`, error);
        return;
      }
      console.log(`Device ${deviceId} disabled.`);
      getUSBDevices(); // Update the device list after disabling the device
    }
  );
}

function enableDeviceById(deviceId) {
  exec(
    `powershell.exe -Command "Enable-PnpDevice -InstanceId '${deviceId}' -Confirm:$false"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error enabling device ${deviceId}:`, error);
        return;
      }
      console.log(`Device ${deviceId} enabled.`);
      getUSBDevices(); // Update the device list after enabling the device
    }
  );
}

ipcMain.on("request-usb-devices", () => {
  getUSBDevices();
});

ipcMain.on("disable-device", (event, deviceId) => {
  disableDeviceById(deviceId);
});

ipcMain.on("enable-device", (event, deviceId) => {
  enableDeviceById(deviceId);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
