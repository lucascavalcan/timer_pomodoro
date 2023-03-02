import { createContext, ReactNode, useReducer, useState } from 'react'
import {
  ActionTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentFunctionAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  // interface necessária relativa aos dados usados para poder criar um novo cycle
  task: string
  minutesAmount: number
}

interface CycleContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CycleContextType)
// dentro do createContext (função que cria o context) coloca-se qual o valor inicial do contexto

interface CyclesContextproviderProps {
  children: ReactNode // essa children que é passada como props é o router que vai ficar dentro do contexto CyclesContextProvider
}

export function CyclesContextProvider({
  children,
}: CyclesContextproviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // o tanto de segundos que se passaram desde que o ciclo começou

  // de dentro do cyclesState eu posso buscar informações específicas (como os cycles e o activeCycleId)
  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  // essa variável acima vai dizer qual o ciclo ativo --> vai percorrer todos os ciclos (cycles) e dizer qual o ativo (com base no id do state activeCycle - dizer qual o ciclo com o msm id desse ciclo ativo)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentFunctionAsFinishedAction())
    /* setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    ) */
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()), // vai retornar a data atual convertida em milisegundos
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(), // data atual (data que o ciclo iniciou)
    }

    // dentro do dispatch, é preciso enviar uma informação para que lá dentro do reducer, seja possível distinguir a ação realizada pelo usuário
    dispatch(addNewCycleAction(newCycle)) // função importada de actions/cycles/reducers

    // setCycles((state) => [...state, newCycle]) // sempre que uma alteração de estado depender do estado anterior, usa-se arrow function (poderia simplemsnete fazer ([...cycles], newCycle]) )
    setAmountSecondsPassed(0) // voltando o numero de segundos que passaram para 0
  }

  // voltar para o estado inicial da aplicação:
  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
    /* setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    ) */
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
