import { prisma } from '@/lib/prisma';
import { CreateSubjectInput, UpdateSubjectInput } from '@/lib/validations';

export class SubjectService {
  static async getAllSubjects(filters?: {
    search?: string;
    sortBy?: 'name' | 'code' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = filters || {};

    return await prisma.subject.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      include: {
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                teacherId: true
              }
            }
          }
        },
        _count: {
          select: {
            teachers: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    });
  }

  static async getSubjectById(id: string) {
    return await prisma.subject.findUnique({
      where: { id },
      include: {
        teachers: {
          include: {
            teacher: true
          }
        }
      }
    });
  }

  static async createSubject(data: CreateSubjectInput) {
    return await prisma.subject.create({
      data,
      include: {
        teachers: true
      }
    });
  }

  static async updateSubject(id: string, data: UpdateSubjectInput) {
    return await prisma.subject.update({
      where: { id },
      data,
      include: {
        teachers: true
      }
    });
  }

  static async deleteSubject(id: string) {
    // First, remove all teacher associations
    await prisma.teacherSubject.deleteMany({
      where: { subjectId: id }
    });

    return await prisma.subject.delete({
      where: { id }
    });
  }

  static async assignTeacherToSubject(subjectId: string, teacherId: string) {
    return await prisma.teacherSubject.create({
      data: {
        subjectId,
        teacherId
      }
    });
  }

  static async removeTeacherFromSubject(subjectId: string, teacherId: string) {
    return await prisma.teacherSubject.delete({
      where: {
        teacherId_subjectId: {
          teacherId,
          subjectId
        }
      }
    });
  }

  static async getSubjectStats() {
    const totalSubjects = await prisma.subject.count();
    
    const subjectsWithTeachers = await prisma.subject.findMany({
      include: {
        _count: {
          select: {
            teachers: true
          }
        }
      }
    });

    interface SubjectWithTeacherCount {
      _count: {
        teachers: number;
      };
    }

    const averageTeachersPerSubject: number = subjectsWithTeachers.length > 0
      ? subjectsWithTeachers.reduce((sum: number, subject: SubjectWithTeacherCount) => sum + subject._count.teachers, 0) / subjectsWithTeachers.length
      : 0;

    return {
      totalSubjects,
      averageTeachersPerSubject: Math.round(averageTeachersPerSubject * 100) / 100
    };
  }
}
