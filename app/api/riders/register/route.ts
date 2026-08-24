import {NextResponse} from 'next/server';

export async function POST(req:Request){
 try{
  const body=await req.json();
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({error:'Rider database is not configured.'},{status:500});
  const payload={p_first_name:body.firstName,p_last_name:body.lastName,p_email:body.email,p_mobile:body.mobile,p_country:body.country,p_club:body.club||'',p_race_number:body.raceNumber,p_licence_number:body.licenceNumber||'',p_ski_make:body.skiMake||'',p_ski_model:body.skiModel||'',p_emergency_name:body.emergencyName,p_emergency_mobile:body.emergencyMobile};
  const r=await fetch(`${url}/rest/v1/rpc/register_rider`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(payload),cache:'no-store'});
  const text=await r.text();
  if(!r.ok)throw new Error(text||'Could not save rider.');
  return NextResponse.json({ok:true,id:text.replaceAll('"','')});
 }catch(e:any){return NextResponse.json({error:e.message||'Could not save rider.'},{status:500})}
}
