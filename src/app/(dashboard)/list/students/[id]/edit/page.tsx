"use client";

import { useEffect, useState } from "react";
import StudentAdmissionForm from "@/components/forms/StudentAdmissionForm";
import { useRouter } from "next/navigation";

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student');
        }
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student:', error);
        router.push('/list/students');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <StudentAdmissionForm initialData={student} />
    </div>
  );
} 