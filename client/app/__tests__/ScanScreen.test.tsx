jest.mock('@/services/api.jsx', () => require('../__mocks__/api.jsx'));

describe('🧪 ScanScreen Integration Flow', () => {

  const mockDevices = [
    { deviceName: "Test Device", ipAddress: "192.168.1.10", macAddress: "AA:BB:CC:DD:EE:FF" },
  ];

  const mockProps = {
    onScanComplete: jest.fn((devices) => {
      console.log("📥 scan complete with devices:", devices);
    }),
    onProgressUpdate: jest.fn((progress) => {
      console.log("📈 progress updated:", progress);
    }),
    onLoadingChange: jest.fn((loading) => {
      console.log("⏳ loading changed:", loading);
    }),
  };

  it('מדמה לחיצה על סריקה ומציג את זרימת הסריקה (Flow)', async () => {
    console.log("✅ Start a integration test for ScanScreen ");

    const { handleScan } = require('../../components/Scan').default(mockProps);

    await handleScan(false);

    console.log("🔁 run a test to see if the script actually start");
    expect(mockProps.onLoadingChange).toHaveBeenCalledWith(true);

    console.log("🧪 Integration test successfully ended");
  });

});
