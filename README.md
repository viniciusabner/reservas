# Ferramenta de Reservas e Gestão de Espaços
Este projeto é uma aplicação web para a gestão de reservas e criação de espaços. Permite aos usuários visualizar, reservar e cancelar reservas de horários disponíveis em diferentes espaços. Além disso, administradores podem criar, editar e excluir espaços e horários disponíveis.

## Tecnologias Utilizadas
- React: Biblioteca JavaScript para construção de interfaces de usuário.
- React Bootstrap: Componentes estilizados para React baseados no framework Bootstrap.
- Fetch API: API para realizar requisições HTTP.
- JavaScript: Linguagem de programação utilizada para lógica de front-end.
- CSS: Folhas de estilo para personalização da interface.
- Supabase: Plataforma backend para gerenciamento de banco de dados.

## Funcionalidades
- Componente Manage
    Adicionar Espaço: Permite adicionar um novo espaço com capacidade e horários disponíveis.
    Editar Espaço: Permite editar informações dos espaços existentes, incluindo nome, capacidade e horários.
    Excluir Espaço: Permite excluir um espaço existente.
    Gerenciamento de Horários: Permite adicionar, editar e excluir horários disponíveis para cada espaço.

- Componente Reserve
    Visualizar Espaços: Exibe uma lista de espaços disponíveis com horários e disponibilidade.
    Reservar Horário: Permite reservar horários disponíveis preenchendo informações como nome, email e telefone.
    Cancelar Reserva: Permite cancelar uma reserva existente, tornando o horário disponível novamente.

## Como Executar o Projeto
Pré-requisitos
- Node.js instalado
- npm (gerenciador de pacotes do Node.js)


## Passo a Passo

1. Clone o Repositório
git clone https://github.com/viniciusabner/reservas
cd seu-repositorio

2. Instale as Dependências
npm install

3. Configuração do Backend
Certifique-se de que você tem uma API backend rodando localmente para interagir com este front-end. Este projeto espera que o backend esteja rodando na porta 3000. Ajuste o URL no código se necessário.

4. Inicie o Projeto
npm start

5. Acesse a Aplicação
Abra seu navegador e acesse http://localhost:5173

## Estrutura dos Componentes
Manage Component
Este componente é responsável pela criação, edição e exclusão de espaços e horários disponíveis.

Reserve Component
Este componente permite aos usuários visualizar os espaços disponíveis e fazer reservas.

Arquivos CSS
Os estilos personalizados são definidos nos arquivos .css correspondentes a cada componente.

## Controladores (Controllers)

Criar Espaço
Adiciona um novo espaço ao banco de dados com os detalhes fornecidos no corpo da requisição.

Listar Espaços
Lista todos os espaços disponíveis no banco de dados.

Editar Espaço
Atualiza os detalhes de um espaço existente no banco de dados.

Reservar Horário
Permite a reserva de um horário disponível para um usuário.

Listar Horários Disponíveis
Lista apenas os horários disponíveis para reserva.

Excluir Espaço
Exclui um espaço existente no banco de dados.|

