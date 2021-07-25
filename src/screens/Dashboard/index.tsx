import React, { useState, useEffect, useCallback } from "react"
import { ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import { useTheme } from "styled-components"

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
  LogoutButton,
  LoadContainer
} from "./styles"
import { useAuthContext } from "../../hooks/auth"

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string
}

interface Highlight {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransaction] = useState<DataListProps[]>([])
  const [highlight, setHighlight] = useState<Highlight>({} as Highlight)

  const theme = useTheme()
  const {signOut, user} = useAuthContext()

  function getLastTransacationDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const lastTransaction = Math.max.apply(
      Math,
      collection
      .filter(transaction => transaction.type === type)
      .map(transaction => new Date(transaction.date).getTime())
    )

    const lastTransactionDate = new Date(lastTransaction)
  
    return `${lastTransactionDate.getDate()} de ${lastTransactionDate
      .toLocaleString('pt-BR', {month: 'long'})}`
  }

  async function loadTransactions() {
    const dataKey = "@gofinances:transactions"
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let expensiveTotal = 0
    let entriesTotal = 0

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      if(item.type === 'positive') entriesTotal+= Number(item.amount)
      if(item.type === 'negative') expensiveTotal+= Number(item.amount)

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: "currency",
        currency: "BRL"
      })
      
      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date))

      return {
        ...item,
        amount,
        date
      }
    })
    
    const total = entriesTotal - expensiveTotal

    const lastTransactionEntries = getLastTransacationDate(transactions, 'positive')
    const lastTransactionExpensives = getLastTransacationDate(transactions, 'negative')
    const totalInterval = `01 a ${lastTransactionExpensives}`

    setHighlight({
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionExpensives}`
      },
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionEntries}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })
    setTransaction(transactionsFormatted)
    setIsLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []))

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
          />
        </LoadContainer>
      ) : (
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo
                    source={{ uri: user.photo }}
                  />
                  <User>
                    <UserGreeting>Olá, </UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>
                <LogoutButton onPress={signOut}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>
            </Header>
            <HighlightCards>
              <Highlightcard
                type="up"
                title="Entradas"
                amount={highlight.entries.amount}
                lastTransaction={highlight.entries.lastTransaction}
              />
              <Highlightcard
                type="down"
                title="Saídas"
                amount={highlight.expensives.amount}
                lastTransaction={highlight.expensives.lastTransaction}/>
              <Highlightcard
                type="total"
                title="Total"
                amount={highlight.total.amount}
                lastTransaction={highlight.total.lastTransaction}
              />
            </HighlightCards>

            <Transactions>
              <Title>Listagem</Title>

              <TransactionList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({item}) => <TransactionCard data={item} />}
              />
            </Transactions>
          </>
        )}
    </Container>
  )
}