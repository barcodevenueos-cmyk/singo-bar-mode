import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Music2 } from 'lucide-react';

const experiences = [
  {
    id: 'music-bingo',
    title: 'Music Bingo',
    description: 'Host a live bingo session with player cards, called numbers and progressive wins.',
    status: 'Active',
    icon: Music2,
    active: true,
  },
  {
    id: 'coming-soon-two',
    title: 'New experience',
    description: 'Another entertainment option for your venue is in development.',
    status: 'Coming soon',
    icon: LockKeyhole,
    active: false,
  },
  {
    id: 'coming-soon-three',
    title: 'New experience',
    description: 'More ways to bring guests together will be available in a future release.',
    status: 'Coming soon',
    icon: LockKeyhole,
    active: false,
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="venue-shell">
      <header className="venue-header">
        <a className="venue-brand" href="/" aria-label="Venue OS home">
          <span className="venue-brand-mark" aria-hidden="true">V</span>
          <span>VENUE <strong>OS</strong></span>
        </a>
        <nav className="venue-nav" aria-label="Main navigation">
          <span className="venue-nav-current" aria-current="page">Entertainment</span>
        </nav>
        <span className="workspace-label">Venue workspace</span>
      </header>

      <main className="venue-main">
        <section className="venue-intro" aria-labelledby="page-title">
          <p className="eyebrow">VENUE MANAGEMENT</p>
          <h1 id="page-title">Entertainment</h1>
          <p className="venue-intro-copy">Choose an experience to run at your venue.</p>
        </section>

        <section className="experience-grid" aria-label="Entertainment experiences">
          {experiences.map(({ id, title, description, status, icon: Icon, active }) => (
            <article
              key={id}
              className={`experience-card${active ? ' experience-card-active' : ''}`}
              data-testid={`experience-${id}`}
            >
              <div className="experience-card-top">
                <span className={`experience-icon${active ? ' experience-icon-active' : ''}`} aria-hidden="true">
                  <Icon size={21} strokeWidth={1.8} />
                </span>
                <span className={`experience-status${active ? ' status-active' : ' status-upcoming'}`}>
                  {active && <span className="status-dot" aria-hidden="true" />}
                  {status}
                </span>
              </div>
              <div className="experience-content">
                <h2>{active ? title : `${title} ${id === 'coming-soon-two' ? '02' : '03'}`}</h2>
                <p>{description}</p>
              </div>
              {active ? (
                <button
                  className="experience-action"
                  type="button"
                  onClick={() => navigate('/bar-mode')}
                  data-testid="open-music-bingo-btn"
                >
                  Open Music Bingo <ArrowRight size={17} aria-hidden="true" />
                </button>
              ) : (
                <div className="experience-unavailable" aria-label="Coming soon; not available yet">
                  Available in a future release
                </div>
              )}
            </article>
          ))}
        </section>

        <footer className="venue-footer">
          <span>VENUE OS</span>
          <span>Entertainment for hospitality</span>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
