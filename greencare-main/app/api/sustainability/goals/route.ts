import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospitalId');
    
    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID is required" }, 
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("greencare");
    
    const goals = await db.collection("sustainability_goals")
      .find({ hospitalId })
      .toArray();
    
    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { data, hospitalId } = await request.json();
    
    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID is required" }, 
        { status: 400 }
      );
    }
    
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Data must be an array" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("greencare");
    
    // First delete all existing data for this hospital
    await db.collection("sustainability_goals").deleteMany({ hospitalId });
    
    // Process the data - ensure numeric fields are stored as numbers
    const docs = data.map(item => ({ 
      name: item.name,
      target: Number(item.target),
      unit: item.unit,
      currentValue: item.currentValue !== undefined ? Number(item.currentValue) : undefined,
      hospitalId 
    }));
    
    // Only insert if there's data to insert
    let result = { acknowledged: true };
    if (docs.length > 0) {
      result = await db.collection("sustainability_goals").insertMany(docs);
    }
    
    return NextResponse.json({ 
      success: true,
      acknowledged: result.acknowledged,
      insertedCount: docs.length
    });
  } catch (error) {
    console.error("Error updating goals:", error);
    return NextResponse.json(
      { error: "Failed to update goals" },
      { status: 500 }
    );
  }
}