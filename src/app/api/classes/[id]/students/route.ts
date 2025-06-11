import { NextRequest, NextResponse } from 'next/server';
import { ClassService } from '@/services/classService';

interface Props {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { studentIds } = await request.json();
    
    if (!Array.isArray(studentIds)) {
      return NextResponse.json(
        { error: 'Student IDs must be an array' },
        { status: 400 }
      );
    }

    for (const studentId of studentIds) {
      await ClassService.addStudentToClass(params.id, studentId);
    }

    return NextResponse.json({
      message: 'Students assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning students:', error);
    return NextResponse.json(
      { error: 'Failed to assign students' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { studentIds } = await request.json();
    
    if (!Array.isArray(studentIds)) {
      return NextResponse.json(
        { error: 'Student IDs must be an array' },
        { status: 400 }
      );
    }
    
    for (const studentId of studentIds) {
      await ClassService.removeStudentFromClass(params.id, studentId);
    }

    return NextResponse.json({
      message: 'Students removed successfully'
    });
  } catch (error) {
    console.error('Error removing students:', error);
    return NextResponse.json(
      { error: 'Failed to remove students' },
      { status: 500 }
    );
  }
}
