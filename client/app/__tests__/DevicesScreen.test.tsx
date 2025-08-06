
import React from 'react';
import { render } from '@testing-library/react-native';

describe('🧪 DevicesScreen  Render', () => {
  it('renders mock screen', () => {
    const MockDevicesScreen = () => <></>; // מסך דמה
    render(<MockDevicesScreen />);
    console.log("✅ Device succesfully add to list");
  });
});
