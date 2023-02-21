import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

type ThemeType = typeof defaultTheme

// determina que está se criando uma tipagem para o módulo styled components:
// toda vez que importar o styled components em algum arquivo, a tipagem/definição de tipos que vai ser puxada é o que vai ser definido aqui dentro
// como importou-se o styled components no início vai apenas subscrever (pegar o que já tem e adicionar uma coisa nova)
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
