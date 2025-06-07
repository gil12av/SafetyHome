import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Clipboard } from 'react-native';
import AppScreen from '../components/AppScreen'
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const manufacturers = [
  { name: 'Apple', icon: require('../assets/vendors/apple.png'), 
    tips: 'Use strong passwords and enable two-factor authentication.',
    video: 'https://www.apple.com/support/' },

  { name: 'Xiaomi', icon: require('../assets/vendors/xiaomi.png'), 
   tips: 'Change default passwords and update firmware.', 
   video: 'https://www.mi.com/global/support/' },

  { name: 'Sensibo', icon: require('../assets/vendors/sensibo.png'), 
   tips: 'Check app settings regularly for updates.', 
   video: 'https://sensibo.com/pages/support' },

  { name: 'Aqara', icon: require('../assets/vendors/aqara.png'), 
    tips: 'Reset the hub before updating.', 
    video: 'https://www.aqara.com/us/support.html' },
    
  { name: 'Samsung', icon: require('../assets/vendors/samsung.png'), 
   tips: 'Use Samsung SmartThings app for device security.', 
   video: 'https://www.samsung.com/support/' },
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
              <Text style={styles.tipText}>{selectedManufacturer.tips}</Text>
              <TouchableOpacity style={styles.videoButton} onPress={() => setWebUrl(selectedManufacturer.video)}>
                <Ionicons name="play-circle-outline" size={20} color="white" />
                <Text style={{ color: 'white', marginLeft: 6 }}>Watch video</Text>
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
  tipCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
  },
  videoButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
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
