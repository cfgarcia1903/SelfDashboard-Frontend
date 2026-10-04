"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="state-panel state-error"><p>No pudimos cargar la aplicación.</p><button className="button button-secondary" onClick={() => reset()}>Reintentar</button></div>;
}
