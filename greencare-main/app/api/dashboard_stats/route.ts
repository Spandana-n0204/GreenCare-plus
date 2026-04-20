import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const stats = await db.collection("dashboard_stats").findOne({});
    
    return NextResponse.json(stats || {
      totalPatients: 0,
      newRegistrations: 0,
      appointmentsToday: 0,
      avgWaitTime: 0,
      waitTimeChange: 0,
      registrationChange: 0
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    
    await db.collection("dashboard_stats").updateOne(
      {},
      { $set: body },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update dashboard stats' }, { status: 500 });
  }
}