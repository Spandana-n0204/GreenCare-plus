import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface InitiativeData {
  _id?: string;
  name: string;
  status: 'planned' | 'in-progress' | 'completed';
  impact: string;
  startDate?: string;
  completionDate?: string;
  hospitalId: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospitalId');
    
    if (!hospitalId) {
      return NextResponse.json({ error: 'Hospital ID is required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("greencare");
    
    const initiatives = await db.collection("sustainability_initiatives")
      .find({ hospitalId })
      .toArray();
    
    return NextResponse.json(initiatives);
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    return NextResponse.json({ error: 'Failed to fetch initiatives' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { data, hospitalId } = await request.json();
    
    if (!hospitalId) {
      return NextResponse.json({ error: 'Hospital ID is required' }, { status: 400 });
    }
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Data must be an array' }, { status: 400 });
    }
    
    // Validate each item has required fields
    const invalidItems = data.filter(item => !item.name || !item.status || !item.impact);
    if (invalidItems.length > 0) {
      return NextResponse.json({ 
        error: 'All initiatives must have name, status, and impact fields',
        invalidItems 
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("greencare");
    const collection = db.collection("sustainability_initiatives");
    
    // Process each initiative - update existing or create new
    const results = await Promise.all(data.map(async (item: InitiativeData) => {
      // Process item._id if it exists
      let processedItem = { ...item, hospitalId };
      
      if (item._id) {
        // This is an existing record - update it
        const id = item._id;
        delete processedItem._id; // Remove _id before update
        
        try {
          await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: processedItem }
          );
          return { success: true, id, operation: 'update' };
        } catch (error) {
          console.error(`Error updating initiative ${id}:`, error);
          return { success: false, id, operation: 'update', error };
        }
      } else {
        try {
          const { _id, ...rest } = item;
          const processedItem = { ...rest, hospitalId };
          const result = await collection.insertOne(processedItem);
          return { success: true, id: result.insertedId, operation: 'insert' };
        } catch (error) {
          console.error('Error inserting new initiative:', error);
          return { success: false, operation: 'insert', error };
        }
      }
    }));
    
    // Delete records that are no longer in the data array
    if (data.length > 0) {
      const currentIds = data
        .filter((item: InitiativeData) => item._id)
        .map((item: InitiativeData) => new ObjectId(item._id));
      
      // Only delete if we have existing IDs
      if (currentIds.length > 0) {
        await collection.deleteMany({
          hospitalId,
          _id: { $nin: currentIds }
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Initiatives updated successfully',
      results
    });
  } catch (error) {
    console.error('Error saving initiatives:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save initiatives'
    }, { status: 500 });
  }
}