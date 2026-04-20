import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("greencare");
    
    // Find hospital by email
    const hospital = await db.collection("hospitals").findOne({ email });
    if (!hospital) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login
    await db.collection("hospitals").updateOne(
      { _id: hospital._id },
      {
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    // Track login for sustainability metrics
    await db.collection("sustainability_metrics").updateOne(
      { date: new Date().toISOString().split('T')[0] },
      {
        $inc: { digitalTransactions: 1 }
      },
      { upsert: true }
    );

    // Return hospital data (excluding password)
    const { password: _, ...hospitalData } = hospital;
    
    return NextResponse.json({
      success: true,
      hospital: hospitalData
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    );
  }
}