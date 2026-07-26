export function Header() {
  return (
    <header className="atlas-grain relative z-10 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex flex-col">
          <h1
            className="font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight text-[var(--color-ocean-deep)] md:text-2xl"
          >
            Washington County Atlas
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] md:text-sm">
            Washington County, Maine
          </p>
        </div>
        <div className="text-xs text-[var(--color-text-secondary)]">
          Phase A scaffold
        </div>
      </div>
    </header>
  );
}
