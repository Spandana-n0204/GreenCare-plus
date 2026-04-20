import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    
    const records = await db.collection("medical_records")
      .aggregate([
        {
          $lookup: {
            from: "patients",
            localField: "mrNo",
            foreignField: "mrNo",
            as: "patient"
          }
        },
        {
          $lookup: {
            from: "doctors",
            localField: "filledBy",
            foreignField: "_id",
            as: "doctor"
          }
        },
        {
          $unwind: "$patient"
        },
        {
          $unwind: "$doctor"
        }
      ]).toArray();

    return NextResponse.json(records);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("greencare");
    
    const result = await db.collection("medical_records").insertOne({
      ...body,
      date: new Date(body.date),
      filledBy: new ObjectId(body.filledBy)
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}