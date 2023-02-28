import { createContext, ReactNode, useState } from 'react'

interface CreateCycleData {
  // interface necessária relativa aos dados usados para poder criar um novo cycle
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date // o momento em que o ciclo ficou ativo --> para fazer o timer funcionar
  interruptedDate?: Date // relativo aos ciclos que foram interrompidos (para mostrar no histórico)
  finishedDate?: Date // quando o ciclo encerrou
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
// dentro do createContext (função que cria o context) coloca-se qual o valor inciial do contexto

interface CyclesContextproviderProps {
  children: ReactNode // essa children que é passada como props é o router que vai ficar dentro do contexto CyclesContextProvider
}

export function CyclesContextProvider({
  children,
}: CyclesContextproviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  // estado para definir qual o id do ciclo ativo (pois é apenas um ciclo que fica ativo por vez):
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // ou tá nulo(inativo) ou ativo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // o tanto de segundos que se passaram desde que o ciclo começou

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  // essa variável acima vai dizer qual o ciclo ativo --> vai percorrer todos os ciclos (cycles) e dizer qual o ativo (com base no id do state activeCycle - dizer qual o ciclo com o msm id desse ciclo ativo)

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()), // vai retornar a data atual convertida em milisegundos
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(), // data atual (data que o ciclo iniciou)
    }

    setCycles((state) => [...state, newCycle]) // sempre que uma alteração de estado depender do estado anterior, usa-se arrow function (poderia simplemsnete fazer ([...cycles], newCycle]) )
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0) // voltando o numero de segundos que passaram para 0
  }

  // voltar para o estado inicial da aplicação:
  function interruptCurrentCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null) // anotar se o ciclo foi interrompido ou não (para mostrar no histórico depois)
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
