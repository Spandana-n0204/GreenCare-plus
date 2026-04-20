import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET doctor by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const hospitalId = request.headers.get('x-hospital-id');
    if (!hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }     
    let query: any = { hospitalId };
    
    // If ID is provided, find that specific doctor
    if (params.id && params.id !== 'all') {
      // Check if the ID is a valid ObjectId
      if (ObjectId.isValid(params.id)) {
        query._id = new ObjectId(params.id);
      } else {
        return NextResponse.json({ error: 'Invalid doctor ID' }, { status: 400 });
      }
    }
    
    const doctor = await db.collection("doctors").findOne(query);
    
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    
    return NextResponse.json(doctor);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

// UPDATE doctor
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    
    // Ensure the ID is valid
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid doctor ID' }, { status: 400 });
    }
    const hospitalId = request.headers.get('x-hospital-id');
    if (!hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    
    // Prevent changing the hospitalId
    delete body.hospitalId;
    
    // Update the doctor record
    const result = await db.collection("doctors").updateOne(
      { _id: new ObjectId(params.id), hospitalId },
      { $set: { ...body, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Doctor not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

// DELETE doctor
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    const hospitalId = request.headers.get('x-hospital-id');
    if (!hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    // Ensure the ID is valid
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid doctor ID' }, { status: 400 });
    }

    // Delete the doctor record
    const result = await db.collection("doctors").deleteOne({
      _id: new ObjectId(params.id),
      hospitalId
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Doctor not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
