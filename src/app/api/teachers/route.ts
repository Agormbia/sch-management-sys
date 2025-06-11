import { NextRequest, NextResponse } from 'next/server';
import { TeacherService } from '@/services/teacherService';
import { teacherCreateSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const subject = searchParams.get('subject') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const result = await TeacherService.getAllTeachers({
      search,
      subject,
      limit,
      offset
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate teacher data
    const validatedData = teacherCreateSchema.parse(body);
    
    const teacher = await TeacherService.createTeacher(validatedData);

    return NextResponse.json({
      message: 'Teacher created successfully',
      teacher
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Teacher ID already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    );
  }
}
