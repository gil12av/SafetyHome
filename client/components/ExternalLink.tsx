import React from 'react';
import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  const handlePress = async (event: { preventDefault: () => void }) => {
    if (Platform.OS !== 'web') {
      // מניעת ההתנהגות המובנית
      event.preventDefault();
      // פתיחה בדפדפן פנימי
      await openBrowserAsync(href);
    }
  };

  // return (
  //   <Link
  //     target={Platform.OS === 'web' ? '_blank' : undefined}
  //     {...rest}
  //     href={href}
  //     onPress={handlePress}
  //   />
  // );
}
