import { ActivityIndicator, View } from 'react-native';

import { useTheme } from 'styled-components/native';

export function Loading() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={theme.COLORS.PINK_200} />
    </View>
  );
}
