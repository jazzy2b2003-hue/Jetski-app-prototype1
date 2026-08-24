import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';

function normalizeEventDate(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const input = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

  // Event labels are displayed like "Sunday 22 March". Convert them to
  // PostgreSQL's YYYY-MM-DD format while keeping the friendly UI text.
  const withoutWeekday = input.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+/i, '');
  const match = withoutWeekday.match(/^(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?$/);
  if (!match) throw new Error('Invalid event date.');

  const [, dayText, monthText, suppliedYear] = match;
  const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const month = monthNames.indexOf(monthText.toLowerCase());
  if (month < 0) throw new Error('Invalid event date.');

  const day = Number(dayText);
  const now = new Date();
  let year = suppliedYear ? Number(suppliedYear) : now.getFullYear();

  // If no year is shown, choose the next occurrence of that calendar date.
  if (!suppliedYear) {
    const candidate = new Date(year, month, day);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (candidate < today) year += 1;
  }

  return `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

export async function POST(req:Request){try{const b=await req.json();if(!b.email||!b.classes?.length)return NextResponse.json({error:'Rider and class selection are required.'},{status:400});const url=process.env.SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw Error('Supabase is not configured.');const db=createClient(url,key);const row={event_name:b.event,event_date:normalizeEventDate(b.eventDate),venue:b.venue,rider_id:b.riderId||null,email:b.email,first_name:b.firstName,last_name:b.lastName,race_number:b.raceNumber,ski_make:b.skiMake||null,ski_model:b.skiModel||null,classes:b.classes,declaration_accepted:!!b.declaration,status:'entered'};const {data,error}=await db.from('event_entries').insert(row).select('id').single();if(error){if(error.code==='42P01')return NextResponse.json({error:'Event entry database needs its one-time setup.'},{status:503});throw error}return NextResponse.json({ok:true,id:data.id})}catch(e:any){return NextResponse.json({error:e.message||'Entry failed.'},{status:500})}}