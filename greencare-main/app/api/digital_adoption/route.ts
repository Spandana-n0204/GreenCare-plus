// app/api/digital_adoption/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const digitalAdoption = await db.collection("digital_adoption").find().toArray();
    
    return NextResponse.json(digitalAdoption.length ? digitalAdoption : [
      { category: "Patient Records", percentage: 85 },
      { category: "Prescriptions", percentage: 70 },
      { category: "Appointments", percentage: 90 },
      { category: "Billing", percentage: 60 }
    ]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch digital adoption data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    
    await db.collection("digital_adoption").deleteMany({});
    await db.collection("digital_adoption").insertMany(body);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update digital adoption data' }, { status: 500 });
  }
}