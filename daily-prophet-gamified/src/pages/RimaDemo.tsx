import React, { useState } from 'react';
import RimaList from '../components/RimaList';

const mockRimas = [
  {
    id: 1,
    titulo: "Poesia de Rua",
    artista: "MC Sabotage",
    versos: [
      "Na selva de pedra eu aprendi a sobreviver",
      "Cada rima é uma bala, cada verso é poder",
      "Do gueto pro mundo, fazendo história",
      "Rap nacional, eterna glória"
    ],
    score: 95,
    estilo: "Boom Bap"
  },
  {
    id: 2,
    titulo: "Trap do Fluxo",
    artista: "MC Drip",
    versos: [
      "Ice no pulso, flow no beat",
      "Subindo de vida, nunca delete",
      "Money talks, haters walk"
    ],
    score: 82,
    estilo: "Trap"
  },
  {
    id: 3,
    titulo: "Consciência Lírica",
    artista: "Poeta MC",
    versos: [
      "Palavras cortantes como navalha",
      "Verdade nua crua que não falha",
      "Espelho da quebrada, voz do povo",
      "Cada verso escrito é um recomeço novo"
    ],
    score: 91,
    estilo: "Rap Consciente"
  },
  {
    id: 4,
    titulo: "Freestyle Session",
    artista: "MC Improviso",
    versos: [
      "Sem papel, sem caneta, só mente afiada",
      "Rima de primeira, nunca ensaiada",
      "Batalha de rua, microfone em chamas"
    ],
    score: 88,
    estilo: "Freestyle"
  },
  {
    id: 5,
    titulo: "Melodia Urbana",
    artista: "MC Harmony",
    versos: [
      "Entre acordes e rimas encontrei meu lugar",
      "Melodia que cura, faz a alma voar",
      "Do asfalto às estrelas, som que liberta"
    ],
    score: 76,
    estilo: "R&B/Rap"
  },
  {
    id: 6,
    titulo: "Old School Vibes",
    artista: "DJ Classic",
    versos: [
      "Back to the roots, essência do rap",
      "Vinil girando, beat que não tem trap",
      "Respeito aos mestres, cultura imortal",
      "Hip-hop é vida, movimento universal"
    ],
    score: 97,
    estilo: "Old School"
  }
];

type OrdenacaoType = 'score-desc' | 'score-asc' | 'nome-asc' | 'nome-desc';

const RimaDemo: React.FC = () => {
  const [filtroEstilo, setFiltroEstilo] = useState<string>('');
  const [busca, setBusca] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState<OrdenacaoType>('score-desc');
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());

  const estilos = [...new Set(mockRimas.map(r => r.estilo))];

  const toggleFavorito = (id: string | number) => {
    setFavoritos(prev => {
      const next = new Set(prev);
      if (next.has(id as number)) {
        next.delete(id as number);
      } else {
        next.add(id as number);
      }
      return next;
    });
  };

  const rimasFiltradas = mockRimas
    .filter(rima => {
      const matchEstilo = !filtroEstilo || rima.estilo === filtroEstilo;
      const matchBusca = !busca ||
        rima.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        rima.artista.toLowerCase().includes(busca.toLowerCase());
      return matchEstilo && matchBusca;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'score-desc': return b.score - a.score;
        case 'score-asc': return a.score - b.score;
        case 'nome-asc': return a.titulo.localeCompare(b.titulo);
        case 'nome-desc': return b.titulo.localeCompare(a.titulo);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-[#ffd700]/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#ffd700]">
            Rima Vault
          </h1>
          <p className="text-gray-400 mt-1">Coleção de rimas e flows</p>
        </div>
      </header>

      {/* Busca e Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search e Ordenação */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="relative flex-1 md:max-w-96">
            <input
              type="text"
              placeholder="Buscar por título ou artista..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-full px-5 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffd700]/50 focus:ring-1 focus:ring-[#ffd700]/50 transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {busca && (
              <button
                onClick={() => setBusca('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Ordenação */}
          <div className="relative">
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as OrdenacaoType)}
              className="appearance-none bg-gray-800/50 border border-gray-700 rounded-full px-5 py-3 pr-10 text-white focus:outline-none focus:border-[#ffd700]/50 focus:ring-1 focus:ring-[#ffd700]/50 transition-all cursor-pointer"
            >
              <option value="score-desc">Maior Score</option>
              <option value="score-asc">Menor Score</option>
              <option value="nome-asc">Nome A-Z</option>
              <option value="nome-desc">Nome Z-A</option>
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Filtros por Estilo */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroEstilo('')}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              filtroEstilo === ''
                ? 'bg-[#ffd700] text-black font-bold'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Todos
          </button>
          {estilos.map(estilo => (
            <button
              key={estilo}
              onClick={() => setFiltroEstilo(estilo)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filtroEstilo === estilo
                  ? 'bg-[#ffd700] text-black font-bold'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {estilo}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 text-sm">
          <div className="text-gray-400">
            <span className="text-[#ffd700] font-bold text-lg">{rimasFiltradas.length}</span> rimas
          </div>
          <div className="text-gray-400">
            <span className="text-[#ffd700] font-bold text-lg">
              {rimasFiltradas.length > 0 ? Math.round(rimasFiltradas.reduce((acc, r) => acc + r.score, 0) / rimasFiltradas.length) : 0}
            </span> score médio
          </div>
          <div className="text-gray-400">
            <span className="text-red-500 font-bold text-lg">{favoritos.size}</span> favoritos
          </div>
        </div>
      </div>

      {/* Lista de Rimas */}
      <main className="max-w-7xl mx-auto pb-12">
        <RimaList
          rimas={rimasFiltradas}
          emptyMessage={busca ? `Nenhuma rima encontrada para "${busca}"` : "Nenhuma rima neste estilo"}
          favoritos={favoritos}
          onFavoritar={toggleFavorito}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        Rima Vault Demo - Built with React + TailwindCSS
      </footer>
    </div>
  );
};

export default RimaDemo;
