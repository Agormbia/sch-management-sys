import prisma from '@/lib/prisma'

export class ClassService {
  static async getAllClasses(filters?: {
    search?: string
    level?: string
    academicYear?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const { 
      search, 
      level, 
      academicYear, 
      page = 1, 
      limit = 50, 
      sortBy = 'name',
      sortOrder = 'asc'
    } = filters || {}

    const skip = (page - 1) * limit

    const where = {
      AND: [
        search ? {
          name: { contains: search, mode: 'insensitive' as const }
        } : {},
        level ? { level: level } : {},
        academicYear ? { academicYear: academicYear } : {},
      ]
    }

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip,
        include: {
          _count: {
            select: { students: true }
          },
          teachers: {
            include: {
              teacher: {
                select: { name: true, specialization: true }
              }
            }
          }
        }
      }),
      prisma.class.count({ where })
    ])

    return { classes, total }
  }

  static async getClassById(id: string) {
    return await prisma.class.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                admissionNumber: true,
                gender: true
              }
            }
          }
        },
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                specialization: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: { students: true }
        }
      }
    })
  }

  static async createClass(data: {
    name: string
    level: string
    academicYear: string
    capacity?: number
  }) {
    return await prisma.class.create({
      data
    })
  }

  static async updateClass(id: string, data: {
    name?: string
    level?: string
    academicYear?: string
    capacity?: number
  }) {
    return await prisma.class.update({
      where: { id },
      data
    })
  }

  static async deleteClass(id: string) {
    return await prisma.class.delete({
      where: { id }
    })
  }

  static async getClassStats() {
    const [total, byLevel, byAcademicYear, averageCapacity] = await Promise.all([
      prisma.class.count(),
      prisma.class.groupBy({
        by: ['level'],
        _count: true
      }),
      prisma.class.groupBy({
        by: ['academicYear'],
        _count: true
      }),
      prisma.class.aggregate({
        _avg: { capacity: true }
      })
    ])

    // Define interfaces for the stats
    interface LevelStat {
      level: string;
      count: number;
    }

    interface AcademicYearStat {
      year: string;
      count: number;
    }

    interface ClassStats {
      total: number;
      byLevel: LevelStat[];
      byAcademicYear: AcademicYearStat[];
      averageCapacity: number;
    }

    // Define interfaces for Prisma results
    interface LevelGroupResult {
      level: string;
      _count: number;
    }

    interface AcademicYearGroupResult {
      academicYear: string;
      _count: number;
    }

    interface CapacityAggregateResult {
      _avg: {
        capacity: number | null;
      };
    }

    return {
      total,
      byLevel: byLevel.map((item: LevelGroupResult) => ({
        level: item.level,
        count: item._count
      })),
      byAcademicYear: byAcademicYear.map((item: AcademicYearGroupResult) => ({
        year: item.academicYear,
        count: item._count
      })),
      averageCapacity: Math.round(averageCapacity._avg.capacity || 0)
    } as ClassStats;
  }

  static async addStudentToClass(classId: string, studentId: string) {
    return await prisma.classStudent.create({
      data: {
        classId,
        studentId
      }
    })
  }

  static async removeStudentFromClass(classId: string, studentId: string) {
    return await prisma.classStudent.deleteMany({
      where: {
        classId,
        studentId
      }
    })
  }

  static async assignTeacherToClass(classId: string, teacherId: string) {
    return await prisma.classTeacher.create({
      data: {
        classId,
        teacherId
      }
    })
  }

  static async removeTeacherFromClass(classId: string, teacherId: string) {
    return await prisma.classTeacher.deleteMany({
      where: {
        classId,
        teacherId
      }
    })
  }
}