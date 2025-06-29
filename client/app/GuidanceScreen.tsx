import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Clipboard,
  ScrollView,
  Alert
} from 'react-native';
import AppScreen from '../components/AppScreen';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';


const manufacturers = [
  {
    name: 'Apple',
    icon: require('../assets/vendors/apple.png'),
    tips: [
      'Use strong passwords and enable two-factor authentication for your Apple ID.',
      'Avoid connecting to public Wi-Fi networks without VPN.',
      'Keep your apps up to date via the App Store.',
      'Do not download apps from unknown websites.'
    ],
    video: 'https://www.apple.com/support/',
    supportLinkText: '  Visit Apple Support'
  },
  {
    name: 'Xiaomi',
    icon: require('../assets/vendors/xiaomi.png'),
    tips: [
      'Change all default passwords immediately after setup.',
      'Update firmware regularly through the Mi Home app.',
      'Disable remote access if you do not need it.',
      'Review privacy settings frequently.'
    ],
    video: 'https://www.mi.com/global/support/',
    supportLinkText: '  Visit Xiaomi Support'
  },
  {
    name: 'Sensibo',
    icon: require('../assets/vendors/sensibo.png'),
    tips: [
      'Check app settings regularly for updates.',
      'Ensure your Wi-Fi password is strong.',
      'Reboot the device after firmware updates.'
    ],
    video: 'https://support.sensibo.com',
    supportLinkText: '  Visit Sensibo Support'
  },
  {
    name: 'Aqara',
    icon: require('../assets/vendors/aqara.png'),
    tips: [
      'Reset the hub before updating.',
      'Use secure Wi-Fi connections only.',
      'Change default login credentials.'
    ],
    video: 'https://www.aqara.com/us/support.html',
    supportLinkText: '  Visit Aqara Support'
  },
  {
    name: 'Samsung',
    icon: require('../assets/vendors/samsung.png'),
    tips: [
      'Use the Samsung SmartThings app for device security.',
      'Regularly update device firmware.',
      'Enable notifications for security alerts.',
      'Avoid sharing your account credentials.'
    ],
    video: 'https://www.samsung.com/support/',
    supportLinkText: '  Visit Samsung Support'
  },
];

const GuidanceScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'tips' | 'password'>('tips');
  const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null);
  const [webUrl, setWebUrl] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<'Weak' | 'Medium' | 'Strong' | ''>('');
  const [copied, setCopied] = useState(false);

  const [detectedDevices, setDetectedDevices] = useState<any[]>([]);
  const [updatingDeviceId, setUpdatingDeviceId] = useState<string | null>(null);
  const [showLoadPrompt, setShowLoadPrompt] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);


  const evaluateStrength = (input: string) => {
    setPassword(input);
    if (!input || input.length < 6) return setStrength('Weak');
    if (input.length < 10) return setStrength('Medium');
    setStrength('Strong');
  };

  const copyPassword = () => {
    Clipboard.setString(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleManufacturerSelect = (manufacturer: any) => {
    setSelectedManufacturer(manufacturer);
    setDetectedDevices([]);
    setShowLoadPrompt(false);

    if (manufacturer.name === 'Aqara' || manufacturer.name === 'Sensibo') {
      setShowLoadPrompt(true);
    }
  };

  const handleUpdateFirmware = (id: string) => {
    setUpdatingDeviceId(id);
    setTimeout(() => {
      setDetectedDevices(prev =>
        prev.map(d =>
          d.id === id
            ? { ...d, version: (parseFloat(d.version) + 0.1).toFixed(1) }
            : d
        )
      );
      setUpdatingDeviceId(null);
      Alert.alert(
        'Update Complete',
        'Firmware was successfully updated to the latest version.'
      );
    }, 2000);
  };

  if (webUrl) {
    return (
      <AppScreen title="Back" showBackButton onBack={() => setWebUrl(null)}>
        <WebView source={{ uri: webUrl }} style={{ flex: 1 }} />
      </AppScreen>
    );
  }

  return (
    <AppScreen title="Guidance" showBackButton>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'tips' && styles.activeTab]}
          onPress={() => setSelectedTab('tips')}
        >
          <Text style={[styles.tabText, selectedTab === 'tips' && styles.activeTabText]}>
            Tips & Updates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'password' && styles.activeTab]}
          onPress={() => setSelectedTab('password')}
        >
          <Text style={[styles.tabText, selectedTab === 'password' && styles.activeTabText]}>
            Password Tools
          </Text>
        </TouchableOpacity>
      </View>
  
      {selectedTab === 'tips' ? (
        <ScrollView contentContainerStyle={styles.tabContent}>
          <Text style={styles.title}>🔧 Manufacturer Tips</Text>
  
          <Text style={styles.introText}>
            Welcome to the Guidance Center – manage devices and improve your security.
          </Text>
  
          <Text style={styles.subtitle}>
            Select a vendor to view updates and manage your devices.
          </Text>
  
          <View style={styles.manufacturerList}>
            {manufacturers.map((m, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.manufacturerItem}
                onPress={() => handleManufacturerSelect(m)}
              >
                <Image source={m.icon} style={styles.icon} />
                <Text style={styles.label}>{m.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
  
          {selectedManufacturer && (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>{selectedManufacturer.name}</Text>
              {selectedManufacturer.tips.map((tip: any, index: any) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.videoButton}
                onPress={() => setWebUrl(selectedManufacturer.video)}
              >
                <Ionicons name="globe-outline" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                  {selectedManufacturer.supportLinkText || 'Open Support Website'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
  
          {showLoadPrompt && (
            <View style={styles.loadPrompt}>
              <Text style={styles.loadPromptText}>
              Detected devices available
              </Text>
              <View style={styles.loadPromptActions}>
                <TouchableOpacity
                  style={styles.loadPromptButton}
                  onPress={() => setShowLoadPrompt(false)}
                >
                  <Text style={styles.loadPromptButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loadPromptButton}
                  onPress={() => {
                    setLoadingDevices(true);
                    setShowLoadPrompt(false);
                    setTimeout(() => {
                      if (selectedManufacturer.name === 'Aqara') {
                        setDetectedDevices([
                          { id: '1', name: 'Aqara Hub', version: '1.0.0' },
                          { id: '2', name: 'Aqara Motion Sensor', version: '2.1.0' },
                          { id: '3', name: 'Aqara Temperature Sensor', version: '3.0.0' },
                        ]);
                      } else if (selectedManufacturer.name === 'Sensibo') {
                        setDetectedDevices([
                          { id: '1', name: 'Sensibo AC Sensor', version: '1.5.2' },
                        ]);
                      }
                      setLoadingDevices(false);
                    }, 2000);
                  }}
                >
                  <Text style={styles.loadPromptButtonText}>Load</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
  
          {loadingDevices && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                Loading devices...
              </Text>
              <ActivityIndicator size="small" color="#4A90E2" />
            </View>
          )}
  
          {detectedDevices.length > 0 && (
            <View style={styles.devicesContainer}>
              <Text style={styles.devicesTitle}>Devices Detected:</Text>
              <Text style={styles.devicesSubtitle}>
                Manage your connected devices securely and keep them up to date.
              </Text>
              {detectedDevices.map(device => (
                <View key={device.id} style={styles.deviceCard}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceVersion}>Version {device.version}</Text>
                  <View style={styles.deviceActions}>
                    <TouchableOpacity
                      onPress={() => handleUpdateFirmware(device.id)}
                      style={styles.deviceActionUpdate}
                    >
                      <Text style={styles.deviceActionText}>
                       <Ionicons name="refresh" size={16} color="#fff" style={{marginRight:4}} />
                        {updatingDeviceId === device.id ? 'Updating...' : ' Update Firmware'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          'Authentication Required',
                          'Please log in to your account to update the device password.'
                        )
                      }
                      style={styles.deviceActionPassword}
                    >
                      <Text style={styles.deviceActionText}>Change Password</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.tabContent}>
          <Text style={styles.title}>🔐 Password Assistant</Text>
          <Text style={styles.subtitle}>
            Test your password and check how strong it is before using it.
          </Text>
          <View style={styles.passwordBox}>
            <TextInput
              placeholder="Enter password"
              value={password}
              onChangeText={evaluateStrength}
              style={styles.input}
            />
            <Text
              style={[
                styles.strength,
                strength === 'Weak' && { color: 'red' },
                strength === 'Medium' && { color: 'orange' },
                strength === 'Strong' && { color: 'green' },
              ]}
            >
              Strength: {strength}
            </Text>
            <TouchableOpacity onPress={copyPassword} style={styles.copyButton}>
              <Text style={{ color: '#fff' }}>{copied ? 'Copied!' : 'Copy Password'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </AppScreen>
  );
  
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    margin: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#e4e4e4',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#ccc',
  },
  tabText: {
    fontSize: 15,
    color: '#555',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000',
  },
  tabContent: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  manufacturerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  manufacturerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  tipCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    elevation: 2,
  },
  videoButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  
  passwordBox: {
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  strength: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  copyButton: {
    marginTop: 10,
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },

devicesContainer: {
  marginTop: 20,
},
devicesTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 10,
  color: '#333',
},
deviceCard: {
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
  padding: 12,
  marginBottom: 10,
},
deviceName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
deviceVersion: {
  fontSize: 14,
  color: '#555',
  marginBottom: 8,
},
deviceActions: {
  flexDirection: 'row',
},
deviceActionUpdate: {
  backgroundColor: '#4A90E2',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 6,
  marginRight: 8,
},
deviceActionPassword: {
  backgroundColor: '#999',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 6,
},
deviceActionText: {
  color: '#fff',
  fontSize: 13,
},
loadPrompt: {
  backgroundColor: '#eef',
  borderRadius: 8,
  padding: 12,
  marginTop: 12,
},
introText: {
  fontSize: 14,
  color: '#555',
  marginBottom: 12,
},
devicesSubtitle: {
  fontSize: 13,
  color: '#777',
  marginBottom: 6,
},

loadPromptText: {
  fontSize: 14,
  color: '#333',
  marginBottom: 8,
},
loadPromptActions: {
  flexDirection: 'row',
},
loadPromptButton: {
  backgroundColor: '#4A90E2',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  marginRight: 8,
},
loadPromptButtonText: {
  color: '#fff',
  fontSize: 13,
}
});

export default GuidanceScreen;
