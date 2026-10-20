import { Link } from "react-router-dom";
import './ItemCard.css';
import imagemObejto from '../imagens/icone-objeto.png'

function ItemCard(props) {
    return (
        <Link to={`/detalhes/${props.item.id}`} className="link-card">
            <div className="card-item"> 
                
                
                <div className="card-header">
                    <img src={imagemObejto} alt="Ícone do item" className="card-icon" />
                    <div className="card-header-info">
                        <h5>{props.item.nome || props.item.titulo}</h5>
                        <div className="card-info">
                            <p>{props.item.local}</p>
                            <p>{props.item.categoria}</p>
                        </div>
                    </div>
                </div>

                
                <p className="description-card">{props.item.descricao}</p>                

                
                <div className="card-status">
                    <p className="status">{props.item.status}</p>
                </div>

            </div>
        </Link>
    )
}

export default ItemCard;