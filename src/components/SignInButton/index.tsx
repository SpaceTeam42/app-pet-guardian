import { TouchableOpacityProps } from 'react-native';

import { SvgProps } from 'react-native-svg';

import { Button, ImageContainer, Text } from './styles';

interface IProps extends TouchableOpacityProps {
  title: string;
  svg: React.FC<SvgProps>;
}

const SignInButton = ({ title, svg: Svg, ...rest }: IProps) => {
  return (
    <Button {...rest}>
      <ImageContainer>
        <Svg />
      </ImageContainer>

      <Text>{title}</Text>
    </Button>
  );
};

export { SignInButton };
