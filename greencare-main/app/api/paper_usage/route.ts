// app/api/paper_usage/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const paperUsage = await db.collection("paper_usage").find().toArray();
    
    return NextResponse.json(paperUsage.length ? paperUsage : [
      { category: "Medical Records", percentage: 65 },
      { category: "Prescriptions", percentage: 20 },
      { category: "Administrative", percentage: 15 }
    ]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch paper usage data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    
    await db.collection("paper_usage").deleteMany({});
    await db.collection("paper_usage").insertMany(body);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update paper usage data' }, { status: 500 });
  }
}