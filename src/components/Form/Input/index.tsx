import { useCallback, useState, forwardRef } from 'react';

import { TextInputProps, TextInput } from 'react-native';

import { useTheme } from 'styled-components/native';

import {
  InputContainer,
  InputLabel,
  InputContent,
  TextInputField,
  SecureButton,
  IconSecure,
} from './styles';

interface IInputProps extends TextInputProps {
  label?: string;
  contentStyle?: NonNullable<unknown>;
  secureTextFieldEntry?: boolean;
  error?: string | null;
}

export const Input = forwardRef<TextInput, IInputProps>(
  (
    {
      label,
      contentStyle = {},
      secureTextFieldEntry = false,
      error = null,
      ...rest
    },
    ref,
  ) => {
    const [isSecureText, setIsSecureText] = useState(secureTextFieldEntry);

    const theme = useTheme();

    // FUNCTIONS
    const toggleSecureText = useCallback(() => {
      setIsSecureText((oldState) => !oldState);
    }, []);
    // END FUNCTIONS

    return (
      <InputContainer>
        {label && <InputLabel>{label}</InputLabel>}

        <InputContent style={contentStyle} isFocused isError={!!error}>
          <TextInputField
            ref={ref}
            keyboardAppearance="dark"
            placeholderTextColor={theme.COLORS.GRAY_200}
            secureTextEntry={isSecureText}
            {...rest}
          />

          {secureTextFieldEntry && (
            <SecureButton onPress={toggleSecureText}>
              <IconSecure
                name={isSecureText ? 'eye' : 'eye-off'}
                size={24}
                color={theme.COLORS['seconde-color']}
              />
            </SecureButton>
          )}
        </InputContent>
      </InputContainer>
    );
  },
);
