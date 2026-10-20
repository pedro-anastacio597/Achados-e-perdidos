import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../servicos/api";
import "./ItemDetalhes.css";

function ItemDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [devolvidoPara, setDevolvidoPara] = useState('');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  useEffect(() => {
    if (id && id !== ':id') {
      async function carregarItem() {
        setCarregando(true);
        try {
          const resposta = await api.get(`/itens/${id}`);
          setItem(resposta.data);
        } catch (err) {
          setErro('Erro ao carregar os detalhes do item.');
        } finally {
          setCarregando(false);
        }
      }
      carregarItem();
    }
  }, [id]);

  async function handleExcluir() {
    try {
      await api.delete(`/itens/${id}`);
      navigate('/');
    } catch (err) {
      setMensagem({
        tipo: 'erro',
        texto: err.response?.data?.mensagem || 'Erro ao excluir o item.'
      });
      setConfirmandoExclusao(false);
    }
  }

  async function handleMarcarDevolvido(e) {
    e.preventDefault();

    if (!devolvidoPara) return;

    try {
      const resposta = await api.patch(`/itens/${id}/devolver`, {
        devolvido_para: devolvidoPara,
        status: 'devolvido'
      });

      setItem(resposta.data || {
        ...item,
        status: 'devolvido',
        devolvido_para: devolvidoPara
      });

      setDevolvidoPara('');
      setMensagem({ tipo: 'sucesso', texto: 'Item marcado como devolvido com sucesso!' });
    } catch (err) {
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao marcar como devolvido.'
      });
    }
  }

  function formatarData(dataIso) {
    if (!dataIso) return '-';
    const dataApenas = dataIso.split('T')[0];
    const [ano, mes, dia] = dataApenas.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  if (carregando) return <div className="detalhes-carregando">Carregando detalhes do item...</div>;
  if (erro) return <div className="detalhes-erro">{erro}</div>;
  if (!item) return <div className="detalhes-erro">Item não encontrado.</div>;

  return (
    <div className="detalhes-container">
      <div className="detalhes-header">
        <div className="imagem-container-wrapper">
          <Link to="/" className="btn-voltar">
            ← Voltar
          </Link>
          <div className="placeholder-imagem"></div>
        </div>

        <div className="detalhes-header-info">
          <h2 className="detalhes-titulo">{item.nome}</h2>
          <p className={`status-pill status-${item.status}`}>
            {item.status}
          </p>
        </div>
      </div>

      {mensagem.texto && (
        <p className={`mensagem-box ${mensagem.tipo}`}>
          {mensagem.texto}
        </p>
      )}

      <div className="detalhes-info-grid">
        <div className="info-item">
          <p className="titulo">Descrição:</p>
          <p className="info">{item.descricao || '-'}</p>
        </div>

        <div className="info-item">
          <p className="titulo">Categoria:</p>
          <p className="info">{item.categoria || '-'}</p>
        </div>

        <div className="info-item">
          <p className="titulo">Local:</p>
          <p className="info">{item.local || '-'}</p>
        </div>

        <div className="info-item">
          <p className="titulo">Encontrado em:</p>
          <p className="info">{formatarData(item.data_encontrado)}</p>
        </div>

        <div className="info-item">
          <p className="titulo">Devolvido para:</p>
          <p className="info">{item.devolvido_para || '-'}</p>
        </div>
      </div>

      <div className="detalhes-acoes">
        <Link to={`/editar/${item.id}`} className="btn-acao btn-secundario">
          Editar
        </Link>

        {!confirmandoExclusao ? (
          <button 
            type="button" 
            className="btn-acao btn-perigo" 
            onClick={() => setConfirmandoExclusao(true)}
          >
            Excluir
          </button>
        ) : (
          <p className="box-confirmacao">
            <p>Tem certeza?</p>
            <button type="button" className="btn-acao btn-perigo" onClick={handleExcluir}>
              Sim
            </button>
            <button type="button" className="btn-acao btn-secundario" onClick={() => setConfirmandoExclusao(false)}>
              Cancelar
            </button>
          </p>
        )}
      </div>

      <div className="secao-devolucao">
        <h3>Marcar como devolvido</h3>
        <form onSubmit={handleMarcarDevolvido} className="form-devolucao">
          <input 
            type="text" 
            className="input-devolucao"
            placeholder="Nome de quem recebeu"
            value={devolvidoPara}
            onChange={(e) => setDevolvidoPara(e.target.value)}
            disabled={item.status === 'devolvido'}
          />
          <button 
            type="submit" 
            className="btn-acao btn-confirmar"
            disabled={item.status === 'devolvido'}
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ItemDetalhes;