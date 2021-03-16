# Portal de Noticias

Um portal simples de notícias para realização de cadastro de notícias, pesquisa de notícias e visualização de notícias.

## Começando

Realizar um ```git clone``` do projeto ou baixe o zip através da pagina no github.


## Pré-requisitos

Necessário a instalaçado do Node.js e dos modulos express, body-parser e mysql2.
Tambem é necessário a instalação do banco de dado MySql


## Instalação

O banco de dados MySql pode ser obtido pelo seu próprio [site](https://dev.mysql.com/downloads/installer/)

O Node.js tambem é obtido através do proprio [site](https://nodejs.org/en/).

Após a instalação do Node.js, os modulos podem ser instalados no diretório do projeto através do prompt de comando com:
```
npm install express --save

npm install body-parser --save

npm install mysql2 --save 

```

## Configurando

Primeiramente é necessario utilizar o prompt de comando do MySql para criar um banco de dados
```CREATE DATABASE nomeDoDataBase;```

Em seguida utilize esse banco de dados
```USE nomeDoDataBase;```

Então crie as duas tabelas seguintes
```
CREATE TABLE autores(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL
);

CREATE TABLE noticias(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(30) NOT NULL,
    conteudo TEXT NOT NULL,
    autor_id INT UNSIGNED NOT NULL, 
    FOREIGN KEY(autor_id) REFERENCES autores(id) 
);
```

Utilize alguma ferramenta para editar o seguinte trexo de código do arquivo do projeto, db.js, colocando as informações referentes ao seu banco de dados MySql
```
function pool() {
    const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'cadastro_noticias',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    return pool
}
```

Por fim abra um prompt de comando do diretorio do projeto e execute ```node conect.js```, e então abra no seu navegador o endereço [http://localhost:1006/](http://localhost:1006/)


## Utilização

A tela inicial do projeto apresenta a interface para pesquisar as notícias cadastradas.

No canto superior esquerdo existe um botão que leva para as interfaces de cadastro ou pesquisa, dependendo em qual tela você se encontra.

Quando ocorre a pesquisa de notícias, os resultados são listados em pequenos blocos que possuem um botão de exclusão da notícia. Caso o bloco de uma notícia 
seja clicado ele levará para uma tela onde ocorre a melhor vizualização da notícia e possui um botão que leva para a tela de edição da notícia.
