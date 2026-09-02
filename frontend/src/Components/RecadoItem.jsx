import React from "react";

function RecadoItem({ recado, onDelete, onEdit }) {
    return (
        <div className="recado-item">
            <h3>{recado.titulo}</h3>
            <p>{recado.descricao}</p>
            <div className="recado-actions">
                <button onClick={() => onEdit(recado)}>Editar</button>
                <button onClick={() => onDelete(recado.id)}>Excluir</button>
            </div>
        </div>
    );
}
export default RecadoItem;