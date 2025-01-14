import React, { useState, useEffect } from 'react';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [movies, setMovies] = useState([]); // Lista de filmes
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
  const [visibleMovies, setVisibleMovies] = useState(10); // 10 filmes visíveis por tela
  const [trailers, setTrailers] = useState({}); // Armazenar trailers dos filmes

  const apiKey = process.env.REACT_APP_API_KEY; // chave de API carregada das variáveis de ambiente
  
  // Função para buscar filmes populares
  const fetchPopularMovies = () => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => setMovies(data.results)) // Atualiza os filmes populares
      .catch((error) => console.error("Erro ao buscar filmes populares:", error));
  };

  // Função para buscar trailers dos filmes
  useEffect(() => {
    fetchPopularMovies(); // Carrega os filmes populares quando o componente é montado
  }, [apiKey]); // Adicionando 'apiKey' no array de dependências

  useEffect(() => {
    // Buscar trailers para os filmes populares carregados
    movies.forEach((movie) => {
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          const trailer = data.results.find((video) => video.type === 'Trailer');
          if (trailer) {
            setTrailers((prev) => ({
              ...prev,
              [movie.id]: trailer.key,
            }));
          }
        })
        .catch((error) => console.error("Erro ao buscar trailer:", error));
    });
  }, [movies, apiKey]); // Adicionando 'movies' e 'apiKey' no array de dependências

  // Função para buscar filmes com base no termo de busca
  const searchMovies = (query) => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results); // Atualiza os filmes com a resposta da API
      })
      .catch((error) => console.error("Erro ao buscar filmes:", error));
  };

  useEffect(() => {
    if (searchTerm) {
      searchMovies(searchTerm); // Se houver um termo de busca, faz a pesquisa
    } else {
      fetchPopularMovies(); // Se não houver termo de busca, carrega filmes populares
    }
  }, [searchTerm, fetchPopularMovies, searchMovies]); // Adicionando 'fetchPopularMovies' e 'searchMovies' no array de dependências

  // Limitar os filmes exibidos com base no estado visibleMovies
  const displayedMovies = movies
    .filter((movie) => trailers[movie.id]) // Filtra os filmes que possuem trailer
    .slice(0, visibleMovies);

  // Função para carregar mais filmes
  const loadMoreMovies = () => {
    setVisibleMovies(visibleMovies + 10); // Aumenta em 10 a quantidade de filmes visíveis
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
      <h1 className="font-burtons font text-xl">developed by <a href='https://github.com/Wpnnt' target="_blank" rel="noreferrer">wpnnt</a> </h1>
        <h1 className="text-3xl font-bold text-center justify-center">       
          <i className="fa-solid fa-film"></i> <a href='http://localhost:3000/'>Trailers de Filmes</a>
        </h1>
      </header>
      <main className="p-4">
        {/* Campo de busca */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar filme..."
            className="w-full p-2 text-black rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
          />
        </div>

        {/* Título para filmes populares */}
        {!searchTerm && (
          <h2 className="text-2xl font-bold text-center mb-4">Filmes Populares</h2>
        )}

        {/* Grid de filmes exibidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              {trailers[movie.id] && (
                <iframe
                  width="100%"
                  height="400px"
                  src={`https://www.youtube.com/embed/${trailers[movie.id]}`}
                  title={movie.title}
                  frameBorder="0"
                  allow="encrypted-media;"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              )}
            </div>
          ))}
        </div>

        {/* Botão de carregar mais filmes */}
        {movies.length > displayedMovies.length && (
          <div className="text-center mt-4">
            <button
              onClick={loadMoreMovies}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Carregar Mais
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
