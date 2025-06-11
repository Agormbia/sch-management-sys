import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '@/services/studentService';
import { studentCreateSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const classFilter = searchParams.get('class') || undefined;
    const academicYear = searchParams.get('academicYear') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const result = await StudentService.getAllStudents({
      search,
      class: classFilter,
      academicYear,
      limit,
      offset
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Convert FormData to a regular object
    const studentData: any = {};
    formData.forEach((value, key) => {
      studentData[key] = value;
    });

    // Validate student data
    const validatedData = studentCreateSchema.parse(studentData);
    
    const student = await StudentService.createStudent(validatedData);

    return NextResponse.json({
      message: 'Student created successfully',
      student
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Student with this admission number already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
