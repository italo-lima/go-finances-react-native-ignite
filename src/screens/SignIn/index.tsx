import React, { useState } from "react"
import { ActivityIndicator, Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize"
import { useTheme } from "styled-components"

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuthContext } from "../../hooks/auth";

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from "./styles"

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const theme = useTheme()
  const { signInWithGoogle, signInWithApple } = useAuthContext()

  async function handleSigInWithGoogle() {
    try {
      setIsLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível conectar a conta Google")
      setIsLoading(false)
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true)
      await signInWithApple()
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível conectar a conta Apple")
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <LogoSvg
          width={RFValue(120)}
          height={RFValue(68)}
        />
        
        <TitleWrapper>
          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>  
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>       
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSigInWithGoogle}
          />
          
          {Platform.OS === 'ios' && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {isLoading && <ActivityIndicator
          size="large"
          color={theme.colors.shape}
          style={{marginTop: 18}}
        />}
      </Footer>
    </Container>
  )
}