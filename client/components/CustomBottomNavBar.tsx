import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomBottomNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/ScanScreen')}>
        <MaterialCommunityIcons name="radar" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/TalkWithBot')}>
        <MaterialCommunityIcons name="robot" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity onPress={() => router.replace('/Dashboard')} style={styles.centerButton}>
          <MaterialCommunityIcons name="home" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/FAQscreen')}>
        <MaterialCommunityIcons name="help-circle" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/Profile')}>
        <MaterialCommunityIcons name="account" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width,
    height: 70,
    backgroundColor: '#2c3e50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
  },
  centerButtonWrapper: {
    position: 'absolute',
    top: -30,
    left: width / 2 - 35,
    backgroundColor: '#2c3e50',
    borderRadius: 40,
    padding: 8,
    elevation: 12,
  },
  centerButton: {
    backgroundColor: '#4A90E2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomBottomNavBar;
