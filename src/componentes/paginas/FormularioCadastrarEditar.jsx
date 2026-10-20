import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../servicos/api";
import './FormularioCadastrarEditar.css';


function FormularioCadastrarEditar(props) {
    const {id} = useParams()
    const navigate= useNavigate()
    const [formulario, setFormulario] = useState({
        nome: '',
        descricao: '',
        categoria: '',
        local: '',
        data_encontrado: ''
    })

    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState(null)
    const [mensagem, setMensagem] = useState({
        tipo: '',
        texto: ''
    })

    useEffect(() => {
        if (id && id !== ':id') {
            async function carregarItem() {
                setCarregando(true);
                try {
                    const resposta = await api.get(`/itens/${id}`);
                    const dadosItem = resposta.data;

                    if (dadosItem.data_encontrado && dadosItem.data_encontrado.includes('T')) {
                        dadosItem.data_encontrado = dadosItem.data_encontrado.split('T')[0];
                    }

                    setFormulario(resposta.data);
                } catch (err) {
                    setErro({
                        texto: err.message || 'Erro ao carregar dados do item.'
                    });
                } finally {
                    setCarregando(false);
                }
            }
            carregarItem();
        }
    }, [id]);

    function handleChange(campo, valor) {
        setFormulario(prevFormulario => ({
            ...prevFormulario,
            [campo]: valor
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });

        console.log("Objeto enviado para a API:", formulario);

        try {
           
            if (id && id !== ':id') {
                await api.put(`/itens/${id}`, formulario); // Usa 'formulario' (o nome do seu estado)
                setMensagem({ tipo: 'sucesso', texto: 'Item atualizado com sucesso!' });
            } else {
                await api.post('/itens', formulario);
                setMensagem({ tipo: 'sucesso', texto: 'Item cadastrado com sucesso!' });
            }

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            console.log("ERRO DETALHADO API:", JSON.stringify(err.response?.data?.detail));
            setMensagem({
                tipo: 'erro',
                texto: err.response?.data?.mensagem || 'Erro ao salvar item.'
            });
        }
    }   
    
    if (carregando) {
        return <div className="formulario-carregando">Carregando dados do item...</div>;
    }

    if (erro) {
        return <div className="formulario-erro">Erro ao carregar item</div>;
    }

    return(
        <div className="formulario-container">
            <h2 className="formulario-titulo">
                {id ? 'Editar item' : 'Novo item'}
            </h2>

            <form onSubmit={handleSubmit} className="formulario-form">
                <div className="campo-grupo">
                    <label htmlFor="nome">Nome</label>
                    <input
                    type="text"
                    name="nome"
                    value={formulario.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    />
                </div>

                <div className="campo-grupo">
                <label htmlFor="descricao">Descrição</label>
                    <textarea 
                        name="descricao"
                        value={formulario.descricao}
                        onChange={(e) => handleChange('descricao', e.target.value)}
                    />
                </div>

                <div className="campo-grupo">
                    <label htmlFor="categoria">Categoria</label>
                    <select name="categoria" value={formulario.categoria} onChange={(e) => handleChange('categoria', e.target.value)}>
                        <option value="" disabled>Selecione uma categoria</option>
                        {props.categorias?.map((categoria) => (
                            <option key={categoria} value={categoria}>{categoria}</option>
                        ))}
                    </select>
                </div>
                <div className="campo-grupo">
                    <label htmlFor="local">Local</label>
                    <select name="local" value={formulario.local} onChange={(e) => handleChange('local', e.target.value)}>
                        <option value="" disabled>Selecione um local</option>
                        {props.locais?.map((local) => (
                            <option key={local} value={local}>{local}</option>
                        ))}
                    </select>
                </div>
                
                <div className="campo-grupo">
                    <label htmlFor="data">Data em que foi encontrado</label>
                    <input 
                        type="date" 
                        name="data_encontrado"
                        value={formulario.data_encontrado}
                        onChange={(e) => handleChange('data_encontrado', e.target.value)}
                    />
                </div>

                {mensagem && (
                <div className={`mensagem-box ${mensagem.tipo}`}>
                    {mensagem.texto}
                </div>
                )}

                <div className="formulario-botoes">
                    <button type="submit" className="btn-acao" id="btn-salvar">Salvar</button>
                    <Link to='/'>
                        <button type="button" className="btn-acao" id="btn-cancelar">Cancelar</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default FormularioCadastrarEditar;