import axios from "axios";

const PokemonService = {
    buscarPokemon: async (nome) => {
        const resposta = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`
        );

        return resposta.data;
    }
};

export default PokemonService;