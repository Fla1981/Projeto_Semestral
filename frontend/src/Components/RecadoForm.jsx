
import {useState} from 'react';

function RecadoForm({onAddRecado}) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    onAddRecado({
      titulo,
      texto
    });

    setTitulo('');
    setTexto('');
  }
   return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label htmlFor="texto">Texto:</label>
        <textarea
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      <br />

      <button type="submit">Adicionar Recado</button>
    </form>
  );
}

export default RecadoForm;

