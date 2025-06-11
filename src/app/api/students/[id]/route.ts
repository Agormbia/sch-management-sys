import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '@/services/studentService';
import { studentUpdateSchema } from '@/lib/validations';

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const student = await StudentService.getStudentById(params.id);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const formData = await request.formData();
    
    // Convert FormData to a regular object
    const studentData: any = {};
    formData.forEach((value, key) => {
      studentData[key] = value;
    });

    // Validate student data
    const validatedData = studentUpdateSchema.parse(studentData);
    
    const student = await StudentService.updateStudent(params.id, validatedData);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    console.error('Error updating student:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Student with this admission number already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await StudentService.deleteStudent(params.id);

    return NextResponse.json({
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
