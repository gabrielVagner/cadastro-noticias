const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const path = require("path");
const db = require("./db")

//Bodt parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
 
//rota padrão
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "index.html"),
    (err, content) =>{
        if(err) throw err
        
        res.end(content)
        
    })
})

app.get("/index.js", (req, res) => {
    res.sendFile(path.join(__dirname, "index.js"),
    (err, content) =>{
        if(err) throw err
        res.end(content)
    })
})

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"),
    (err, content) =>{
        if(err) throw err
        res.end(content)
    })
})


//pesquisa por noticias no banco de dados
app.get("/noticias/:pesquisa", (req, res) => {
    let pes = req.params.pesquisa?req.params.pesquisa:" "
    if(pes != "everyAll"){
        db.pool().query('SELECT noticias.`titulo`, noticias.`conteudo`, autores.`nome`, noticias.`id` FROM noticias INNER JOIN autores ON noticias.`autor_id` = autores.`id` WHERE noticias.`titulo` LIKE "%'+pes+'%";',
        function(err, results, fields) {
            res.send(results)
        }
        );
    }else{
        db.pool().query('SELECT noticias.`titulo`, noticias.`conteudo`, autores.`nome`, noticias.`id` FROM noticias INNER JOIN autores ON noticias.`autor_id` = autores.`id`;',
        function(err, results, fields) {
            res.send(results)
        }
        );
    }
})

//retorno de uma unica noticia para melhor visualização
app.get("/vizualisar/:noti", (req, res) => {
    let pes = parseInt(req.params.noti)   
    db.pool().query('SELECT noticias.`titulo`, noticias.`conteudo`, autores.`nome`, noticias.`id` FROM noticias INNER JOIN autores ON noticias.`autor_id` = autores.`id` WHERE noticias.`id` = '+pes+';',
    function(err, results, fields) {
        res.send(results)
    }
    );
})

//excluir uma noticia
app.get("/excluir/:noti", (req, res) => {
    let pes = parseInt(req.params.noti)   
    db.pool().query('DELETE FROM noticias WHERE `id` = '+pes+';',
    function(err, results, fields) {
        res.send()
    }
    );
})


//verificar se valores são nulos ou vazios
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

//cadastro de nova noticia
app.post("/cadastrarNot", (req, res) => {
    let titulo = req.body.titulo
    let conteudo = req.body.conteudo
    let autor = req.body.autor
    if(!isEmptyOrSpaces(titulo) && !isEmptyOrSpaces(conteudo) && !isEmptyOrSpaces(autor)){
        db.cadastrar(titulo, conteudo, autor)
        res.send("<body style= 'padding: 20%;text-align: center; background: linear-gradient(180deg, #00203FFF ,#ADEFD1FF) fixed'><h1>Nova noticia Cadastrada</h1></body>")
    }else{
        res.send("<body style= 'padding: 20%;text-align: center; background: linear-gradient(180deg, #00203FFF ,#ADEFD1FF) fixed'><h1>Preencha todos os campos corretamente</h1></body>")
    }
})

//atualização de uma noticia
app.post("/atualizar", (req, res) => {
    let titulo = req.body.titulo
    let conteudo = req.body.conteudo
    let autor = req.body.autor
    let id = req.body.id
    if(!isEmptyOrSpaces(titulo) && !isEmptyOrSpaces(conteudo) && !isEmptyOrSpaces(autor)){
        db.update(titulo, conteudo, autor, id)
        res.send("<body style= 'padding: 20%;text-align: center; background: linear-gradient(180deg, #00203FFF ,#ADEFD1FF) fixed'><h1>Noticia Atualizada Cadastrada</h1></body>")
    }else{
        res.send("<body style= 'padding: 20%;text-align: center; background: linear-gradient(180deg, #00203FFF ,#ADEFD1FF) fixed'><h1>Preencha todos os campos corretamente</h1></body>")
    }
})


app.listen(1006, () =>{console.log("Escutando")})