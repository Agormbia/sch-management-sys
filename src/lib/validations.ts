import { z } from 'zod'

// Student Validation Schema
export const studentCreateSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().optional().nullable(),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  hometown: z.string().optional(),
  homeAddress: z.string().min(5, "Home address is required"),
  gpsAddress: z.string().optional(),
  admissionNumber: z.string().min(1, "Admission number is required"),
  admissionDate: z.string(),
  academicYear: z.string().min(1, "Academic year is required"),
  classAdmittedInto: z.string().min(1, "Class is required"),
  term: z.string().min(1, "Term is required"),
  previousSchool: z.string().optional(),
  reasonForTransfer: z.string().optional(),
  
  // Guardian Information
  primaryGuardianName: z.string().min(2, "Primary guardian name is required"),
  primaryGuardianRelationship: z.string().min(1, "Relationship is required"),
  primaryGuardianPhone: z.string().min(10, "Valid phone number is required"),
  primaryGuardianEmail: z.string().email().optional().or(z.literal("")),
  primaryGuardianOccupation: z.string().optional(),
  primaryGuardianAddress: z.string().optional(),
  
  secondaryGuardianName: z.string().optional(),
  secondaryGuardianPhone: z.string().optional(),
  secondaryGuardianRelationship: z.string().optional(),
  secondaryGuardianOccupation: z.string().optional(),
  
  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactAltPhone: z.string().optional(),
  
  // Health Information
  bloodGroup: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  doctorContact: z.string().optional(),
  
  // Other Information
  languagesSpoken: z.string().optional(),
  preferredCommunication: z.string().optional(),
  remarks: z.string().optional(),
})

export const studentUpdateSchema = studentCreateSchema.partial()

// Teacher Validation Schema
export const teacherCreateSchema = z.object({
  teacherId: z.string().min(1, "Teacher ID is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  photo: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.number().optional(),
  specialization: z.string().optional(),
  employmentDate: z.string().optional(),
  salary: z.number().optional(),
  employmentType: z.string().optional(),
})

export const teacherUpdateSchema = teacherCreateSchema.partial()

// Subject Validation Schema
export const subjectCreateSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  description: z.string().optional(),
})

export const subjectUpdateSchema = subjectCreateSchema.partial()

// Class Validation Schema
export const classCreateSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  level: z.string().min(1, "Level is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  capacity: z.number().optional(),
})

export const classUpdateSchema = classCreateSchema.partial()

// Announcement Validation Schema
export const announcementCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string(),
})

export const announcementUpdateSchema = announcementCreateSchema.partial()

// Event Validation Schema
export const eventCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  allDay: z.boolean().optional().default(false),
})

export const eventUpdateSchema = eventCreateSchema.partial()

// Student Report Validation Schema
export const studentReportCreateSchema = z.object({
  studentId: z.string(),
  term: z.string(),
  academicYear: z.string(),
  totalScore: z.number().optional(),
  overallGrade: z.string().optional(),
  subjects: z.array(z.object({
    subjectId: z.string(),
    classScore: z.number().optional(),
    examScore: z.number().optional(),
    totalScore: z.number(),
    grade: z.string(),
    remarks: z.string().optional(),
  })),
})

export type StudentCreateInput = z.infer<typeof studentCreateSchema>
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>
export type TeacherCreateInput = z.infer<typeof teacherCreateSchema>
export type TeacherUpdateInput = z.infer<typeof teacherUpdateSchema>
export type SubjectCreateInput = z.infer<typeof subjectCreateSchema>
export type SubjectUpdateInput = z.infer<typeof subjectUpdateSchema>
export type ClassCreateInput = z.infer<typeof classCreateSchema>
export type ClassUpdateInput = z.infer<typeof classUpdateSchema>
export type AnnouncementCreateInput = z.infer<typeof announcementCreateSchema>
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>
export type EventCreateInput = z.infer<typeof eventCreateSchema>
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>
export type StudentReportCreateInput = z.infer<typeof studentReportCreateSchema>
