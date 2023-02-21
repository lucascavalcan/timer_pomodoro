import { HandPalm, Play } from 'phosphor-react'
import { useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  HomeConatiner,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../contexts/CycleContext'

const newCycleFormValidatorSchema = zod.object({
  // é object pois o retorno dos dados do formulário é um objeto (o formulário retorna {})
  task: zod.string().min(1, 'Informe a tarefa'), // a validação do task é --> ele obrigatoriamnete vai ser uma STRING que tenha NO MÍNIMO 1 caractere e SE NÃO INFORMAR ESSE 1 CACARTERE vai mostrar a mensagem de validação
  minutesAmount: zod // a validação desse 2° campo é --> NUMERO com MINIMO 5 e MAXIMO 60
    .number()
    .min(5, 'O ciclio precisa ser de, no mínimo, 5 minutos.')
    .max(60, 'O ciclo pode ser de, no máximo, 60 minutos'),
})

type NewCycleFormatData = zod.infer<typeof newCycleFormValidatorSchema> // essa função do zod serve para inferir o type dos dados do formulário (task e minutesAmount) diretamente do newCycleFormValidatorSchema (ou seja, o ts analisou o schema de validação o conlcuiu o type dos dados)

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  // vamos usar o contexto próprio do react-hook-form
  const newCycleForm = useForm<NewCycleFormatData>({
    // reset serve para resetar a função (limpar o formulário)
    resolver: zodResolver(newCycleFormValidatorSchema), // dentro do zodResolver colocamos qual o schema de validação (de que forma vai se validar os dados) -> para isso foi usado o objeto newCycleFormValidatorSchema
    defaultValues: {
      // essa propriedade traz a possibilidade de se passar qual o valor inicial de cad campo
      task: '',
      minutesAmount: 0,
    },
  })
  // fizemos a validação (usando a bilioteza zod) e colocando o objeto {} dnetro do useForm

  const { handleSubmit, watch, reset } = newCycleForm // fiz a desestruturaçãoa qui para poder ter acesso a variável completa

  function handleCreateNewCycle(data: NewCycleFormatData) {
    createNewCycle(data)
    reset()
  }

  // a função watch é importada para observar algo --> vamos usar ela para observar o task e saber o que tem no campo em tempo
  const task = watch('task')
  // vou observar o campo de task, caso ele seja DIFERENTE DE VAZIO vai-se habilitar o botão
  const isSubmitDisabled = !task

  return (
    <HomeConatiner>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          {/* passando todas as propriedades do newCycleForm para o FormProvider */}
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeConatiner>
  )
}
