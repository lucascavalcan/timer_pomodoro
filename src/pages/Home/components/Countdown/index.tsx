import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CycleContext'
import { CountdiwnConatiner, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  // variável para converter o numero de minutos em segundos (para poder usar no countdown):
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // dentro desse useefect vai criar o intervalo (relativo ao timer). Vejamos:
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      // se tiver um activecycle, vai chamar um setIntervale a cada 1 segundo
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        ) // vai-se usar a função differenceInSeconds da biblioteca 'date-fns' --> diferença em segundos da data atual (new Date) e da data que o ciclo começou ()

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds) // para o cronometro ficar zerado
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // o useEffect pode ter um retorno (esse retorno é sempre uma função). Vejamos:
    return () => {
      clearInterval(interval)
    }
    // no nosso exemplo, essa função serve para --> quando o useEffecr for executado dnv (pq houve uma mudanção no activeCycle - foi criado um novo ciclo), remover os intervalos dos ciclos anteriores
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 // o total de segundos menos o tanto de segundos que já passou

  // tendo a quantidade de segundos atual (currentSeconds) é preciso converter isso de uma forma que possa ser exibido em tela (já que mostra em minutos). Vejamos:
  const minutesAmount = Math.floor(currentSeconds / 60) // numero de minutos
  const secondsAmount = currentSeconds % 60 // numero de segundos (resto da divisão)

  // variável para colocar a quantidade de minutos no formato de dois dígitos (ex: 09) para ficar mais facil na hora de xibir em tela
  const minutes = String(minutesAmount).padStart(2, '0') // tem que ter 2 caracteres, caso não tenha, inclui um 0 no começo(start)
  const seconds = String(secondsAmount).padStart(2, '0')

  // criar função para fazer o timer rodar no title da página:
  useEffect(() => {
    if (activeCycle) {
      // pois só execita isso se tiver um ciclo ativo
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdiwnConatiner>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdiwnConatiner>
  )
}
