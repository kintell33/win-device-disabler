import React, { useState, useEffect } from "react";
import { List, Button, Space, Card } from "antd";
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
    // Request USB devices when the component loads
    window.electron.requestUSBDevices();

    // Listen for USB device updates
    window.electron.onUSBDevicesReceived((devices) => {
      setAvailableDevices(Array.isArray(devices) ? devices : [devices]); // Handle single object case
    });
  }, []);

  return (
    <div className="app">
      <h1>Device Manager</h1>
      <div className="container">
        {/* Available Devices */}
        <Card title="Available Devices" className="list-card">
          <div style={{ height: 300, overflow: "auto" }}>
            <List
              bordered
              dataSource={availableDevices}
              renderItem={(item) => (
                <List.Item
                  onClick={() => setSelectedAvailable(item)}
                  className={selectedAvailable === item ? "selected" : ""}
                >
                  <strong>{item.FriendlyName || "Unknown Device"}</strong> -{" "}
                  {item.Status}
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
                  <strong>{item.FriendlyName || "Unknown Device"}</strong> -{" "}
                  {item.Status}
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
        <Button type="primary" size="large">
          Enable Saved Devices
        </Button>
        <Button type="primary" size="large">
          Disable Saved Devices
        </Button>
      </Space>
    </div>
  );
};

export default App;
