# HomebrokerMicroservices

Este é um projeto que simula **microsserviços** para um home broker, permitindo adicionar assets, criar carteiras e adicionar ordens para serem preenchidas.

## 🚀 Tecnologias Utilizadas

- **NestJS**
- **MongoDB**
- **Docker**
- **Mongoose**
- **TypeScript**
- **RabbitMQ**

## 📦 Como Rodar o Projeto

### 1️⃣ Instalar dependências

Antes de tudo, instale as dependências necessárias:

```sh
npm install
```

### 2️⃣ Configurar variáveis de ambiente

Preencha os valores desejados no arquivo `dev.env`, seguindo os exemplos disponíveis nos arquivos `.example`.

### 3️⃣ Subir os containers com Docker

Execute o script para iniciar os containers necessários:

```sh
./start-docker.ps1  # Para Windows (PowerShell)
```

### 4️⃣ Iniciar o projeto em modo de desenvolvimento

Com tudo configurado, abra um terminal e execute:

```sh
npm run start:dev
```

Depois abra outro terminal, para executar os microserviços:

```sh
npm run start:dev microservices
```

Isso iniciará o servidor e os microserviços e eles ficarão conversando entre si através do **RabbitMQ**.

## 🛠 Estrutura do Projeto

```
/homebroker-microservices
│── apps/
│   ├── api/src/ <--- todos módulos da api
│   ├── microservices/src/ <--- módulos dos microsserviços
│
│── dev.env <--- onde o .env deve ficar
│── docker-compose.yml
│── mongo-keyfile <--- key para poder rodar o MongoDB em modo replica set e usar sessions
│── package.json
│── README.md
```

## 🔹 Arquitetura de Microsserviços

Cada microsserviço fica ouvindo mensagens separadamente e processa apenas a sua responsabilidade, garantindo maior escalabilidade e manutenção simplificada. Por exemplo, ao criar uma ordem, o módulo de carteira atualiza a quantidade de assets e o módulo de ordens atualiza seu status, de acordo com o sucesso ou falha do processamento no microsserviço.

Os microsserviços se comunicam através do **RabbitMQ**, enviando e recebendo mensagens de forma assíncrona. Isso permite um fluxo de dados confiável entre as diferentes partes do sistema.

Além disso, o projeto utiliza **sessions** e **transactions** do **MongoDB** para garantir que operações que precisam ser concluídas integralmente não fiquem parciais, evitando a perda de integridade dos dados.
