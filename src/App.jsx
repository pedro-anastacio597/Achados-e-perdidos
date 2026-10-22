import { useState,useEffect } from 'react'
import  {Routes,Route} from 'react-router-dom'
import Cabecalho from './componentes/Cabecalho'
import FormularioCadastrarEditar from './componentes/paginas/FormularioCadastrarEditar'
import Home from './componentes/paginas/home'
import api from './servicos/api'
import './App.css'
import ItemDetalhes from './componentes/ItemDetalhes'
import iconecarregamento from './imagens/icone-carregamento.png'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() =>{
          async function carregarCabecalho() {
              try {
                  const user = await api.get('/eu')
                  const loc = await api.get('/locais')
                  const cat = await api.get('/categorias')

                  setUsuario(user.data)
                  setLocais(loc.data)
                  setCategorias(cat.data)

              } catch (err){
                  setErro( "Erro ao carregar dados iniciais")

              } finally{
                  setCarregando(false)
              }
          }

        carregarCabecalho();  
  },[]);

  return (
    <div className='container-principal'>
      {usuario && <Cabecalho nome={usuario.nome}/>}

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


        {erro &&(
          <div className='estado-card erro'>
            <h3>Erro</h3>
            <p>{erro}</p>
          </div>
        )}

      <Routes>
        <Route 
          path="/" 
          element={<Home categorias={categorias} locais={locais} />} 
        />

        <Route
          path='/novo'
          element={<FormularioCadastrarEditar categorias={categorias} locais={locais}/>}
        />

        <Route
          path='/editar/:id'
          element={<FormularioCadastrarEditar categorias={categorias} locais={locais}/>}
        />

        <Route
          path='/detalhes/:id'
          element={<ItemDetalhes/>}
        />
      </Routes>
    </div>  
  )
}

export default App
