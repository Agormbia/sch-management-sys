const STORAGE_KEY = 'school_management_students';

export interface Student {
  id: number;
  studentId: string;
  name: string;
  photo: string;
  class: string;
  age: number;
  sex: string;
  admissionYear: string;
  [key: string]: any;
}

function getStoredStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveStudents(students: Student[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }
}

export function getStudents(): Student[] {
  return getStoredStudents();
}

export function addStudent(student: Student): Student {
  const students = getStoredStudents();
  students.push(student);
  saveStudents(students);
  return student;
}

export function updateStudent(id: number, data: Partial<Student>): Student | null {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...data };
    saveStudents(students);
    return students[index];
  }
  return null;
}

export function deleteStudent(id: number): boolean {
  const students = getStoredStudents();
  const newStudents = students.filter(s => s.id !== id);
  saveStudents(newStudents);
  return newStudents.length < students.length;
}// End of file
