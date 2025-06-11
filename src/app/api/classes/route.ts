import { NextRequest, NextResponse } from 'next/server';
import { ClassService } from '@/services/classService';
import { classCreateSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const level = searchParams.get('level') || undefined;
    const academicYear = searchParams.get('academicYear') || undefined;
    const sortBy = searchParams.get('sortBy') as 'name' | 'level' | 'createdAt' || 'name';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';

    const classes = await ClassService.getAllClasses({
      search,
      level,
      academicYear,
      sortBy,
      sortOrder
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate class data
    const validatedData = classCreateSchema.parse(body);
    
    const classRoom = await ClassService.createClass(validatedData);

    return NextResponse.json({
      message: 'Class created successfully',
      class: classRoom
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Class name already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}
