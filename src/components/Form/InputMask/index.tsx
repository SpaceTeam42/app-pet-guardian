import { MaskedTextInputProps } from 'react-native-mask-text';

import { useTheme } from 'styled-components/native';

import {
  InputContainer,
  InputLabel,
  InputContent,
  TextInputField,
} from './styles';

interface IInputMaskProps extends MaskedTextInputProps {
  label?: string;
  contentStyle?: NonNullable<unknown>;
  error?: string | null;
}

export function InputMask({
  label,
  contentStyle = {},
  error = null,
  ...rest
}: IInputMaskProps) {
  const theme = useTheme();

  return (
    <InputContainer>
      {label && <InputLabel>{label}</InputLabel>}

      <InputContent style={contentStyle} isFocused isError={!!error}>
        <TextInputField
          keyboardAppearance="dark"
          placeholderTextColor={theme.COLORS.GRAY_200}
          {...rest}
        />
      </InputContent>
    </InputContainer>
  );
}
