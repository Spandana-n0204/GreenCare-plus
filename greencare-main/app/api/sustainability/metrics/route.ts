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
    
    const metrics = await db.collection("sustainability_metrics").findOne({ hospitalId });
    
    return NextResponse.json(metrics || {
      paperSaved: 0,
      carbonReduction: 0,
      digitalAdoption: 0,
      energyEfficiency: 0
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { hospitalId, paperSaved, carbonReduction, digitalAdoption, energyEfficiency } = data;
    
    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID is required" }, 
        { status: 400 }
      );
    }
    
    // Extract only the fields we want to update
    const updateData = {
      hospitalId,
      paperSaved: Number(paperSaved),
      carbonReduction: Number(carbonReduction),
      digitalAdoption: Number(digitalAdoption),
      energyEfficiency: Number(energyEfficiency)
    };
    
    const client = await clientPromise;
    const db = client.db("greencare");
    
    const result = await db.collection("sustainability_metrics").updateOne(
      { hospitalId },
      { $set: updateData },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true,
      acknowledged: result.acknowledged,
      upsertedId: result.upsertedId,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error updating metrics:", error);
    return NextResponse.json(
      { error: "Failed to update metrics" },
      { status: 500 }
    );
  }
}