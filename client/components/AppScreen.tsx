import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/styles/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import CustomBottomNavBar from './CustomBottomNavBar';
import { useAuth } from '../context/AuthContext'; 



interface AppScreenProps {
  title?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showBottomNav?: boolean; 
  floatingComponent?: React.ReactNode; 
  onBack?: () => void;
}

const AppScreen: React.FC<AppScreenProps> = ({
  title,
  children,
  showBackButton = false,
  leftIcon,
  rightIcon, 
  showBottomNav = true,
  floatingComponent,
}) => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <LinearGradient
          colors={['#bdc3c7', '#434343']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {leftIcon ? (
          <View style={styles.backButton}>{leftIcon}</View>
        ) : showBackButton ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textLight} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <Text style={styles.title}>{title || 'Screen'}</Text>

        {rightIcon ? (
          <View style={styles.backButton}>{rightIcon}</View>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>

      <Animated.View entering={FadeIn} style={styles.content}>
        {children}
      </Animated.View>

      {user && showBottomNav && <CustomBottomNavBar />}

      {!user && (
        <View style={{ alignItems: 'center', padding: 10 }}>
          <Text style={{ color: '#aaa', fontSize: 12 }}>Login to access full navigation</Text>
        </View>
      )}
      {floatingComponent && (
        <View style={StyleSheet.absoluteFill}>
      {floatingComponent}
    </View>
    )}
 </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 22,
    color: colors.textLight,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: 6,
  },
  backPlaceholder: {
    width: 30,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  footer: {
    backgroundColor: colors.header,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textLight,
    fontSize: 12,
  },
});

export default AppScreen;
