import { FormConatiner, MinutesAmountInput, TaskInput } from './styles'
import { useContext } from 'react'
import { CyclesContext } from '../../../../contexts/CycleContext'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  // o register determina quais são os campos desse formulário. Vejamos:
  const { register } = useFormContext() // fiz essa inporção devido ao uso do FormProvider envolta do NewCycleForm que clonou as propriedades do newCycleForm

  return (
    <FormConatiner>
      <label htmlFor="Task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-suggestion"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle} // desabilitar esse componnete caso se tenha algum ciclo ativo (!! - converter para false caso não tenha nenhum valor dentro)
        {...register('task')}
      />

      <datalist id="task-suggestion">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
        <option value="Projeto 4" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycle} // desabilitar esse componnete caso se tenha algum ciclo ativo (!! - converter para false caso não tenha nenhum valor dentro)
        {...register('minutesAmount', { valueAsNumber: true })} // o segundo parametro valueAsNumber determina que o valor que retorna do input vai ser um number (pq via de regra vem como string)
      ></MinutesAmountInput>

      <span>minutos.</span>
    </FormConatiner>
  )
}
