const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  requestUSBDevices: () => ipcRenderer.send("request-usb-devices"),
  disableDevice: (deviceId) => ipcRenderer.send("disable-device", deviceId),
  enableDevice: (deviceId) => ipcRenderer.send("enable-device", deviceId),
  onUSBDevicesReceived: (callback) =>
    ipcRenderer.on("usb-devices", (_, data) => callback(data)),
});
