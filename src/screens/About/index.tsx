import { ScrollView, View } from 'react-native';

import { Header } from '@components/Header';

import logoImg from '@assets/logo.jpeg';

import { AboutContainer, AboutContent, AboutText, LogoImage } from './styles';

export function AboutScreen() {
  return (
    <AboutContainer>
      <Header title="Sobre" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <AboutContent>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <LogoImage source={logoImg} contentFit="contain" />
          </View>

          <AboutText>
            {'  '} Esse aplicativo tem o intuito de ajudar e fomentar a adoção
            de animais. Adote um amiguinho e dê um lar para eles, pois eles
            precisam muito de nosso carinho. {'\n'} {'  '} E você vai receber um
            amor e carinho enorme nunca sentindo antes. {'\n'}
            {'  '} Nos ajude compartilhando a ideia de adoção.
            {'\n'}
            {'\n'}
            {'\n'}
            Atenciosamente, {'\n'}Equipe Geração Pets.
          </AboutText>
        </AboutContent>
      </ScrollView>
    </AboutContainer>
  );
}
