import { NextResponse } from 'next/server';
import webpush from 'web-push';

export async function POST(req:Request){
 const {message,category='all'}=await req.json();
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 const publicKey=process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,privateKey=process.env.VAPID_PRIVATE_KEY;
 const adminKey=process.env.RACE_CONTROL_KEY;
 if(!url||!key||!publicKey||!privateKey||!adminKey)return NextResponse.json({error:'Push backend is not configured'},{status:503});
 if(req.headers.get('x-race-control-key')!==adminKey)return NextResponse.json({error:'Unauthorised'},{status:401});
 webpush.setVapidDetails('mailto:racecontrol@example.com',publicKey,privateKey);
 const filter=category==='all'?'':`&category=eq.${encodeURIComponent(category)}`;
 const response=await fetch(`${url}/rest/v1/rider_notification_subscriptions?select=id,endpoint,p256dh,auth${filter}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
 if(!response.ok)return NextResponse.json({error:'Could not load subscribers'},{status:500});
 const subscribers=await response.json();
 let delivered=0;
 await Promise.all(subscribers.map(async(s:any)=>{try{await webpush.sendNotification({endpoint:s.endpoint,keys:{p256dh:s.p256dh,auth:s.auth}},JSON.stringify({title:'PWC Race Control',body:message}));delivered++;}catch{}}));
 return NextResponse.json({ok:true,delivered,total:subscribers.length});
}
