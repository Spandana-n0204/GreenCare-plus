// app/api/sustainability/monthly/route.ts
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
    
    const monthlyData = await db.collection("sustainability_monthly")
      .find({ hospitalId })
      .toArray();
    
    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly data" }, 
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
    await db.collection("sustainability_monthly").deleteMany({ hospitalId });
    
    // Process the data - ensure all numeric fields are stored as numbers
    const docs = data.map(item => ({ 
      month: item.month,
      paperSaved: Number(item.paperSaved),
      carbonReduction: Number(item.carbonReduction),
      energyUsage: Number(item.energyUsage),
      hospitalId 
    }));
    
    // Only insert if there's data to insert
    let result = { acknowledged: true };
    if (docs.length > 0) {
      result = await db.collection("sustainability_monthly").insertMany(docs);
    }
    
    return NextResponse.json({ 
      success: true,
      acknowledged: result.acknowledged,
      insertedCount: docs.length
    });
  } catch (error) {
    console.error("Error updating monthly data:", error);
    return NextResponse.json(
      { error: "Failed to update monthly data" },
      { status: 500 }
    );
  }
}