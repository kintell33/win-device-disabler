const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  requestUSBDevices: () => ipcRenderer.send("request-usb-devices"),
  onUSBDevicesReceived: (callback) =>
    ipcRenderer.on("usb-devices", (_, data) => callback(data)),
});
