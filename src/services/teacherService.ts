import prisma from '@/lib/prisma'
import { TeacherCreateInput, TeacherUpdateInput } from '@/lib/validations'

export class TeacherService {
  static async getAllTeachers(filters?: {
    search?: string
    subject?: string
    limit?: number
    offset?: number
  }) {
    const { search, subject, limit = 50, offset = 0 } = filters || {}

    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { teacherId: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {},
        subject ? {
          subjects: {
            some: {
              subject: {
                name: { contains: subject, mode: 'insensitive' as const }
              }
            }
          }
        } : {},
      ]
    }

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          subjects: {
            include: {
              subject: true
            }
          },
          classes: {
            include: {
              class: true
            }
          }
        }
      }),
      prisma.teacher.count({ where })
    ])

    return { teachers, total }
  }

  static async getTeacherById(id: string) {
    return await prisma.teacher.findUnique({
      where: { id },
      include: {
        subjects: {
          include: {
            subject: true
          }
        },
        classes: {
          include: {
            class: true
          }
        }
      }
    })
  }

  static async createTeacher(data: TeacherCreateInput) {
    const teacherData = {
      ...data,
      employmentDate: data.employmentDate ? new Date(data.employmentDate) : null,
      experience: data.experience || 0,
    }

    return await prisma.teacher.create({
      data: teacherData
    })
  }

  static async updateTeacher(id: string, data: TeacherUpdateInput) {
    const updateData = {
      ...data,
      employmentDate: data.employmentDate ? new Date(data.employmentDate) : undefined,
    }

    return await prisma.teacher.update({
      where: { id },
      data: updateData
    })
  }

  static async deleteTeacher(id: string) {
    return await prisma.teacher.delete({
      where: { id }
    })
  }

  static async assignSubjectToTeacher(teacherId: string, subjectId: string) {
    return await prisma.teacherSubject.create({
      data: {
        teacherId,
        subjectId
      }
    })
  }

  static async removeSubjectFromTeacher(teacherId: string, subjectId: string) {
    return await prisma.teacherSubject.delete({
      where: {
        teacherId_subjectId: {
          teacherId,
          subjectId
        }
      }
    })
  }

  static async assignClassToTeacher(teacherId: string, classId: string) {
    return await prisma.teacherClass.create({
      data: {
        teacherId,
        classId
      }
    })
  }

  static async removeClassFromTeacher(teacherId: string, classId: string) {
    return await prisma.teacherClass.delete({
      where: {
        teacherId_classId: {
          teacherId,
          classId
        }
      }
    })
  }

  static async getTeacherStats() {
    const [total, byQualification, byExperience, recentHires] = await Promise.all([
      prisma.teacher.count(),
      prisma.teacher.groupBy({
        by: ['qualification'],
        _count: true,
        where: { qualification: { not: null } }
      }),
      prisma.teacher.aggregate({
        _avg: { experience: true },
        _max: { experience: true },
        _min: { experience: true }
      }),
      prisma.teacher.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ])

    interface QualificationStat {
        qualification: string | null;
        count: number;
    }

    interface ExperienceStats {
        _avg: { experience: number | null };
        _max: { experience: number | null };
        _min: { experience: number | null };
    }

    interface TeacherStats {
        total: number;
        byQualification: QualificationStat[];
        experienceStats: ExperienceStats;
        recentHires: number;
    }

            return {
                total,
                byQualification: byQualification.map((item: { qualification: string | null; _count: number }) => ({
                    qualification: item.qualification,
                    count: item._count
                })) as QualificationStat[],
                experienceStats: byExperience as ExperienceStats,
                recentHires
            } as TeacherStats;
  }

  static async searchTeachers(query: string) {
    return await prisma.teacher.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { teacherId: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 10,
      select: {
        id: true,
        name: true,
        teacherId: true,
        email: true,
        photo: true
      }
    })
  }
}
