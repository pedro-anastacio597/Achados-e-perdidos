import { useEffect,useState } from "react";
import{Link} from 'react-router-dom';
import ItemCard from "../ItemCard";
import api from "../../servicos/api";
import './home.css'
import iconecarregamento from '../../imagens/icone-carregamento.png'
import '../../App.css'


function Home(props){
    const [itens, setItens] = useState([])
    const [filtro, setFIltro] = useState({
        busca: '',
        status: '',
        categoria: '',
        local: '',
    })
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    function HandleChange(campo, valor){
        setFIltro({
          ...filtro,
            [campo]: valor
        })
    }

    useEffect(() => {
    async function carregarItens() {
        setCarregando(true);
        try {
            const resposta = await api.get('/itens');
            setItens(resposta.data);   
        } catch (err) {
            setErro( "Erro ao carregar itens");
        } finally {
            setCarregando(false);   
        }   
    }

    carregarItens();
    }, []); 

    const itensFiltrados = itens.filter((item) => {
        const atendeBusca = !filtro.busca || 
            item.nome?.toLowerCase().includes(filtro.busca.toLowerCase()) ||
            item.descricao?.toLowerCase().includes(filtro.busca.toLowerCase());

        const atendeStatus = !filtro.status || item.status === filtro.status;
        const atendeCategoria = !filtro.categoria || item.categoria === filtro.categoria;
        const atendeLocal = !filtro.local || item.local === filtro.local;

        return atendeBusca && atendeStatus && atendeCategoria && atendeLocal;
    });

    return(
        <div>
            <div className="subtitulo">
                <h2>Itens encontrados</h2>
                <Link to="/novo">+ Novo item</Link>
            </div>

            <div>
                <input 
                    type="text" 
                    placeholder="Buscar por nome ou descrição..."
                    value={filtro.busca}
                    onChange={(e) => HandleChange('busca', e.target.value)}
                    className="busca"
                />  

                <div className="container-selects">
                    <select value={filtro.status} onChange={(e) => HandleChange('status', e.target.value)}>
                        <option value="">Selecione um status</option>
                        <option value='aguardando'>Aguardando</option>
                        <option value='devolvido'>Devolvido</option>
                    </select>

                    <select  value={filtro.categoria} onChange={(e) => HandleChange('categoria', e.target.value)}>
                        <option value="">Selecione uma categoria</option>
                        {props.categorias?.map((categoria) => (
                            <option key={categoria} value={categoria}>{categoria}</option>
                        ))}
                    </select>

                    <select value= {filtro.local} onChange={(e) => HandleChange('local', e.target.value)}>
                        <option value="">Selecione um local</option>
                        {props.locais?.map((local) => (
                            <option key={local} value={local}>{local}</option>
                        ))}

                    </select>
                </div>
            </div>

            {carregando && (
                <div className='estado-card carregando'>
                    <div>
                    <h3>Carregando</h3>
                    <p>Carregando itens...</p>
                    </div>
        
                    <div className='icone-carregamento'>
                    <img src={iconecarregamento} alt="spinner de carregemento"/>
                    </div>
                </div>
            )}

            {erro && (
                <div className='estado-card erro'>
                    <h3>Erro</h3>
                    <p>{erro}</p>
                </div>
            )}

            {!erro && !carregando && itens.length===0 && (
                <div className="estado-card">
                    <h3>Lista vazia</h3>
                    <p>Nenhum item encontrado</p>
                </div>
            )}

            {!carregando && !erro && itensFiltrados.length > 0 && (
                <div className="container-cards">
                    {itensFiltrados.map((item) => (
                        <ItemCard item={item}/>
                    ))}
                </div>
            )}  
        </div>
    )
}

export default Home;