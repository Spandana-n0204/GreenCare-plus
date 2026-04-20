import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Patient {
  mrNo: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  hospitalId: string;
  createdAt: Date;
  notes?: string;
  registrations: ObjectId[];
  status: string;
}

// GET all patients
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const hospitalId = request.headers.get('x-hospital-id');
    if (!hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    
    const patients = await db.collection("patients")
      .find({ hospitalId })
      .toArray();
    
    return NextResponse.json(patients);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

// POST a new patient
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    const hospitalId = request.headers.get('x-hospital-id');
    if (!hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    
    const mrNo = `MR${Date.now().toString().slice(-8)}`;
    
    // Create the patient record
    const patientData: Patient = {
      mrNo,
      name: body.name,
      gender: body.gender,
      age: parseInt(body.age),
      notes: body.notes,
      registrations: [], 
      status: 'Active',
      hospitalId, 
      createdAt: new Date()
    };
    
    const result = await db.collection("patients").insertOne(patientData);
    
    if (body.createRegistration) {
      const registrationData = {
        mrNo,
        name: body.name,
        gender: body.gender,
        age: parseInt(body.age),
        notes: body.notes,
        registrationDate: new Date(),
        hospitalId,
        waitingTime: 0
      };
      
      const registrationResult = await db.collection("registrations").insertOne(registrationData);
      
      // Update patient with registration ID
      await db.collection("patients").updateOne(
        { _id: result.insertedId },
        { $push: { registrations: registrationResult.insertedId.toString() as unknown as never } }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      mrNo,
      _id: result.insertedId 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}