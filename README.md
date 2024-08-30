# Desafio Shopper

Antes de executar o projeto, criar um arquivo .env na raiz do projeto com as seguintes variáveis:

GEMINI_API_KEY=sua_chave
API_URL=http://localhost:8080
DATABASE_HOST=db
DATABASE_USER=user
DATABASE_PASSWORD=user
DATABASE_NAME=shopper

OBS: é importante definir API_URL como o endereço que acessamos os endpoints da api. Ele é crucial para acessar as imagens temporárias. Sugiro deixar o mesmo valor do exemplo. DATABASE_HOST é o nome do container que tem a imagem do postgres, se seu nome não for db, será impossível se conectar ao container. Sugiro que também fique igual ao exemplo.

Para executar o projeto, esteja com o Docker rodando e rode o comando: docker compose up

Uma vez que as mensagens 'Server listening on http://localhost:8080' e 'Successfully connected to database' aparecerem no log, já é possível testar o projeto.
