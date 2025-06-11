import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '@/services/studentService';
import { TeacherService } from '@/services/teacherService';
import { ClassService } from '@/services/classService';
import { SubjectService } from '@/services/subjectService';

export async function GET(request: NextRequest) {
  try {
    // Get counts for dashboard
    const [studentStats, teacherStats, classStats, subjectStats] = await Promise.all([
      StudentService.getStudentStats(),
      TeacherService.getTeacherStats(),
      ClassService.getClassStats(),
      SubjectService.getSubjectStats()
    ]);

    // Get recent activities
    const recentStudents = await StudentService.getAllStudents({
      limit: 5,
      offset: 0 // Using offset instead of page
    });

    const recentTeachers = await TeacherService.getAllTeachers({
      limit: 5,
      offset: 0 // Using offset instead of page
    });

    return NextResponse.json({
      stats: {
        students: studentStats,
        teachers: teacherStats,
        classes: classStats,
        subjects: subjectStats
      },
      recentActivities: {
        students: recentStudents.students,
        teachers: recentTeachers.teachers
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
