import { useTheme } from '@react-navigation/native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
): string {
  const theme = useTheme();
  const colorFromProps = theme.dark ? props.dark : props.light;

  return colorFromProps || colorName;
}
