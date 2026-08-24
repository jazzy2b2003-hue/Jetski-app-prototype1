'use client';

import { useState } from 'react';

const races = [
  { time: '9:30 AM', name: 'Runabout GP – Moto 1', status: 'Next', riders: 12 },
  { time: '10:00 AM', name: 'Ski GP – Moto 1', status: 'Upcoming', riders: 9 },
  { time: '10:30 AM', name: 'Runabout Stock – Moto 1', status: 'Upcoming', riders: 15 },
];

export default function Home() {
  const [notice, setNotice] = useState('Rider briefing • 9:00 AM • Race control tent');
  const [sent, setSent] = useState(false);

  return (
    <main>
      <header className="topbar">
        <div><span className="mark">PWC</span><strong> RACE CONTROL</strong></div>
        <span className="live">● LIVE</span>
      </header>

      <section className="hero">
        <p className="eyebrow">RACE DAY</p>
        <h1>Wellington Championship</h1>
        <p>Petone Foreshore • Sunday 22 March</p>
      </section>

      <section className="grid stats">
        <article><span>Riders</span><strong>36</strong></article>
        <article><span>Classes</span><strong>6</strong></article>
        <article><span>Races</span><strong>18</strong></article>
      </section>

      <section className="panel alert">
        <div>
          <p className="eyebrow">RIDER NOTIFICATION</p>
          <input value={notice} onChange={(e) => { setNotice(e.target.value); setSent(false); }} />
        </div>
        <button onClick={() => setSent(true)}>{sent ? '✓ Sent to riders' : 'Send push notification'}</button>
      </section>

      <section className="panel">
        <div className="sectionTitle"><div><p className="eyebrow">TODAY</p><h2>Race Schedule</h2></div><button className="secondary">Manage event</button></div>
        <div className="raceList">
          {races.map((race, i) => (
            <div className={i === 0 ? 'race active' : 'race'} key={race.name}>
              <div className="time">{race.time}</div>
              <div className="raceInfo"><strong>{race.name}</strong><span>{race.riders} riders</span></div>
              <span className="pill">{race.status}</span>
              <button className="arrow">›</button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid actions">
        <button><span>🏁</span><strong>Live Scoring</strong><small>Enter finishes & penalties</small></button>
        <button><span>👤</span><strong>Riders</strong><small>Entries & check-in</small></button>
        <button><span>📣</span><strong>Notifications</strong><small>Briefings & race calls</small></button>
      </section>

      <footer>Prototype • Race organiser view</footer>
    </main>
  );
}
