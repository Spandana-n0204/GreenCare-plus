import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all doctors with optional filtering
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
    const speciality = searchParams.get('speciality');
    const active = searchParams.get('active');

    let query: any = { hospitalId };

    // Add filters if provided
    if (speciality) {
      query.specialists = speciality; // Changed from speciality to specialists to match your interface
    }

    if (active === 'true') {
      query.active = true;
    } else if (active === 'false') {
      query.active = false;
    }

    const doctors = await db.collection("doctors")
      .find(query)
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(doctors);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

// POST - Create new doctor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    const hospitalId = request.headers.get('x-hospital-id');
    
    if (!hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add hospitalId and timestamps to the doctor record
    const doctorData = {
      ...body,
      hospitalId,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true, // Default to active
      burnoutMetrics: {
        workloadLevel: body.burnoutMetrics?.workloadLevel || 0,
        stressIndicators: body.burnoutMetrics?.stressIndicators || 0,
        lastAssessmentDate: body.burnoutMetrics?.lastAssessmentDate || new Date()
      }
    };

    // Validate required fields
    if (!doctorData.name || !doctorData.employeeId) {
      return NextResponse.json(
        { error: 'Name and employee ID are required fields' },
        { status: 400 }
      );
    }

    const result = await db.collection("doctors").insertOne(doctorData);
    return NextResponse.json({
      success: true,
      _id: result.insertedId
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}