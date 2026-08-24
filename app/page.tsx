'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const races = [
  { time: '9:30 AM', name: 'Runabout GP – Moto 1', status: 'Next', riders: 12 },
  { time: '10:00 AM', name: 'Ski GP – Moto 1', status: 'Upcoming', riders: 9 },
  { time: '10:30 AM', name: 'Runabout Stock – Moto 1', status: 'Upcoming', riders: 15 },
];

export default function Home() {
  const [notice,setNotice]=useState('Rider briefing • 9:00 AM • Race control tent');
  const [sent,setSent]=useState(false);
  const [permission,setPermission]=useState('default');
  const [message,setMessage]=useState('Enable notifications on this device to test race-day alerts.');

  useEffect(()=>{
    if('Notification' in window) setPermission(Notification.permission);
    if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
  },[]);

  async function enableNotifications(){
    if(!('Notification' in window)){setMessage('Notifications are not supported in this browser.');return;}
    const result=await Notification.requestPermission();
    setPermission(result);
    setMessage(result==='granted'?'Notifications enabled on this device.':'Notification permission was not enabled.');
  }

  async function sendTestNotification(){
    if(permission!=='granted'){setMessage('Enable notifications first.');return;}
    const registration=await navigator.serviceWorker.ready;
    await registration.showNotification('PWC Race Control',{body:notice,icon:'/icon.svg',badge:'/icon.svg',tag:'race-control-alert'});
    setSent(true);setMessage('Test notification sent to this device.');
  }

  return <main>
    <header className="topbar"><div><span className="mark">PWC</span><strong> RACE CONTROL</strong></div><span className="live">● LIVE</span></header>
    <section className="hero"><p className="eyebrow">RACE DAY</p><h1>Wellington Championship</h1><p>Petone Foreshore • Sunday 22 March</p></section>
    <section className="grid stats"><article><span>Riders</span><strong>36</strong></article><article><span>Classes</span><strong>6</strong></article><article><span>Races</span><strong>18</strong></article></section>
    <section className="panel alert notificationPanel"><div><p className="eyebrow">RIDER NOTIFICATION</p><input value={notice} onChange={e=>{setNotice(e.target.value);setSent(false)}}/><small className="notificationHelp">{message}</small></div><div className="notificationButtons">{permission!=='granted'&&<button className="secondary" onClick={enableNotifications}>Enable on this device</button>}<button onClick={sendTestNotification}>{sent?'✓ Test sent':'Send test notification'}</button></div></section>
    <section className="panel"><div className="sectionTitle"><div><p className="eyebrow">TODAY</p><h2>Race Schedule</h2></div><button className="secondary">Manage event</button></div><div className="raceList">{races.map((race,i)=><div className={i===0?'race active':'race'} key={race.name}><div className="time">{race.time}</div><div className="raceInfo"><strong>{race.name}</strong><span>{race.riders} riders</span></div><span className="pill">{race.status}</span><Link className="arrow" href="/scoring">›</Link></div>)}</div></section>
    <section className="grid actions"><Link className="actionCard" href="/scoring"><span>🏁</span><strong>Live Scoring</strong><small>Enter finishes & penalties</small></Link><button><span>👤</span><strong>Riders</strong><small>Entries & check-in</small></button><button><span>📣</span><strong>Notifications</strong><small>Briefings & race calls</small></button></section>
    <footer>Prototype • Race organiser view</footer>
  </main>;
}