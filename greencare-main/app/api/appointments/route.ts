// app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    
    const appointments = await db.collection("appointments").aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]).toArray();
    
    return NextResponse.json(appointments.map(item => ({
      department: item._id,
      count: item.count
    })));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch appointments data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    
    await db.collection("appointments").deleteMany({});
    await db.collection("appointments").insertMany(body);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update appointments data' }, { status: 500 });
  }
}