import { PrismaClient } from '@prisma/client';
import { generateAdmissionNumber, generateTeacherId, getCurrentAcademicYear } from '../src/lib/helpers';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Seed Subjects
  console.log('📚 Seeding subjects...');
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { code: 'MATH001' },
      update: {},
      create: {
        name: 'Mathematics',
        code: 'MATH001',
        description: 'Basic mathematics including algebra and geometry'
      }
    }),
    prisma.subject.upsert({
      where: { code: 'ENG001' },
      update: {},
      create: {
        name: 'English Language',
        code: 'ENG001',
        description: 'English language and literature'
      }
    }),
    prisma.subject.upsert({
      where: { code: 'SCI001' },
      update: {},
      create: {
        name: 'Science',
        code: 'SCI001',
        description: 'General science including physics, chemistry, and biology'
      }
    }),
    prisma.subject.upsert({
      where: { code: 'HIST001' },
      update: {},
      create: {
        name: 'History',
        code: 'HIST001',
        description: 'World and local history'
      }
    }),
    prisma.subject.upsert({
      where: { code: 'GEOG001' },
      update: {},
      create: {
        name: 'Geography',
        code: 'GEOG001',
        description: 'Physical and human geography'
      }
    })
  ]);

  // Seed Classes
  console.log('🏫 Seeding classes...');
  const classes = await Promise.all([
    prisma.class.upsert({
      where: { name: 'Grade 1A' },
      update: {},
      create: {
        name: 'Grade 1A',
        level: 'Primary',
        academicYear: getCurrentAcademicYear(),
        capacity: 30
      }
    }),
    prisma.class.upsert({
      where: { name: 'Grade 2A' },
      update: {},
      create: {
        name: 'Grade 2A',
        level: 'Primary',
        academicYear: getCurrentAcademicYear(),
        capacity: 30
      }
    }),
    prisma.class.upsert({
      where: { name: 'Grade 3A' },
      update: {},
      create: {
        name: 'Grade 3A',
        level: 'Primary',
        academicYear: getCurrentAcademicYear(),
        capacity: 30
      }
    }),
    prisma.class.upsert({
      where: { name: 'Grade 4A' },
      update: {},
      create: {
        name: 'Grade 4A',
        level: 'Primary',
        academicYear: getCurrentAcademicYear(),
        capacity: 30
      }
    }),
    prisma.class.upsert({
      where: { name: 'Grade 5A' },
      update: {},
      create: {
        name: 'Grade 5A',
        level: 'Primary',
        academicYear: getCurrentAcademicYear(),
        capacity: 30
      }
    })
  ]);

  // Seed Teachers
  console.log('👨‍🏫 Seeding teachers...');
  const teachers = await Promise.all([
    prisma.teacher.upsert({
      where: { teacherId: 'TCH001' },
      update: {},
      create: {
        teacherId: 'TCH001',
        name: 'John Smith',
        email: 'john.smith@school.edu',
        phone: '(555) 123-4567',
        address: '123 Teacher Lane, Education City',
        photo: '/avatar.png',
        qualification: 'Masters in Mathematics Education',
        experience: 8,
        specialization: 'Mathematics',
        employmentDate: new Date('2020-08-15'),
        employmentType: 'Full-time'
      }
    }),
    prisma.teacher.upsert({
      where: { teacherId: 'TCH002' },
      update: {},
      create: {
        teacherId: 'TCH002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@school.edu',
        phone: '(555) 234-5678',
        address: '456 Education Street, Learning Town',
        photo: '/avatar.png',
        qualification: 'Bachelor in English Literature',
        experience: 5,
        specialization: 'English Language',
        employmentDate: new Date('2021-01-10'),
        employmentType: 'Full-time'
      }
    }),
    prisma.teacher.upsert({
      where: { teacherId: 'TCH003' },
      update: {},
      create: {
        teacherId: 'TCH003',
        name: 'Michael Brown',
        email: 'michael.brown@school.edu',
        phone: '(555) 345-6789',
        address: '789 Science Avenue, Research Park',
        photo: '/avatar.png',
        qualification: 'Masters in Science Education',
        experience: 10,
        specialization: 'Science',
        employmentDate: new Date('2018-09-01'),
        employmentType: 'Full-time'
      }
    }),
    prisma.teacher.upsert({
      where: { teacherId: 'TCH004' },
      update: {},
      create: {
        teacherId: 'TCH004',
        name: 'Emily Davis',
        email: 'emily.davis@school.edu',
        phone: '(555) 456-7890',
        address: '321 History Boulevard, Heritage District',
        photo: '/avatar.png',
        qualification: 'Bachelor in History',
        experience: 6,
        specialization: 'History',
        employmentDate: new Date('2020-02-15'),
        employmentType: 'Full-time'
      }
    }),
    prisma.teacher.upsert({
      where: { teacherId: 'TCH005' },
      update: {},
      create: {
        teacherId: 'TCH005',
        name: 'David Wilson',
        email: 'david.wilson@school.edu',
        phone: '(555) 567-8901',
        address: '654 Geography Circle, Map Valley',
        photo: '/avatar.png',
        qualification: 'Masters in Geography',
        experience: 7,
        specialization: 'Geography',
        employmentDate: new Date('2019-08-20'),
        employmentType: 'Full-time'
      }
    })
  ]);

  // Assign teachers to subjects
  console.log('🔗 Assigning teachers to subjects...');
  await Promise.all([
    prisma.teacherSubject.upsert({
      where: {
        teacherId_subjectId: {
          teacherId: teachers[0].id,
          subjectId: subjects[0].id
        }
      },
      update: {},
      create: {
        teacherId: teachers[0].id,
        subjectId: subjects[0].id
      }
    }),
    prisma.teacherSubject.upsert({
      where: {
        teacherId_subjectId: {
          teacherId: teachers[1].id,
          subjectId: subjects[1].id
        }
      },
      update: {},
      create: {
        teacherId: teachers[1].id,
        subjectId: subjects[1].id
      }
    }),
    prisma.teacherSubject.upsert({
      where: {
        teacherId_subjectId: {
          teacherId: teachers[2].id,
          subjectId: subjects[2].id
        }
      },
      update: {},
      create: {
        teacherId: teachers[2].id,
        subjectId: subjects[2].id
      }
    }),
    prisma.teacherSubject.upsert({
      where: {
        teacherId_subjectId: {
          teacherId: teachers[3].id,
          subjectId: subjects[3].id
        }
      },
      update: {},
      create: {
        teacherId: teachers[3].id,
        subjectId: subjects[3].id
      }
    }),
    prisma.teacherSubject.upsert({
      where: {
        teacherId_subjectId: {
          teacherId: teachers[4].id,
          subjectId: subjects[4].id
        }
      },
      update: {},
      create: {
        teacherId: teachers[4].id,
        subjectId: subjects[4].id
      }
    })
  ]);

  // Assign teachers to classes
  console.log('🏫 Assigning teachers to classes...');
  await Promise.all([
    prisma.teacherClass.upsert({
      where: {
        teacherId_classId: {
          teacherId: teachers[0].id,
          classId: classes[0].id
        }
      },
      update: {},
      create: {
        teacherId: teachers[0].id,
        classId: classes[0].id
      }
    }),
    prisma.teacherClass.upsert({
      where: {
        teacherId_classId: {
          teacherId: teachers[1].id,
          classId: classes[1].id
        }
      },
      update: {},
      create: {
        teacherId: teachers[1].id,
        classId: classes[1].id
      }
    }),
    prisma.teacherClass.upsert({
      where: {
        teacherId_classId: {
          teacherId: teachers[2].id,
          classId: classes[2].id
        }
      },
      update: {},
      create: {
        teacherId: teachers[2].id,
        classId: classes[2].id
      }
    })
  ]);

  // Seed Students
  console.log('👨‍🎓 Seeding students...');
  const students = await Promise.all([
    prisma.student.upsert({
      where: { admissionNumber: 'ADM001' },
      update: {},
      create: {
        fullName: 'Alice Johnson',
        gender: 'Female',
        dateOfBirth: new Date('2010-05-15'),
        placeOfBirth: 'City Hospital',
        nationality: 'American',
        religion: 'Christian',
        hometown: 'Springfield',
        homeAddress: '123 Main Street, Springfield',
        admissionNumber: 'ADM001',
        admissionDate: new Date('2024-09-01'),
        academicYear: getCurrentAcademicYear(),
        classAdmittedInto: 'Grade 1A',
        term: 'First Term',
        primaryGuardianName: 'Robert Johnson',
        primaryGuardianRelationship: 'Father',
        primaryGuardianPhone: '(555) 111-2222',
        primaryGuardianEmail: 'robert.johnson@email.com',
        primaryGuardianOccupation: 'Engineer',
        primaryGuardianAddress: '123 Main Street, Springfield',
        emergencyContactName: 'Mary Johnson',
        emergencyContactRelationship: 'Mother',
        emergencyContactPhone: '(555) 111-3333',
        bloodGroup: 'A+',
        preferredCommunication: 'Email'
      }
    }),
    prisma.student.upsert({
      where: { admissionNumber: 'ADM002' },
      update: {},
      create: {
        fullName: 'Bob Smith',
        gender: 'Male',
        dateOfBirth: new Date('2011-08-22'),
        placeOfBirth: 'General Hospital',
        nationality: 'American',
        religion: 'Catholic',
        hometown: 'Springfield',
        homeAddress: '456 Oak Avenue, Springfield',
        admissionNumber: 'ADM002',
        admissionDate: new Date('2024-09-01'),
        academicYear: getCurrentAcademicYear(),
        classAdmittedInto: 'Grade 2A',
        term: 'First Term',
        primaryGuardianName: 'Jennifer Smith',
        primaryGuardianRelationship: 'Mother',
        primaryGuardianPhone: '(555) 222-3333',
        primaryGuardianEmail: 'jennifer.smith@email.com',
        primaryGuardianOccupation: 'Teacher',
        primaryGuardianAddress: '456 Oak Avenue, Springfield',
        emergencyContactName: 'David Smith',
        emergencyContactRelationship: 'Father',
        emergencyContactPhone: '(555) 222-4444',
        bloodGroup: 'B+',
        preferredCommunication: 'Phone'
      }
    }),
    prisma.student.upsert({
      where: { admissionNumber: 'ADM003' },
      update: {},
      create: {
        fullName: 'Carol Williams',
        gender: 'Female',
        dateOfBirth: new Date('2012-03-10'),
        placeOfBirth: 'Community Hospital',
        nationality: 'American',
        religion: 'Protestant',
        hometown: 'Springfield',
        homeAddress: '789 Pine Street, Springfield',
        admissionNumber: 'ADM003',
        admissionDate: new Date('2024-09-01'),
        academicYear: getCurrentAcademicYear(),
        classAdmittedInto: 'Grade 3A',
        term: 'First Term',
        primaryGuardianName: 'Michael Williams',
        primaryGuardianRelationship: 'Father',
        primaryGuardianPhone: '(555) 333-4444',
        primaryGuardianEmail: 'michael.williams@email.com',
        primaryGuardianOccupation: 'Doctor',
        primaryGuardianAddress: '789 Pine Street, Springfield',
        emergencyContactName: 'Susan Williams',
        emergencyContactRelationship: 'Mother',
        emergencyContactPhone: '(555) 333-5555',
        bloodGroup: 'O+',
        preferredCommunication: 'Email'
      }
    })
  ]);

  // Assign students to classes
  console.log('📝 Assigning students to classes...');
  await Promise.all([
    prisma.classStudent.upsert({
      where: {
        studentId_classId: {
          studentId: students[0].id,
          classId: classes[0].id
        }
      },
      update: {},
      create: {
        studentId: students[0].id,
        classId: classes[0].id
      }
    }),
    prisma.classStudent.upsert({
      where: {
        studentId_classId: {
          studentId: students[1].id,
          classId: classes[1].id
        }
      },
      update: {},
      create: {
        studentId: students[1].id,
        classId: classes[1].id
      }
    }),
    prisma.classStudent.upsert({
      where: {
        studentId_classId: {
          studentId: students[2].id,
          classId: classes[2].id
        }
      },
      update: {},
      create: {
        studentId: students[2].id,
        classId: classes[2].id
      }
    })
  ]);

  console.log('✅ Seed completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${subjects.length} subjects`);
  console.log(`   - ${classes.length} classes`);
  console.log(`   - ${teachers.length} teachers`);
  console.log(`   - ${students.length} students`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
