'use client';

interface Props {
  progress: number;
  color?: string;
}

export function ProgressBar({ progress, color = 'bg-green-500' }: Props) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${color}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
