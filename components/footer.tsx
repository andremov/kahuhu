export function Footer() {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex items-center justify-center gap-3 py-2 text-xs text-muted-foreground opacity-60">
      <span>Powered by PartyKit</span>
      <span aria-hidden="true">·</span>
      <a
        href="https://andremov.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto transition-colors duration-200 hover:text-primary"
      >
        Built by Andrés Movilla
      </a>
    </footer>
  );
}
