export const triggerScan = async () => {
    console.log("📡 MOCK triggerScan called");
    return {
      devices: [
        {
          deviceName: "Mock Device",
          ipAddress: "192.168.1.100",
          macAddress: "AA:BB:CC:DD:EE:FF",
        },
      ],
    };
  };
  
  export const triggerDeepScan = async () => {
    console.log("📡 MOCK triggerDeepScan called");
    return {
      devices: [
        {
          deviceName: "Mock Deep Device",
          ipAddress: "192.168.1.200",
          macAddress: "11:22:33:44:55:66",
          operatingSystem: "MockOS 1.0",
          openPorts: [
            {
              port: 80,
              service: "http",
              product: "Apache",
              version: "2.4.46",
            },
          ],
        },
      ],
    };
  };
  