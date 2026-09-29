import axios from "axios";

const PokemonService = {
    buscarPokemon: async (nome) => {
        const nomeFormatado = nome.trim().toLowerCase();

        const resposta = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${nomeFormatado}`
        );

        return resposta.data;
    }
};

export default PokemonService;