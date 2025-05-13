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

interface AppScreenProps {
  title?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  leftIcon?: React.ReactNode; // ✅ חדש
}

const AppScreen: React.FC<AppScreenProps> = ({
  title,
  children,
  showBackButton = false,
  leftIcon,
}) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
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
        <View style={styles.backPlaceholder} />
      </View>

      <View style={styles.content}>{children}</View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 SafetyHome</Text>
      </View>
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
    backgroundColor: colors.header,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 20,
    color: colors.textLight,
    fontWeight: '600',
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
