"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useReports } from '@/context/ReportContext';

// Types
export interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  academicYear: string;
}

export interface FilterCriteria {
  academicYear?: string;
  class?: string;
  term?: string;
}

export interface SubjectScore {
  subject: string;
  classScore: number;
  examScore: number;
  grade: string;
  remarks?: string;
}

export interface StudentReport {
  studentId: string;
  term: string;
  subjects: SubjectScore[];
  totalScore: number;
  overallGrade: string;
}

// Grade calculation utilities
const calculateGrade = (totalScore: number): string => {
  if (totalScore >= 90) return 'A';
  if (totalScore >= 80) return 'B+';
  if (totalScore >= 70) return 'B';
  if (totalScore >= 60) return 'C+';
  if (totalScore >= 50) return 'C';
  if (totalScore >= 40) return 'D+';
  if (totalScore >= 30) return 'D';
  return 'F';
};

const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-800';
    case 'B+':
    case 'B': return 'bg-blue-100 text-blue-800';
    case 'C+':
    case 'C': return 'bg-yellow-100 text-yellow-800';
    case 'D+':
    case 'D': return 'bg-orange-100 text-orange-800';
    case 'F': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Student Filter Panel Component
interface StudentFilterPanelProps {
  onFilter: (criteria: FilterCriteria) => void;
}

