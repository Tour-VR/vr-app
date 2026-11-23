interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

/** Falha ao carregar, com botao para tentar de novo. */
export function ErrorState({
  message = 'Não foi possível carregar o conteúdo. Verifique a conexão.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 py-10 text-base">
      <p className="text-gray-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
      >
        Tentar de novo
      </button>
    </div>
  );
}
