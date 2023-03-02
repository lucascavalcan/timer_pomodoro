import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date // o momento em que o ciclo ficou ativo --> para fazer o timer funcionar
  interruptedDate?: Date // relativo aos ciclos que foram interrompidos (para mostrar no histórico)
  finishedDate?: Date // quando o ciclo encerrou
}

// interface do estado dos ciclos (informaçãoq que vai ser armazenada dentro do reducer - tipo daquele state)
interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

// useReducer recebe dois parametros: uma função e qual o valor inicial da variável [] (no caso, a variável cycles)
// a função (1º parametro) recebe mais dois parâmetros: state (valor atual, em TEMPO REAL da variável - cycles) e action (qual ação o usuário está querendo realizar de alteração dentro da variável - algo único para alterar o estado)
// dentro da função, vai se dar um return state (para retornar o estado atual da variável)
// a action indica qual ação quer fazer para atualizar o estado --> por isso, eu preciso de algo para DISPARAR essa ação (dispatch)
// dispatch: usa-se ele (ao contrário do setCycles no useState) pois ela não é uma função que altera o estado diretamente --> ele dispara uma ação (action) que é quem vai alterar o estado de fato
export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id, // ou seja, vai pegar o id do novo ciclo que está sebdo inserido e vai setar ele já como o novo ciclo ativo
      }
    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
      return {
        // modificar o valor dos ciclos:
        ...state,
        Cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, interruptedDate: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null, // resetar o ciclo ativo
      }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return {
        // modificar o valor dos ciclos:
        ...state,
        Cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, finishedDate: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null, // resetar o ciclo ativo
      }
    default:
      return state
  }
}
