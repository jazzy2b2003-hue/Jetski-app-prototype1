'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Status = 'FINISHED' | 'DNF' | 'DNS' | 'DSQ';
type Rider = { id:number; number:string; name:string; position:number; penalty:number; status:Status };

const initial:Rider[] = [
 {id:1,number:'NZ 11',name:'Alex Morgan',position:1,penalty:0,status:'FINISHED'},
 {id:2,number:'NZ 27',name:'Taylor Reed',position:2,penalty:0,status:'FINISHED'},
 {id:3,number:'NZ 44',name:'Jordan King',position:3,penalty:0,status:'FINISHED'},
 {id:4,number:'NZ 72',name:'Casey Walker',position:4,penalty:0,status:'FINISHED'},
 {id:5,number:'NZ 91',name:'Sam Parker',position:5,penalty:0,status:'FINISHED'},
];

const points = [25,22,20,18,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];

export default function ScoringPage(){
 const [riders,setRiders]=useState(initial);
 const [saved,setSaved]=useState(false);
 const update=(id:number, patch:Partial<Rider>)=>{setRiders(r=>r.map(x=>x.id===id?{...x,...patch}:x));setSaved(false)};
 const results=useMemo(()=>[...riders].sort((a,b)=>{
   const rank=(s:Status)=>s==='FINISHED'?0:s==='DNF'?1:s==='DNS'?2:3;
   return rank(a.status)-rank(b.status) || a.position-b.position;
 }),[riders]);
 const score=(r:Rider)=>r.status==='FINISHED'?Math.max(0,(points[r.position-1]??0)-r.penalty):0;
 return <main>
   <header className="topbar"><Link className="back" href="/">‹ Race Control</Link><span className="live">● LIVE SCORING</span></header>
   <section className="hero scoringHero"><p className="eyebrow">WELLINGTON CHAMPIONSHIP</p><h1>Live Scoring</h1><p>Runabout GP • Moto 1 • 12 riders entered</p></section>
   <section className="panel scorePanel">
    <div className="sectionTitle"><div><p className="eyebrow">OFFICIAL ENTRY</p><h2>Finish order</h2></div><div className="scoreActions"><button className="secondary" onClick={()=>setRiders(initial)}>Reset</button><button onClick={()=>setSaved(true)}>{saved?'✓ Results saved':'Save provisional results'}</button></div></div>
    <div className="scoreTable">
     <div className="scoreRow scoreHead"><span>Pos</span><span>Rider</span><span>Status</span><span>Penalty</span><span>Points</span></div>
     {riders.map(r=><div className="scoreRow" key={r.id}>
       <input aria-label={`Position for ${r.name}`} type="number" min="1" max="30" value={r.position} onChange={e=>update(r.id,{position:Number(e.target.value)})}/>
       <div className="rider"><b>{r.number}</b><span>{r.name}</span></div>
       <select value={r.status} onChange={e=>update(r.id,{status:e.target.value as Status})}><option>FINISHED</option><option>DNF</option><option>DNS</option><option>DSQ</option></select>
       <input aria-label={`Penalty for ${r.name}`} type="number" min="0" value={r.penalty} onChange={e=>update(r.id,{penalty:Number(e.target.value)})}/>
       <strong>{score(r)}</strong>
     </div>)}
    </div>
   </section>
   <section className="panel"><p className="eyebrow">PROVISIONAL</p><h2>Calculated results</h2><div className="resultsList">{results.map((r,i)=><div key={r.id}><strong>{i+1}</strong><span><b>{r.number}</b> {r.name}</span><span className={`status ${r.status.toLowerCase()}`}>{r.status}</span><b>{score(r)} pts</b></div>)}</div><p className="fineprint">Provisional results remain editable until an official publishes/finalises the race.</p></section>
 </main>
}