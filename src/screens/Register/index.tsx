import React from "react"

import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
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
import { useState } from "react"

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
})

export function Register() {

  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria"
  })

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(schema)
  })

  const handleTransactionsTypeSelect = (type: 'up' | 'down') => {
    setTransactionType(type)
  }

  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false)
  }

  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true)
  }

  const handleRegister = (form: FormData) => {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação")

    if (category.key === 'category') return Alert.alert("Selecione a categoria")
    
    const { amount, name } = form
    const data = {
      amount,
      name,
      transactionType,
      category: category.name
    }

    console.log(data)
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
                onPress={() => handleTransactionsTypeSelect('up')}
                isActive={transactionType === 'up'}
                title="Income"
                type="up"
              />
              <TransactionTypeButton
                onPress={() => handleTransactionsTypeSelect('down')}
                isActive={transactionType === 'down'}
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