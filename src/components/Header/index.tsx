import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from 'styled-components/native';

import { Feather } from '@expo/vector-icons';

import { Container, HeaderBackButton, HeaderTitle } from './styles';

interface IHeaderProps {
  title?: string;
}

export function Header({ title = '' }: IHeaderProps) {
  const theme = useTheme();
  const navigation = useNavigation();

  // FUNCTIONS
  const handleGoBackNavigation = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  // END FUNCTIONS

  return (
    <Container>
      <HeaderBackButton onPress={handleGoBackNavigation}>
        <Feather name="chevron-left" size={30} color={theme.COLORS.BLACK} />
      </HeaderBackButton>

      <HeaderTitle>{title}</HeaderTitle>
    </Container>
  );
}
