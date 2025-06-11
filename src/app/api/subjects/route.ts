import { NextRequest, NextResponse } from 'next/server';
import { SubjectService } from '@/services/subjectService';
import { subjectCreateSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') as 'name' | 'code' | 'createdAt' || 'name';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';

    const subjects = await SubjectService.getAllSubjects({
      search,
      sortBy,
      sortOrder
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
      // Validate subject data
    const validatedData = subjectCreateSchema.parse(body);
    
    const subject = await SubjectService.createSubject(validatedData);

    return NextResponse.json({
      message: 'Subject created successfully',
      subject
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Subject code already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}