const StudentFilterPanel = ({ onFilter }: StudentFilterPanelProps) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const academicYears = ['2024/2025', '2023/2024', '2022/2023'];
  const classes = ['Crèche', 'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1', 'JHS 2', 'JHS 3'];
  const terms = ['1st Term', '2nd Term', '3rd Term'];

  const handleFilterChange = (key: keyof FilterCriteria, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilter = () => {
    console.log('Applying filters:', filters);
    onFilter(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Academic Year Filter */}
          <div className="flex flex-col space-y-2 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700">Academic Year</label>
            <Select value={filters.academicYear || ''} onValueChange={(value) => handleFilterChange('academicYear', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {academicYears.map((year) => (
                  <SelectItem key={year} value={year} className="hover:bg-gray-100">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Filter */}
          <div className="flex flex-col space-y-2 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700">Class</label>
            <Select value={filters.class || ''} onValueChange={(value) => handleFilterChange('class', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50 max-h-[200px] overflow-y-auto">
                {classes.map((className) => (
                  <SelectItem key={className} value={className} className="hover:bg-gray-100">
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Term Filter */}
          <div className="flex flex-col space-y-2 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700">Term</label>
            <Select value={filters.term || ''} onValueChange={(value) => handleFilterChange('term', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {terms.map((term) => (
                  <SelectItem key={term} value={term} className="hover:bg-gray-100">
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleApplyFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Filter
            </Button>
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className="px-6"
            >
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Student List Table Component
interface StudentListTableProps {
  students: Student[];
  onEnterScores: (student: Student) => void;
}

const StudentListTable = ({ students, onEnterScores }: StudentListTableProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Student List ({students.length} students)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-16 text-center font-semibold">No.</TableHead>
                <TableHead className="font-semibold">Student Name</TableHead>
                <TableHead className="font-semibold">Student ID</TableHead>
                <TableHead className="font-semibold">Class</TableHead>
                <TableHead className="w-40 text-center font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No students found. Please adjust your filters.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, index) => (
                  <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-center font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.studentId}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.class}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => onEnterScores(student)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Enter Scores
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Report Entry Modal Component
interface ReportEntryModalProps {
  isOpen: boolean;
  student: Student;
  onSave: (reportData: any) => void;
  onClose: () => void;
}

const defaultSubjects = [
  'English Language',
  'Mathematics',
  'Science',
  'Social Studies',
  'Religious & Moral Education',
  'Physical Education',
  'Creative Arts',
  'French',
  'ICT'
];

const remarksOptions = ['Excellent', 'Very Good', 'Good', 'Satisfactory', 'Needs Improvement'];

const ReportEntryModal = ({ isOpen, student, onSave, onClose }: ReportEntryModalProps) => {
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [subjects, setSubjects] = useState<SubjectScore[]>(
    defaultSubjects.map(subject => ({
      subject,
      classScore: 0,
      examScore: 0,
      grade: '',
      remarks: ''
    }))
  );

  const updateSubjectScore = (index: number, field: keyof SubjectScore, value: string | number) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    
    // Auto-calculate grade when scores change
    if (field === 'classScore' || field === 'examScore') {
      const totalScore = Number(updatedSubjects[index].classScore) + Number(updatedSubjects[index].examScore);
      updatedSubjects[index].grade = calculateGrade(totalScore);
    }
    
    setSubjects(updatedSubjects);
  };

  const handleSave = () => {
    if (!selectedTerm) {
      alert('Please select a term');
      return;
    }

    const totalScore = subjects.reduce((sum, subject) => 
      sum + Number(subject.classScore) + Number(subject.examScore), 0
    );
    
    const reportData = {
      studentId: student.id,
      term: selectedTerm,
      subjects,
      totalScore,
      overallGrade: calculateGrade(totalScore / subjects.length)
    };

    console.log('Report data to save:', reportData);
    onSave(reportData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Enter Scores - {student.name}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            Student ID: {student.studentId} | Class: {student.class}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Term Selection */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-[80px]">Term:</label>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="1st Term">1st Term</SelectItem>
                <SelectItem value="2nd Term">2nd Term</SelectItem>
                <SelectItem value="3rd Term">3rd Term</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subjects Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="text-center font-semibold w-32">Class Score (30)</TableHead>
                  <TableHead className="text-center font-semibold w-32">Exam Score (70)</TableHead>
                  <TableHead className="text-center font-semibold w-24">Total</TableHead>
                  <TableHead className="text-center font-semibold w-20">Grade</TableHead>
                  <TableHead className="text-center font-semibold w-40">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject, index) => {
                  const total = Number(subject.classScore) + Number(subject.examScore);
                  return (
                    <TableRow key={subject.subject} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{subject.subject}</TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          value={subject.classScore || ''}
                          onChange={(e) => updateSubjectScore(index, 'classScore', Number(e.target.value))}
                          className="w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="70"
                          value={subject.examScore || ''}
                          onChange={(e) => updateSubjectScore(index, 'examScore', Number(e.target.value))}
                          className="w-full text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {total}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Select 
                          value={subject.remarks || ''} 
                          onValueChange={(value) => updateSubjectScore(index, 'remarks', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg z-50">
                            {remarksOptions.map((remark) => (
                              <SelectItem key={remark} value={remark}>
                                {remark}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Save Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Mock data for demonstration
const mockStudents: Student[] = [
  { id: 'STD001', name: 'John Doe', studentId: 'STD001', class: 'JHS 1', academicYear: '2024/2025' },
  { id: 'STD002', name: 'Jane Smith', studentId: 'STD002', class: 'JHS 1', academicYear: '2024/2025' },
  { id: 'STD003', name: 'Michael Johnson', studentId: 'STD003', class: 'JHS 1', academicYear: '2024/2025' },
  { id: 'STD004', name: 'Sarah Wilson', studentId: 'STD004', class: 'JHS 1', academicYear: '2024/2025' },
  { id: 'STD005', name: 'David Brown', studentId: 'STD005', class: 'JHS 2', academicYear: '2024/2025' },
];

// Main Index Component
const ResultsPage = () => {
  const { addReport } = useReports();
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilter = (criteria: FilterCriteria) => {
    let filtered = mockStudents;
    
    if (criteria.academicYear) {
      filtered = filtered.filter(student => student.academicYear === criteria.academicYear);
    }
    
    if (criteria.class) {
      filtered = filtered.filter(student => student.class === criteria.class);
    }
    
    console.log('Filtering with criteria:', criteria);
    console.log('Filtered results:', filtered);
    
    setFilteredStudents(filtered);
  };

  const handleEnterScores = (student: Student) => {
    console.log('Opening report entry for student:', student);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveReport = (reportData: StudentReport) => {
    console.log('Saving report data:', reportData);
    addReport(reportData);
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Report Management</h1>
          <p className="text-gray-600">Filter students and enter their academic results</p>
        </div>

        {/* Filter Panel */}
        <StudentFilterPanel onFilter={handleFilter} />

        {/* Student List */}
        <StudentListTable 
          students={filteredStudents} 
          onEnterScores={handleEnterScores}
        />

        {/* Report Entry Modal */}
        {selectedStudent && (
          <ReportEntryModal
            isOpen={isModalOpen}
            student={selectedStudent}
            onSave={handleSaveReport}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsPage;