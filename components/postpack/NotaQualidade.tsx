export interface NotaQualidadeProps {
  nota: number;
  feedbacks: {
    tipo: 'sucesso' | 'alerta' | 'erro';
    mensagem: string;
  }[];
}

export function NotaQualidade({ nota, feedbacks }: NotaQualidadeProps) {
  const notaNormalizada = Math.max(0, Math.min(5, nota));
  const estrelas = '⭐'.repeat(Math.floor(notaNormalizada)) + '☆'.repeat(5 - Math.floor(notaNormalizada));

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="text-2xl">
        {estrelas} ({notaNormalizada.toFixed(1)}/5)
      </div>
      <div className="mt-2 space-y-1">
        {feedbacks.map((f, i) => (
          <div key={i} className="text-sm">
            {f.tipo === 'sucesso' && '✅'}
            {f.tipo === 'alerta' && '⚠️'}
            {f.tipo === 'erro' && '❌'} {' '}
            {f.mensagem}
          </div>
        ))}
      </div>
    </div>
  );
}
