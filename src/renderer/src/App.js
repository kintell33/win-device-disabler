import React, { useState, useEffect } from "react";
import { List, Button, Space, Card } from "antd";
import { XFilled } from "@ant-design/icons";
import "./styles.css";

const App = () => {
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState(null);
  const [selectedSelected, setSelectedSelected] = useState(null);

  const openNotification = (title, text) => {
    alert(`${title}: ${text}`);
  };

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
    window.electron.requestUSBDevices();

    window.electron.onUSBDevicesReceived((devices) => {
      //filter null values
      setConnectedDevices(devices.filter((d) => d));
    });
  };

  useEffect(() => {
    if (connectedDevices.length > 0) {
      let filteredAvailableDevices = connectedDevices.filter(
        (device) => !selectedDevices.find((d) => d.DeviceID === device.DeviceID)
      );

      setAvailableDevices(
        filteredAvailableDevices.sort((a, b) =>
          a?.FriendlyName?.localeCompare(b.FriendlyName)
        )
      );

      //update selected devices status
      let updatedSelectedDevices = selectedDevices.map((device) => {
        let updatedDevice = connectedDevices.find(
          (d) => d.DeviceID === device.DeviceID
        );
        return updatedDevice || device;
      });

      setSelectedDevices(updatedSelectedDevices);
    }
  }, [connectedDevices]);

  const handleSaveToLocal = () => {
    // Save the selected devices to local storage
    localStorage.setItem("selectedDevices", JSON.stringify(selectedDevices));
    openNotification("Devices Saved", "Selected devices have been saved");
  };

  const loadSelectedDevices = () => {
    // Load the selected devices from local storage
    let selectedDevices = JSON.parse(localStorage.getItem("selectedDevices"));
    if (selectedDevices) {
      setSelectedDevices(selectedDevices);
    }
  };

  const handleEnableSelectedDevices = () => {
    selectedDevices.forEach((device) => {
      window.electron.enableDevice(device.DeviceID);
    });

    setTimeout(() => {
      handleRefreshDevices();
    }, 2000);
  };

  const handleDisableSelectedDevices = () => {
    selectedDevices.forEach((device) => {
      window.electron.disableDevice(device.DeviceID);
    });

    setTimeout(() => {
      handleRefreshDevices();
    }, 2000);
  };

  return (
    <div className="app">
      <h1>Win Device Disabler</h1>
      <div className="container">
        {/* Available Devices */}
        <Card title="Available Devices" className="list-card">
          <Button onClick={handleRefreshDevices} style={{ marginBottom: 10 }}>
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
                  <strong
                    style={{ fontSize: 12, width: "100%", textAlign: "left" }}
                  >
                    {item.FriendlyName || "Unknown Device"}
                  </strong>
                  <div
                    style={{ fontSize: 10, color: "#666", textAlign: "right" }}
                  >
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
        <Card title="Selected Devices" className="list-card">
          <Button onClick={handleSaveToLocal} style={{ marginBottom: 10 }}>
            💾 Save devices
          </Button>
          <div style={{ height: 300, overflow: "auto" }}>
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
                  <strong
                    style={{ fontSize: 12, width: "100%", textAlign: "left" }}
                  >
                    {item.FriendlyName || "Unknown Device"}
                  </strong>
                  <div
                    style={{ fontSize: 10, color: "#666", textAlign: "right" }}
                  >
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
        <Button danger size="large" onClick={handleDisableSelectedDevices}>
          Disable Saved Devices
        </Button>
      </Space>
    </div>
  );
};

export default App;
