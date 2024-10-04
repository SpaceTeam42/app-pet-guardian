import { ActivityIndicator, TouchableOpacityProps } from 'react-native';

import { useTheme } from 'styled-components';

import { Container, ButtonText } from './styles';

interface IButtonProps extends TouchableOpacityProps {
  children: string;
  loading?: boolean;
}

const Button = ({ children, loading = false, ...rest }: IButtonProps) => {
  const theme = useTheme();

  return (
    <Container loading={loading} disabled={loading} {...rest}>
      {loading ? (
        <ActivityIndicator size={25} color={theme.colors['white-color']} />
      ) : (
        <ButtonText>{children}</ButtonText>
      )}
    </Container>
  );
};

export { Button };
