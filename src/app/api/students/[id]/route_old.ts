import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '@/services/studentService';
import { studentUpdateSchema } from '@/lib/validations';

interface Props {
  params: { id: string };
}
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

interface Props {
  params: {
    id: string;
  };
}

// GET endpoint to retrieve a single student
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const students = JSON.parse(data);
    const student = students.find((s: any) => s.id === parseInt(params.id));

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error reading student data:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

// PUT endpoint to update a student
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const studentData: any = {};
    formData.forEach((value, key) => {
      if (key === 'dateOfBirth' || key === 'admissionDate') {
        studentData[key] = new Date(value as string);
      } else {
        studentData[key] = value;
      }
    });

    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const students = JSON.parse(data);
    const studentIndex = students.findIndex((s: any) => s.id === parseInt(params.id));

    if (studentIndex === -1) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Update the student data while preserving the ID and other essential fields
    const updatedStudent = {
      ...students[studentIndex],
      ...studentData,
      id: parseInt(params.id),
      studentId: studentData.admissionNumber,
      name: studentData.fullName,
      class: studentData.classAdmittedInto,
      age: calculateAge(studentData.dateOfBirth.toISOString()),
      sex: studentData.gender,
      admissionYear: studentData.academicYear,
    };

    students[studentIndex] = updatedStudent;
    fs.writeFileSync(dataFilePath, JSON.stringify(students, null, 2));

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student data:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

// DELETE endpoint to remove a student
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const students = JSON.parse(data);
    const studentIndex = students.findIndex((s: any) => s.id === parseInt(params.id));

    if (studentIndex === -1) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Remove the student from the array
    students.splice(studentIndex, 1);

    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(students, null, 2));

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
