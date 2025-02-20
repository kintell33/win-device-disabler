import React, { useState, useEffect } from "react";
import { List, Button, Space, Card } from "antd";
import { XFilled } from "@ant-design/icons";
import "./styles.css";

const App = () => {
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState(null);
  const [selectedSelected, setSelectedSelected] = useState(null);

  // Move selected item from available to selected
  const moveToSelected = () => {
    if (selectedAvailable !== null) {
      setSelectedDevices([...selectedDevices, selectedAvailable]);
      setAvailableDevices(
        availableDevices.filter((d) => d !== selectedAvailable)
      );
      setSelectedAvailable(null);
    }
  };

  // Remove selected item from selected list
  const removeFromSelected = () => {
    if (selectedSelected !== null) {
      setAvailableDevices([...availableDevices, selectedSelected]);
      setSelectedDevices(selectedDevices.filter((d) => d !== selectedSelected));
      setSelectedSelected(null);
    }
  };

  useEffect(() => {
    loadSelectedDevices();
    handleRefreshDevices();
  }, []);

  const handleRefreshDevices = () => {
    // Request USB devices when the component loads
    window.electron.requestUSBDevices();

    // Listen for USB device updates
    window.electron.onUSBDevicesReceived((devices) => {
      //filter available device if its already in the selected device list
      let filteredDevices = devices.filter(
        (device) => !selectedDevices.find((d) => d.DeviceID === device.DeviceID)
      );

      let alreadyInSelectedDevices = devices.filter((device) =>
        selectedDevices.find((d) => d.DeviceID === device.DeviceID)
      );

      //sort and set lists
      setAvailableDevices(
        filteredDevices.sort((a, b) =>
          a.FriendlyName.localeCompare(b.FriendlyName)
        )
      );

      setSelectedDevices(
        alreadyInSelectedDevices.sort((a, b) =>
          a.FriendlyName.localeCompare(b.FriendlyName)
        )
      );
    });
  };

  useEffect(() => {
    handleSaveToLocal();
  }, [selectedDevices]);

  const handleSaveToLocal = () => {
    // Save the selected devices to local storage
    localStorage.setItem("selectedDevices", JSON.stringify(selectedDevices));
  };

  const loadSelectedDevices = () => {
    // Load the selected devices from local storage
    let selectedDevices = JSON.parse(localStorage.getItem("selectedDevices"));
    if (selectedDevices) {
      setSelectedDevices(selectedDevices);
    }
  };

  const handleEnableSelectedDevices = () => {
    // Enable all selected devices
    selectedDevices.forEach((device) => {
      window.electron.enableDevice(device.DeviceID);
    });
  };

  const handleDisableSelectedDevices = () => {
    // Disable all selected devices
    selectedDevices.forEach((device) => {
      console.log("disabling the device" + device.DeviceID);
      window.electron.disableDevice(device.DeviceID);
    });
  };

  return (
    <div className="app">
      <h1>Win Device Disabler</h1>
      <div className="container">
        {/* Available Devices */}
        <Card title="Available Devices" className="list-card">
          <Button
            type="primary"
            onClick={handleRefreshDevices}
            style={{ marginBottom: 10 }}
          >
            🔄 Refresh devices
          </Button>
          <div style={{ height: 300, overflow: "auto" }}>
            <List
              bordered
              dataSource={availableDevices}
              renderItem={(item) => (
                <List.Item
                  onClick={() => setSelectedAvailable(item)}
                  className={selectedAvailable === item ? "selected" : ""}
                >
                  <div
                    style={{
                      color: item.Status === "OK" ? "green" : "red",
                      fontSize: 10,
                      marginRight: 10,
                    }}
                  >
                    <XFilled />
                  </div>
                  <strong style={{ fontSize: 12 }}>
                    {item.FriendlyName || "Unknown Device"}
                  </strong>
                  <div style={{ fontSize: 10, color: "#666" }}>
                    {item.Manufacturer}
                  </div>
                </List.Item>
              )}
            />
          </div>
          <Button
            type="primary"
            onClick={moveToSelected}
            disabled={!selectedAvailable}
            style={{ marginTop: 10 }}
          >
            ➡ Add to Selected
          </Button>
        </Card>

        {/* Selected Devices */}
        <Card title="Saved Devices" className="list-card">
          <div style={{ height: 350, overflow: "auto" }}>
            <List
              size="small"
              bordered
              dataSource={selectedDevices}
              renderItem={(item) => (
                <List.Item
                  onClick={() => setSelectedSelected(item)}
                  className={selectedSelected === item ? "selected" : ""}
                >
                  <div
                    style={{
                      color: item.Status === "OK" ? "green" : "red",
                      fontSize: 20,
                      marginRight: 10,
                    }}
                  >
                    <XFilled />
                  </div>
                  <strong style={{ fontSize: 12 }}>
                    {item.FriendlyName || "Unknown Device"}
                  </strong>
                  <div style={{ fontSize: 10, color: "#666" }}>
                    {item.Manufacturer}
                  </div>
                </List.Item>
              )}
            />
          </div>
          <Button
            type="default"
            onClick={removeFromSelected}
            disabled={!selectedSelected}
            style={{ marginTop: 10 }}
          >
            ⬅ Remove from Selected
          </Button>
        </Card>
      </div>

      {/* Action Buttons */}
      <Space className="bottom-buttons">
        <Button
          type="primary"
          size="large"
          onClick={handleEnableSelectedDevices}
        >
          Enable Saved Devices
        </Button>
        <Button size="large" onClick={handleDisableSelectedDevices}>
          Disable Saved Devices
        </Button>
      </Space>
    </div>
  );
};

export default App;
