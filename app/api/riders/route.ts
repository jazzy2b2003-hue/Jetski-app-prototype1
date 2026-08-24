import {NextResponse} from 'next/server';
export async function GET(req:Request){
 const supplied=req.headers.get('x-race-control-key');
 if(!process.env.RACE_CONTROL_KEY||supplied!==process.env.RACE_CONTROL_KEY)return NextResponse.json({error:'Invalid Race Control key.'},{status:401});
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return NextResponse.json({error:'Rider database is not configured.'},{status:500});
 const fields='id,first_name,last_name,race_number,licence_number,club,ski_make,ski_model,mobile,email,created_at';
 const r=await fetch(`${url}/rest/v1/riders?select=${fields}&order=created_at.desc`,{headers:{apikey:key,Authorization:`Bearer ${key}`},cache:'no-store'});
 const data=await r.json(); if(!r.ok)return NextResponse.json({error:'Could not load riders.'},{status:500});
 return NextResponse.json({riders:data,total:data.length});
}
