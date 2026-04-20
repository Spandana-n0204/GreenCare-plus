// app/api/patient_flow/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const patientFlow = await db.collection("patient_flow").find().sort({ hour: 1 }).toArray();
    
    return NextResponse.json(patientFlow.length ? patientFlow : Array(24).fill(0).map((_, i) => ({
      hour: i,
      count: 0
    })));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch patient flow data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    
    await db.collection("patient_flow").deleteMany({});
    await db.collection("patient_flow").insertMany(body);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update patient flow data' }, { status: 500 });
  }
}