import React from 'react';
import RimaCard from './RimaCard';

interface Rima {
  id: string | number;
  titulo: string;
  artista: string;
  versos: string[];
  score: number;
  estilo: string;
}

interface RimaListProps {
  rimas: Rima[];
  emptyMessage?: string;
  favoritos?: Set<string | number>;
  onFavoritar?: (id: string | number) => void;
}

const RimaList: React.FC<RimaListProps> = ({ rimas, emptyMessage = 'Nenhuma rima encontrada', favoritos = new Set(), onFavoritar }) => {
  if (!rimas || rimas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {rimas.map((rima) => (
        <RimaCard
          key={rima.id}
          titulo={rima.titulo}
          artista={rima.artista}
          versos={rima.versos}
          score={rima.score}
          estilo={rima.estilo}
          favorito={favoritos.has(rima.id)}
          onFavoritar={() => onFavoritar?.(rima.id)}
        />
      ))}
    </div>
  );
};

export default RimaList;
