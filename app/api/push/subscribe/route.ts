import { NextResponse } from 'next/server';

export async function POST(req:Request){
  const body=await req.json();
  const {subscription,riderName,category='all'}=body;
  if(!subscription?.endpoint||!subscription?.keys?.p256dh||!subscription?.keys?.auth){return NextResponse.json({error:'Invalid subscription'},{status:400});}
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({error:'Push backend is not configured'},{status:503});
  const response=await fetch(`${url}/rest/v1/rider_notification_subscriptions?on_conflict=endpoint`,{
    method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},
    body:JSON.stringify({endpoint:subscription.endpoint,p256dh:subscription.keys.p256dh,auth:subscription.keys.auth,rider_name:riderName||null,category,updated_at:new Date().toISOString()})
  });
  if(!response.ok)return NextResponse.json({error:'Could not save subscription'},{status:500});
  return NextResponse.json({ok:true});
}
