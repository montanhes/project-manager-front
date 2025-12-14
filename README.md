# Project Manager Front-end

Este é o front-end para a aplicação Project Manager, construído com React, TypeScript e Vite.

## Arquitetura e Dependências

Este projeto faz parte de uma arquitetura que separa o front-end (interface do usuário) do back-end (lógica de negócios e banco de dados). Essa separação visa melhorar a organização, a manutenibilidade e a escalabilidade, permitindo que cada parte seja desenvolvida e implantada de forma independente.

Para que esta interface funcione corretamente, é necessário que o servidor de API esteja em execução. O projeto back-end correspondente pode ser encontrado e configurado a partir do seguinte repositório:

*   [**Project Manager API**](https://github.com/montanhes/project-manager-api)

Certifique-se de instalar e iniciar o projeto back-end antes de executar esta aplicação front-end.

## Começando

### Pré-requisitos

*   Node.js (versão 20.x ou superior)
*   npm ou yarn

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/montanhes/project-manager-front.git
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd project-manager-front
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```

### Executando a aplicação

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Executando com Docker (Alternativa)

Como alternativa à instalação local, você pode executar o projeto dentro de um contêiner Docker.

**1. Instale o Docker**

Primeiramente, certifique-se de que o Docker está instalado em sua máquina. Caso não esteja, siga as instruções oficiais de instalação para o seu sistema operacional:

*   [**Instalar o Docker Engine**](https://docs.docker.com/engine/install/)

**2. Construa a Imagem Docker**

No diretório raiz do projeto, execute o seguinte comando para construir a imagem:

```bash
docker build -t project-manager-front .
```

**3. Execute o Contêiner**

Após a construção da imagem, inicie o contêiner com o comando abaixo:

```bash
docker run -p 5173:5173 project-manager-front
```

A aplicação também estará disponível em `http://localhost:5173`.

## Build para produção

Para criar uma build de produção, execute:

```bash
npm run build
```

## Linting

Para executar o linter, use:

```bash
npm run lint
```

## Tecnologias Utilizadas

*   **React:** Uma biblioteca JavaScript para construir interfaces de usuário.
*   **TypeScript:** Um superconjunto tipado de JavaScript que compila para JavaScript puro.
*   **Vite:** Uma ferramenta de build rápida que proporciona uma experiência de desenvolvimento veloz.
*   **Axios:** Um cliente HTTP baseado em promises para o navegador e Node.js.
*   **React Router:** Uma coleção de componentes de navegação que compõem declarativamente com sua aplicação.
*   **Tailwind CSS:** Um framework CSS utility-first para construir designs personalizados rapidamente.
*   **DaisyUI:** Uma biblioteca de componentes para Tailwind CSS.
