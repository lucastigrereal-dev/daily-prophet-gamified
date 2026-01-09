import React from 'react';

interface RimaCardProps {
  titulo: string;
  artista: string;
  versos: string[];
  score: number;
  estilo: string;
  favorito?: boolean;
  onFavoritar?: () => void;
}

const RimaCard: React.FC<RimaCardProps> = ({ titulo, artista, versos, score, estilo, favorito = false, onFavoritar }) => {
  return (
    <div className="bg-black/80 backdrop-blur-md text-white rounded-xl p-6 border border-[#ffd700]/30 hover:scale-[1.02] transition-transform duration-300 w-full max-w-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#ffd700]">{titulo}</h2>
          <p className="text-gray-400 text-sm">{artista}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-[#ffd700]/20 text-[#ffd700] text-xs rounded-full">
            {estilo}
          </span>
        </div>

        {/* Botão Favoritar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoritar?.();
          }}
          className={`p-2 rounded-full transition-all duration-300 ${
            favorito
              ? 'text-red-500 bg-red-500/20 hover:bg-red-500/30'
              : 'text-gray-500 hover:text-red-400 hover:bg-gray-800'
          }`}
          aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <svg
            className="w-6 h-6"
            fill={favorito ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Versos */}
      <div className="space-y-2 mb-6">
        {versos.map((verso, index) => (
          <p key={index} className="text-gray-200 leading-relaxed text-sm md:text-base">
            {verso}
          </p>
        ))}
      </div>

      {/* Score Progress Bar */}
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Score</span>
          <span className="text-[#ffd700] font-bold">{score}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ffd700] to-[#ffec80] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RimaCard;
