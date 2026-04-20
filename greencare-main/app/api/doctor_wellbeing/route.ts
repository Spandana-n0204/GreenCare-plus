// app/api/doctor_wellbeing/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const wellbeing = await db.collection("doctor_wellbeing").find().toArray();
    
    return NextResponse.json(wellbeing.length ? wellbeing : [
      { doctor: "Dr. Smith", workload: 30, stress: 25 },
      { doctor: "Dr. Johnson", workload: 65, stress: 60 },
      { doctor: "Dr. Williams", workload: 45, stress: 40 }
    ]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch doctor wellbeing data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    
    await db.collection("doctor_wellbeing").deleteMany({});
    await db.collection("doctor_wellbeing").insertMany(body);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update doctor wellbeing data' }, { status: 500 });
  }
}