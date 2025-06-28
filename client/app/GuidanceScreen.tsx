import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Clipboard } from 'react-native';
import AppScreen from '../components/AppScreen'
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

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
          <Text style={[styles.tabText, selectedTab === 'tips' && styles.activeTabText]}>Tips & Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'password' && styles.activeTab]}
          onPress={() => setSelectedTab('password')}
        >
          <Text style={[styles.tabText, selectedTab === 'password' && styles.activeTabText]}>Password Tools</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'tips' ? (
        <View style={styles.tabContent}>
          <Text style={styles.title}>🔧 Manufacturer Tips</Text>
          <Text style={styles.subtitle}>Select a manufacturer to view update instructions and videos.</Text>
          <View style={styles.manufacturerList}>
            {manufacturers.map((m, idx) => (
              <TouchableOpacity key={idx} style={styles.manufacturerItem} onPress={() => setSelectedManufacturer(m)}>
                <Image source={m.icon} style={styles.icon} />
                <Text style={styles.label}>{m.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedManufacturer && (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>{selectedManufacturer.name}</Text>
              {selectedManufacturer.tips.map((tip:any, index:any) => (
               <View key={index} style={styles.tipItem}>
               <Text style={styles.bullet}>•</Text>
               <Text style={styles.tipText}>{tip}</Text>
            </View>
            ))}

              <TouchableOpacity style={styles.videoButton} onPress={() => setWebUrl(selectedManufacturer.video)}>
              <Ionicons name="globe-outline" size={20} color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                 {selectedManufacturer.supportLinkText || ' Open Support Website'}
              </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.tabContent}>
          <Text style={styles.title}>🔐 Password Assistant</Text>
          <Text style={styles.subtitle}>Test your password and check how strong it is before using it.</Text>

          <View style={styles.passwordBox}>
            <TextInput
              placeholder="Enter password"
              //secureTextEntry
              value={password}
              onChangeText={evaluateStrength}
              style={styles.input}
            />
            <Text style={[styles.strength, strength === 'Weak' && { color: 'red' }, strength === 'Medium' && { color: 'orange' }, strength === 'Strong' && { color: 'green' }]}>Strength: {strength}</Text>
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
});

export default GuidanceScreen;
