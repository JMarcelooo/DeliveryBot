# Delivery Bot

Este é um bot de atendimento automatizado para um **delivery de comida**. O bot foi criado utilizando o **Venom** (API para WhatsApp) e a **API do Google Cloud Text-to-Speech** para gerar áudios com o resumo do pedido.

## Funcionalidades

- **Fazer pedido**: O bot permite que o usuário faça pedidos de comida através de um cardápio digital.
- **Reserva de mesas**: O usuário pode consultar mesas disponíveis e realizar reservas.
- **Confirmação de pedido**: Após realizar o pedido, o bot envia um resumo do pedido em texto e áudio para confirmação.
- **Cancelamento de atendimento**: O bot também permite que o usuário cancele o atendimento a qualquer momento.

## Tecnologias Usadas

- **Node.js**: Ambiente de execução para rodar o servidor e o bot.
- **Venom**: Biblioteca que utiliza o WhatsApp Web para automação de mensagens.
- **Google Cloud Text-to-Speech**: API para converter texto em áudio.
- **MongoDB**: Banco de dados utilizado para armazenar os pedidos e reservas.
- **Express**: Framework para criar a API (caso necessário para futuras extensões).

## Pré-requisitos

1. **Node.js**: Você precisa ter o Node.js instalado em sua máquina. Você pode fazer o download em: [https://nodejs.org/](https://nodejs.org/).
   
2. **Conta no Google Cloud**: Para usar a API de **Text-to-Speech**, crie uma conta no [Google Cloud](https://cloud.google.com/) e obtenha a chave de autenticação.

3. **MongoDB**: Configure um banco de dados MongoDB local ou use um serviço em nuvem como o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

4. **Venom Bot**: O bot interage com o WhatsApp Web, então é necessário configurar o **Venom** para funcionar no seu ambiente.

## Instalação

1. Clone este repositório para sua máquina local:

    ```bash
    git clone https://github.com/JMarcelooo/DeliveryBot
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd DeliveryBot
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

4. **Crie o arquivo `.env`** com as variáveis de ambiente necessárias:

    ```env
    MONGO_URI=mongodb://localhost:27017/delivery_bot
    GOOGLE_APPLICATION_CREDENTIALS=./chave-gcp.json
    ```

5. **Habilite a API Google Cloud Text-to-Speech** e configure a chave de autenticação do Google.

---

## Uso

1. Execute o bot com o comando:

    ```bash
    node index.js
    ```

2. O bot se conectará ao **WhatsApp Web** e estará pronto para interagir com os usuários.

3. Envie uma mensagem para o bot no WhatsApp para começar o atendimento!

---

## Estrutura do Projeto

- **`index.js`**: Arquivo principal que inicializa o bot e o servidor.
- **`config/`**: Arquivos de configuração para elementos da aplicação, tal como a conexão com o DB
- **`controllers/`**: Controladores responsáveis pela lógica do bot, como pedidos e reservas.
- **`models/`**: Modelos do MongoDB para armazenar informações sobre pedidos e reservas.
- **`util/`**: Funções auxiliares, como a geração de áudio usando a API do Google TTS.
- **`seeds/`**: Funções para o preenchimento do banco de dados, com itens do cardápio e mesas para reserva.
