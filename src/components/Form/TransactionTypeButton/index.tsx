import React from "react"
import { RectButtonProps } from "react-native-gesture-handler"

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle'
}

import {
  Container,
  Icon,
  Title,
  Button
} from "./styles"

interface Props extends RectButtonProps{
  title: string;
  type: "up" | "down";
  isActive: boolean;
}

export function TransactionTypeButton({isActive, title, type, ...rest}: Props) {
  return (
    <Container
      isActive={isActive}
      type={type}
    >
      <Button 
        {...rest}>
        <Icon
          name={icons[type]}
          type={type}
        />
        <Title>{title}</Title>
      </Button>
    </Container>
  )
}