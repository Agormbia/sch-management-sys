import prisma from '@/lib/prisma'
import { StudentCreateInput, StudentUpdateInput } from '@/lib/validations'

export class StudentService {
  static async getAllStudents(filters?: {
    search?: string
    class?: string
    academicYear?: string
    limit?: number
    offset?: number
  }) {
    const { search, class: classFilter, academicYear, limit = 50, offset = 0 } = filters || {}

    const where = {
      AND: [
        search ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' as const } },
            { admissionNumber: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {},
        classFilter ? { classAdmittedInto: classFilter } : {},
        academicYear ? { academicYear: academicYear } : {},
      ]
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          reports: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }),
      prisma.student.count({ where })
    ])

    return { students, total }
  }

  static async getStudentById(id: string) {
    return await prisma.student.findUnique({
      where: { id },
      include: {
        reports: {
          include: {
            subjects: {
              include: {
                subject: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        classes: {
          include: {
            class: true
          }
        }
      }
    })
  }

  static async createStudent(data: StudentCreateInput) {
    const studentData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      admissionDate: new Date(data.admissionDate),
    }

    return await prisma.student.create({
      data: studentData
    })
  }

  static async updateStudent(id: string, data: StudentUpdateInput) {
    const updateData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      admissionDate: data.admissionDate ? new Date(data.admissionDate) : undefined,
    }

    return await prisma.student.update({
      where: { id },
      data: updateData
    })
  }

  static async deleteStudent(id: string) {
    return await prisma.student.delete({
      where: { id }
    })
  }  static async getStudentStats() {
    const [total, byClass, byGender, recentAdmissions] = await Promise.all([
      prisma.student.count(),
      prisma.student.groupBy({
        by: ['classAdmittedInto'],
        _count: {
          classAdmittedInto: true
        },
        where: {
          classAdmittedInto: { not: "" }
        }
      }),
      prisma.student.groupBy({
        by: ['gender'],
        _count: {
          gender: true
        }
      }),      prisma.student.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ])    return {
      total,
      byClass: byClass.map((item: any) => ({
        class: item.classAdmittedInto,
        count: item._count.classAdmittedInto
      })),
      byGender: byGender.map((item: any) => ({
        gender: item.gender,
        count: item._count.gender
      })),
      recentAdmissions
    }
  }

  static async searchStudents(query: string) {
    return await prisma.student.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { admissionNumber: { contains: query, mode: 'insensitive' } },
          { primaryGuardianName: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 10,
      select: {
        id: true,
        fullName: true,
        admissionNumber: true,
        classAdmittedInto: true,
        studentPhoto: true
      }
    })
  }
}
