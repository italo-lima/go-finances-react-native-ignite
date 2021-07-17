import React from "react"
import { Highlightcard } from "../../components/HighlightCard"
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard"

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  UserGreeting,
  UserName,
  Photo,
  User,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton
} from "./styles"

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {

  const data: DataListProps[] = [
    {
      id: "1",
      amount: "R$ 12.000,00",
      category: "coffee",
      date: "13/04/2020",
      name: "Desenvolvimento de site",
      type: "positive"
    },
    {
      id: "2",
      amount: "R$ 12,00",
      category: "coffee",
      date: "13/04/2020",
      name: "Hambúrguer",
      type: "negative"
    },
    {
      id: "3",
      amount: "R$ 12,00",
      category: "coffee",
      date: "13/04/2020",
      name: "Hambúrguer",
      type: "negative"
    },
  ]

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{ uri: "https://avatars.githubusercontent.com/u/28008398?v=4" }}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Ítalo</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <Highlightcard
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de Abril"
        />
        <Highlightcard
          type="down"
          title="Saídas"
          amount="R$ 1.259,00"
          lastTransaction="Última saída dia 03 de Abril"/>
        <Highlightcard
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de Abril"/>
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  )
}