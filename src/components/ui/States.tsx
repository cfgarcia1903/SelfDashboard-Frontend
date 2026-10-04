import { RefreshCw } from "lucide-react";

export function LoadingState({ label = "Cargando información" }: { label?: string }) {
  return <div className="state-panel" role="status"><span className="loading-pulse" />{label}</div>;
}

export function EmptyState({ message = "No hay información disponible para este período." }: { message?: string }) {
  return <div className="state-panel">{message}</div>;
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <div className="state-panel state-error"><p>No pudimos cargar la información.</p><p>Intenta nuevamente.</p>{onRetry ? <button className="button button-secondary" onClick={onRetry}><RefreshCw size={16} /> Reintentar</button> : null}</div>;
}
