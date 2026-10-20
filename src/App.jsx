import { useState,useEffect } from 'react'
import  {Routes,Route} from 'react-router-dom'
import Cabecalho from './componentes/Cabecalho'
import FormularioCadastrarEditar from './componentes/paginas/FormularioCadastrarEditar'
import Home from './componentes/paginas/home'
import api from './servicos/api'
import './App.css'
import ItemDetalhes from './componentes/ItemDetalhes'

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
                  setErro(err.message || "Erro ao carregar dados iniciais")

              } finally{
                  setCarregando(false)
              }
          }

        carregarCabecalho();  
  },[]);

  return (
    <div>
      {carregando && (
          <p>Carregando dados</p>
        )}

        {erro &&(
          <p>{erro}</p>
        )}

        {usuario && <Cabecalho nome={usuario.nome}/>}

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
