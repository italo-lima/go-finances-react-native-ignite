import React, { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import uuid from "react-native-uuid"
import { useNavigation } from "@react-navigation/native"

import { InputForm } from "../../components/Form/InputForm"
import { Button } from "../../components/Form/Button"
import { CategorySelect } from "../CategorySelect"
import { CategorySelectButton } from "../../components/Form/CategorySelectButton"
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton"
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from "./styles"
import { useAuthContext } from "../../hooks/auth"

interface FormData {
  name: string;
  amount: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório'),
  amount: yup
    .number()
    .typeError("Informe um valor númerico")
    .positive("O valor não pode ser negativo")
    .required('Valor é obrigatório'),
})

export function Register() {
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria"
  })

  const { user } = useAuthContext()

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(schema)
  })

  const navigation = useNavigation()

  const handleTransactionsTypeSelect = (type: 'positive' | 'negative') => {
    setTransactionType(type)
  }

  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false)
  }

  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true)
  }

  const handleRegister = async (form: FormData) => {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação")

    if (category.key === 'category') return Alert.alert("Selecione a categoria")
    
    const { amount, name } = form
    const newTransaction = {
      id: String(uuid.v4()),
      amount,
      name,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`
      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []
      const dataFormatted = [
        ...currentData,
        newTransaction
      ]
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

      reset()
      setTransactionType('')
      setCategory({
        key: "category",
        name: "Categoria"
      })
      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível salvar")
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                onPress={() => handleTransactionsTypeSelect('positive')}
                isActive={transactionType === 'positive'}
                title="Income"
                type="up"
              />
              <TransactionTypeButton
                onPress={() => handleTransactionsTypeSelect('negative')}
                isActive={transactionType === 'negative'}
                title="Outcome"
                type="down"
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)}/>
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            closeSelectCategory={handleCloseSelectCategoryModal}
            setCategory={setCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}