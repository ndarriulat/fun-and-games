import { Icon } from "./icons";

export function ComingSoonScreen({ title, goHome }: { title: string; goHome: () => void }) {
  return (
    <main className="coming-soon">
      <header className="play-top">
        <button type="button" className="icon-btn" aria-label="Home" onClick={goHome}>
          <Icon name="home" />
        </button>
      </header>
      <h1 className="coming-soon-title">{title}</h1>
      <p className="coming-soon-text">Coming soon.</p>
    </main>
  );
}
