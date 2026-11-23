interface PointHeaderProps {
  name: string;
  summary: string;
}

/** Nome (h1) e resumo do ponto. Compartilhado pelos modos AR e VR. */
export function PointHeader({ name, summary }: PointHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold break-words text-gray-900">{name}</h1>
      <p className="text-lg text-gray-700">{summary}</p>
    </header>
  );
}
