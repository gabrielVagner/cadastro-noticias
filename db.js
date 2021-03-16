const mysql = require("mysql2");

//conexâo com banco de dados utilizado
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

function selectAll(tabela){
     pool().query('SELECT * FROM '+tabela+'; ', function(err, results, fields) {
        console.log(results)
     }
    );

}

// função para inserir na tabela noticias
function insertIntoNot(titulo, conteudo, idAutor){
    pool().execute('INSERT INTO noticias(`titulo`, `conteudo`, `autor_id`) VALUES ( ? ,? ,? );', [titulo, conteudo, idAutor], 
    function(err, results, fields) {
        console.log("inserido");
        //selectAll("`noticias`");
    }
    );
}

// função para atualizar na tabela noticias
function updateNot(titulo, conteudo, idAutor, id){
    pool().execute('UPDATE noticias SET `titulo` = ?, `conteudo` = ?, `autor_id` = ? WHERE `id` =  ?;', [titulo, conteudo, idAutor, id], 
    function(err, results, fields) {
        console.log("atualisado");
    }
    );
}


// função utilizando quando o usuario cadastra uma nova noticia
function cadastrar(titulo, conteudo, nomeAutor){
    pool().query('SELECT `id` FROM autores WHERE `nome` = "' + nomeAutor + '";', // verifica se o autor passado ja é cadastrado 
    function(err, results, fields){
        if(results.length > 0){
            insertIntoNot(titulo, conteudo, results[0].id)// caso afirmativo ele adiciona a nova noticia
        }else{// caso negatico ele adiciona o novo autor e a nova noticia
            pool().execute('INSERT INTO autores(`nome`) VALUES (?);', [nomeAutor],
            function (err, results, fields){
                pool().query('SELECT `id` FROM autores WHERE `nome` = "' + nomeAutor + '";',
                function (err, results, fields){
                    insertIntoNot(titulo, conteudo, results[0].id);
                })
            })
           
        }
    })
}

// função utilizando quando o usuario atualiza uma noticia
function update(titulo, conteudo, nomeAutor, id){
    pool().query('SELECT `id` FROM autores WHERE `nome` = "' + nomeAutor + '";', // verifica se o autor passado ja é cadastrado 
    function(err, results, fields){
        if(results.length > 0){
            updateNot(titulo, conteudo, results[0].id, id)
        }else{// caso negatico ele adiciona o novo autor e atualiza a noticia
            pool().execute('INSERT INTO autores(`nome`) VALUES (?);', [nomeAutor],
            function (err, results, fields){
                pool().query('SELECT `id` FROM autores WHERE `nome` = "' + nomeAutor + '";',
                function (err, results, fields){
                    updateNot(titulo, conteudo, results[0].id, id)
                })
            })
           
        }
    })
}




module.exports = {cadastrar, update, selectAll, pool}
