import { NextRequest, NextResponse } from 'next/server';
import { TeacherService } from '@/services/teacherService';

interface Props {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { subjectIds } = await request.json();
    
    if (!Array.isArray(subjectIds)) {
      return NextResponse.json(
        { error: 'Subject IDs must be an array' },
        { status: 400 }
      );
    }

    // Process each subject ID individually
    for (const subjectId of subjectIds) {
      await TeacherService.assignSubjectToTeacher(params.id, subjectId);
    }

    return NextResponse.json({
      message: 'Subjects assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning subjects:', error);
    return NextResponse.json(
      { error: 'Failed to assign subjects' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { subjectIds } = await request.json();
    
    if (!Array.isArray(subjectIds)) {
      return NextResponse.json(
        { error: 'Subject IDs must be an array' },
        { status: 400 }
      );
    }

    // Process each subject ID individually
    for (const subjectId of subjectIds) {
      await TeacherService.removeSubjectFromTeacher(params.id, subjectId);
    }

    return NextResponse.json({
      message: 'Subjects removed successfully'
    });
  } catch (error) {
    console.error('Error removing subjects:', error);
    return NextResponse.json(
      { error: 'Failed to remove subjects' },
      { status: 500 }
    );
  }
}
