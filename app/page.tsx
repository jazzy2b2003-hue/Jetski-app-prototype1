'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const races = [
  { time: '9:30 AM', name: 'Runabout GP – Moto 1', status: 'Next', riders: 12 },
  { time: '10:00 AM', name: 'Ski GP – Moto 1', status: 'Upcoming', riders: 9 },
  { time: '10:30 AM', name: 'Runabout Stock – Moto 1', status: 'Upcoming', riders: 15 },
];

function urlBase64ToUint8Array(base64String:string){
  const padding='='.repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
  const rawData=window.atob(base64);
  return Uint8Array.from([...rawData].map(char=>char.charCodeAt(0)));
}

export default function Home() {
  const [notice,setNotice]=useState('Rider briefing • 9:00 AM • Race control tent');
  const [permission,setPermission]=useState('default');
  const [message,setMessage]=useState('Register this device to receive race-day alerts.');
  const [registered,setRegistered]=useState(false);
  const [adminKey,setAdminKey]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    if('Notification' in window) setPermission(Notification.permission);
    if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
  },[]);

  async function registerForAlerts(){
    setBusy(true);
    try{
      if(!('Notification' in window)||!('serviceWorker' in navigator)){throw new Error('Notifications are not supported in this browser.');}
      const result=await Notification.requestPermission();
      setPermission(result);
      if(result!=='granted')throw new Error('Notification permission was not enabled.');
      const publicKey=process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if(!publicKey)throw new Error('Push notifications are not configured yet.');
      const registration=await navigator.serviceWorker.ready;
      let subscription=await registration.pushManager.getSubscription();
      if(!subscription)subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(publicKey)});
      const response=await fetch('/api/push/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscription:subscription.toJSON(),category:'all'})});
      if(!response.ok)throw new Error((await response.json()).error||'Could not register this device.');
      setRegistered(true);setMessage('✓ This device is registered for live race alerts.');
    }catch(error:any){setMessage(error.message||'Could not register this device.');}
    finally{setBusy(false);}
  }

  async function sendBroadcast(){
    if(!adminKey){setMessage('Enter the Race Control key before sending a broadcast.');return;}
    setBusy(true);
    try{
      const response=await fetch('/api/push/send',{method:'POST',headers:{'Content-Type':'application/json','x-race-control-key':adminKey},body:JSON.stringify({message:notice,category:'all'})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Broadcast failed.');
      setMessage(`✓ Broadcast sent to ${data.delivered} of ${data.total} registered devices.`);
    }catch(error:any){setMessage(error.message||'Broadcast failed.');}
    finally{setBusy(false);}
  }

  return <main>
    <header className="topbar"><div><span className="mark">PWC</span><strong> RACE CONTROL</strong></div><span className="live">● LIVE</span></header>
    <section className="hero"><p className="eyebrow">RACE DAY</p><h1>Wellington Championship</h1><p>Petone Foreshore • Sunday 22 March</p></section>
    <section className="grid stats"><article><span>Riders</span><strong>36</strong></article><article><span>Classes</span><strong>6</strong></article><article><span>Races</span><strong>18</strong></article></section>
    <section className="panel alert notificationPanel"><div><p className="eyebrow">RIDER NOTIFICATION</p><input value={notice} onChange={e=>setNotice(e.target.value)}/><small className="notificationHelp">{message}</small></div><div className="notificationButtons"><button className="secondary" disabled={busy||registered} onClick={registerForAlerts}>{registered?'✓ Device registered':busy?'Working…':'Register this device'}</button><input aria-label="Race Control key" type="password" placeholder="Race Control key" value={adminKey} onChange={e=>setAdminKey(e.target.value)}/><button disabled={busy} onClick={sendBroadcast}>{busy?'Working…':'Send push notification'}</button></div></section>
    <section className="panel"><div className="sectionTitle"><div><p className="eyebrow">TODAY</p><h2>Race Schedule</h2></div><button className="secondary">Manage event</button></div><div className="raceList">{races.map((race,i)=><div className={i===0?'race active':'race'} key={race.name}><div className="time">{race.time}</div><div className="raceInfo"><strong>{race.name}</strong><span>{race.riders} riders</span></div><span className="pill">{race.status}</span><Link className="arrow" href="/scoring">›</Link></div>)}</div></section>
    <section className="grid actions"><Link className="actionCard" href="/scoring"><span>🏁</span><strong>Live Scoring</strong><small>Enter finishes & penalties</small></Link><button><span>👤</span><strong>Riders</strong><small>Entries & check-in</small></button><button><span>📣</span><strong>Notifications</strong><small>Briefings & race calls</small></button></section>
    <footer>Prototype • Race organiser view</footer>
  </main>;
}