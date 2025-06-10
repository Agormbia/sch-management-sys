import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the JSON file that will store our students data
const dataFilePath = path.join(process.cwd(), 'data', 'students.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize the students.json file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

function calculateAge(birthDateStr: string) {
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// GET endpoint to retrieve all students
export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const students = JSON.parse(data);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error reading students data:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Convert FormData to a regular object
    const studentData: any = {};
    formData.forEach((value, key) => {
      if (key === 'dateOfBirth' || key === 'admissionDate') {
        studentData[key] = new Date(value as string);
      } else {
        studentData[key] = value;
      }
    });

    // Read existing data
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const students = JSON.parse(data);

    // Generate a unique ID
    const newId = students.length > 0 ? Math.max(...students.map((s: any) => s.id)) + 1 : 1;

    // Create new student object
    const newStudent = {
      id: newId,
      studentId: studentData.admissionNumber,
      name: studentData.fullName,
      photo: '/default-avatar.png', // Default avatar image
      class: studentData.classAdmittedInto,
      age: calculateAge(studentData.dateOfBirth.toISOString()),
      sex: studentData.gender,
      admissionYear: studentData.academicYear,
      // Store all the additional data
      ...studentData
    };

    // Add new student to the array
    students.push(newStudent);

    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(students, null, 2));

    return NextResponse.json(newStudent);
  } catch (error) {
    console.error('Error saving student data:', error);
    return NextResponse.json({ error: 'Failed to save student data' }, { status: 500 });
  }
}
