import { createGlobalStyle } from 'styled-components'

// importar esse componente global onde eu quiser usá-lo na aplicação
// importante importá-lo dentro do theme provider para que esses estilos globais tambem tenham acesso às variáveis do provider

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :focus {
        outline: 0;
        box-shadow: 0 0 0 2px ${(props) => props.theme['green-500']};
    }

    body {
        color: ${(props) => props.theme['gray-300']};
        background-color: ${(props) => props.theme['gray-900']};
        -webkit-font-smoothing: antialiased; 
    }

    body, input, textarea, button {
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 1rem;
    }
`
