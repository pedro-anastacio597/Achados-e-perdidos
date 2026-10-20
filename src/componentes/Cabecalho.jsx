import './Cabecalho.css'

function Cabecalho(props){
    return(
        <header className="cabecalho">
            <h1>Achados e perdidos - IFRN</h1>
            <h3>Olá, {props.nome}</h3>
        </header>
    )
}

export default Cabecalho;