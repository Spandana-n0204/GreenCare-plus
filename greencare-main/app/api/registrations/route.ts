import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Registration {
  mrNo: string;
  name: string;
  gender?: string;
  age?: number;
  notes?: string;
  registrationDate: Date;
  qrCode?: string;
  hospitalId: string;
  waitingTime?: number;
}

// GET all registrations
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const hospitalId = request.headers.get('x-hospital-id');
    if (!hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 

    
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    
    let query: any = { hospitalId };
    
    // If date parameter is provided, filter by registrationDate
    if (dateStr) {
      const date = new Date(dateStr);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      query.registrationDate = {
        $gte: date,
        $lt: nextDay
      };
    }
    
    const registrations = await db.collection("registrations")
      .find(query)
      .sort({ registrationDate: -1 })
      .toArray();
    
    return NextResponse.json(registrations);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

// POST a new registration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    const hospitalId = request.headers.get('x-hospital-id');
    if (!hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    // Generate QR code (in a real app, you'd use a proper QR code library)
    const qrCode = `QR${Date.now().toString(36).toUpperCase()}`;
    
    // Create the registration record
    const registrationData: Registration = {
      mrNo: body.mrNo,
      name: body.name,
      gender: body.gender,
      age: body.age,
      notes: body.notes,
      registrationDate: new Date(),
      qrCode,
      waitingTime: 0,
      hospitalId:hospitalId,
    };
    
    const registrationResult = await db.collection("registrations").insertOne(registrationData);
    // Update patient's registrations array
    if (body.mrNo) {

      await db.collection("patients").updateOne(
        { mrNo: body.mrNo },
        { $push: { registrations: registrationResult.insertedId.toString() as unknown as never } }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      _id: registrationResult.insertedId,
      qrCode 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 });
  }
}