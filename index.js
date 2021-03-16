const root = document.getElementById("root")
const xhr = new XMLHttpRequest(); 


function defaultRender(rend){
    ReactDOM.render(React.createElement(rend, null, null), root)
}

//botao para a troca de interface
function BotaoTrocPag(props){
    return <button onClick = {()=>{defaultRender(props.page);} } className = {props.className}> {props.text}</button>
}

//pagina de pesquisa das noticias
function Pesquisa(){
    return(
        <div  className = "conteiner">
            {BotaoTrocPag({page: Cadastro, className: "botaoNav", text: "Cadastrar Noticia"})}
            <h1 className = "tituloPagina">Pesquisar Noticia</h1> 
            <input name = "pesquisa" type = "text" className="inputPesq" id="inP"></input>
            <button className= "butIntera" onClick = {()=>{reqNoti(document.getElementById("inP").value)}}>Pesquisar</button>     
            <button className= "butIntera" onClick = {()=>{reqNoti("everyAll")}}>Ver Todas</button>         
        </div>
    )
}

// pagina para o cadastro de uma noticia
function Cadastro(){
    return(
        <div className = "conteiner">
            {BotaoTrocPag({page: Pesquisa, className: "botaoNav", text: "Pesquisar Noticias"})}
            <h1 className = "tituloPagina">Cadastrar Noticia</h1> 
            <form action = "/cadastrarNot" method = "POST" >
                <p className="pForm">Titulo:</p>
                <input name = "titulo" type = "text" className="inputTitulo"></input><br/>
                <p className="pForm">Conteudo:</p>
                <textarea name = "conteudo"></textarea><br/>
                <p className="pForm">Autor:</p>
                <input name = "autor" type = "text" className="inputAutor"></input><br/>
                <button className= "butIntera" type = "submit" >Cadastrar</button>
            </form>     
        </div>
    )
}

//pagina para a edição de uma noticia
function Editar(titulo, conteudo, autor, edicao){
    let editor = (
        <div className = "conteiner">
            {BotaoTrocPag({page: Pesquisa, className: "botaoNav", text: "Pesquisar Noticias"})}
            <h1 className = "tituloPagina">Editar Noticia</h1> 
            <form action = "/atualizar" method = "POST" >
                <p className="pForm">Titulo:</p>
                <input name = "titulo" type = "text" className="inputTitulo" defaultValue = {titulo}></input><br/>
                <p className="pForm">Conteudo:</p>
                <textarea name = "conteudo" defaultValue = {conteudo}></textarea><br/>
                <p className="pForm">Autor:</p>
                <input name = "autor" type = "text" className="inputAutor" defaultValue={autor}></input><br/>
                <input name="id" type="hidden"  defaultValue={edicao} />
                <button className= "butIntera" type = "submit">Salvar Atualização</button>
            </form>     
        </div>
    )
    ReactDOM.render(editor, root)
}

//estrutura para exibir as noticias
function noticBLoco(titulo, conteudo, autor, edicao){
    return(
        <div className = "conteiner">
            <div className = "noti" onClick = {()=> vizualizar(edicao)}>
                <h3>{titulo}</h3>
                <p className= "conteM">{conteudo}</p>
                <p>Autor: {autor}</p>
            </div>
            <button className= "butIntera" onClick={()=>{excluir(edicao)}}>Excluir Noticia</button>
        </div>
    )
}

//noticia maximizada para vizualização
function noticVizual(titulo, conteudo, autor, edicao){
    return(
        <div className = "notiG">
            <h1>{titulo}</h1>
            <h2>{conteudo}</h2>
            <h4>Autor: {autor}</h4>
            <button className= "butIntera" onClick = {()=>{Editar(titulo, conteudo, autor, edicao)}}>editar</button>
        </div>
    )
}

//requisição para a listagem das noticias pesquisadas
function reqNoti(val) {
    val?console.log():alert("Informe um valor valido")

    xhr.open('GET', 'http://localhost:1006/noticias'+'/'+val, true)
    xhr.onreadystatechange = () =>{
        if(xhr.readyState == 4){
            if(xhr.status == 200 ){
                let result =  JSON.parse(xhr.responseText)
                let notic = [];

                if(Object.keys(result).length > 0){
                    notic.push(BotaoTrocPag({page: Pesquisa, className: "botaoNav", text: "Pesquisar Noticias"}))

                    for(let i = 0; i < Object.keys(result).length; i++) {
                        let t = result[i].titulo
                        let c = result[i].conteudo
                        let n = result[i].nome
                        let id = result[i].id

                        notic.push(noticBLoco(t, c, n, id));
                    }
                    ReactDOM.render(notic, root)
                }else{
                    alert("nenhum resultado encontrado")
                }

            }
        }
    }

    xhr.send()
}

//requisição para a vizualização de uma noticia clicada
function vizualizar(edi){
    xhr.open('GET', 'http://localhost:1006/vizualisar'+'/'+edi)
    xhr.onreadystatechange = () =>{
        if(xhr.readyState == 4){
            if(xhr.status == 200 ){
                let result =  JSON.parse(xhr.responseText)
                let no = []
                no.push(BotaoTrocPag({page: Pesquisa, className: "botaoNav", text: "Pesquisar Noticias"}))
                no.push(noticVizual(result[0].titulo, result[0].conteudo, result[0].nome, result[0].id))            
                ReactDOM.render(no, root)

                }

            }
        }
    

    xhr.send()
}

//requisição para uma noticia excluida
function excluir(edi){
    xhr.open('GET', 'http://localhost:1006/excluir'+'/'+edi)
    xhr.onreadystatechange = () =>{
        if(xhr.readyState == 4){
            if(xhr.status == 200 ){
                    defaultRender(Pesquisa)
                    alert("Noticia Deletada")
                }
            }
        }
    

    xhr.send()
}


defaultRender(Pesquisa);