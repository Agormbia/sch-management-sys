"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useReports } from '@/context/ReportContext';

// Import types from results page
import type { Student, FilterCriteria, SubjectScore, StudentReport } from '../results/page';

// Mock students data (you may want to move this to a shared data file)
const mockStudents: Student[] = [
	{ id: 'STD001', name: 'John Doe', studentId: 'STD001', class: 'JHS 1', academicYear: '2024/2025' },
	{ id: 'STD002', name: 'Jane Smith', studentId: 'STD002', class: 'JHS 1', academicYear: '2024/2025' },
];

const getStudentById = (studentId: string): Student | undefined => {
	return mockStudents.find(student => student.id === studentId);
};

// Report viewing modal component
interface ReportViewModalProps {
	isOpen: boolean;
	onClose: () => void;
	report: StudentReport;
	student: Student;
}

const ReportViewModal = ({ isOpen, onClose, report, student }: ReportViewModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
				<DialogHeader className="pb-4 border-b">
					<DialogTitle className="text-2xl font-bold text-gray-900">
						Academic Report - {student.name}
					</DialogTitle>
					<div className="text-sm text-gray-600">
						Student ID: {student.studentId} | Class: {student.class} | Term: {report.term}
					</div>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<div className="border rounded-lg overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-gray-50">
									<TableHead className="font-semibold">Subject</TableHead>
									<TableHead className="text-center font-semibold">Class Score (30)</TableHead>
									<TableHead className="text-center font-semibold">Exam Score (70)</TableHead>
									<TableHead className="text-center font-semibold">Total</TableHead>
									<TableHead className="text-center font-semibold">Grade</TableHead>
									<TableHead className="font-semibold">Remarks</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{report.subjects.map((subject) => {
									const total = subject.classScore + subject.examScore;
									return (
										<TableRow key={subject.subject}>
											<TableCell className="font-medium">{subject.subject}</TableCell>
											<TableCell className="text-center">{subject.classScore}</TableCell>
											<TableCell className="text-center">{subject.examScore}</TableCell>
											<TableCell className="text-center font-semibold">{total}</TableCell>
											<TableCell className="text-center">
												<span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(subject.grade)}`}>
													{subject.grade}
												</span>
											</TableCell>
											<TableCell>{subject.remarks}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>

					<div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg">
						<div className="text-sm font-medium text-gray-500">Overall Performance</div>
						<div className="flex items-center gap-4">
							<div>
								Total Score: <span className="font-semibold">{report.totalScore}</span>
							</div>
							<div>
								Overall Grade: <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(report.overallGrade)}`}>
									{report.overallGrade}
								</span>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

// Grade color utility function
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

const ReportsPage = () => {
	const { reports } = useReports();
	const [filteredReports, setFilteredReports] = useState<StudentReport[]>(reports);
	const [selectedReport, setSelectedReport] = useState<StudentReport | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filters, setFilters] = useState<FilterCriteria>({});

	// Update filtered reports when reports change
	useEffect(() => {
		setFilteredReports(reports);
	}, [reports]);

	const handleFilter = (key: keyof FilterCriteria, value: string) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);

		// Apply filters to reports
		let filtered = reports;
		
		if (newFilters.academicYear) {
			filtered = filtered.filter(report => {
				const student = getStudentById(report.studentId);
				return student?.academicYear === newFilters.academicYear;
			});
		}
		
		if (newFilters.class) {
			filtered = filtered.filter(report => {
				const student = getStudentById(report.studentId);
				return student?.class === newFilters.class;
			});
		}
		
		if (newFilters.term) {
			filtered = filtered.filter(report => report.term === newFilters.term);
		}
		
		setFilteredReports(filtered);
	};

	const handleViewReport = (report: StudentReport) => {
		setSelectedReport(report);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedReport(null);
	};

	const academicYears = ['2024/2025', '2023/2024', '2022/2023'];
	const classes = ['Crèche', 'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1', 'JHS 2', 'JHS 3'];
	const terms = ['1st Term', '2nd Term', '3rd Term'];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Reports</h1>
					<p className="text-gray-600">View and filter student academic reports</p>
				</div>

				{/* Filter Panel */}
				<Card className="bg-white shadow-sm">
					<CardContent className="p-6">
						<div className="flex flex-wrap items-end gap-4">
							{/* Academic Year Filter */}
							<div className="flex flex-col space-y-2 min-w-[200px]">
								<label className="text-sm font-medium text-gray-700">Academic Year</label>
								<Select value={filters.academicYear || ''} onValueChange={(value) => handleFilter('academicYear', value)}>
									<SelectTrigger className="bg-white">
										<SelectValue placeholder="Select academic year" />
									</SelectTrigger>
									<SelectContent className="bg-white border shadow-lg z-50">
										{academicYears.map((year) => (
											<SelectItem key={year} value={year}>{year}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Class Filter */}
							<div className="flex flex-col space-y-2 min-w-[200px]">
								<label className="text-sm font-medium text-gray-700">Class</label>
								<Select value={filters.class || ''} onValueChange={(value) => handleFilter('class', value)}>
									<SelectTrigger className="bg-white">
										<SelectValue placeholder="Select class" />
									</SelectTrigger>
									<SelectContent className="bg-white border shadow-lg z-50">
										{classes.map((className) => (
											<SelectItem key={className} value={className}>{className}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Term Filter */}
							<div className="flex flex-col space-y-2 min-w-[200px]">
								<label className="text-sm font-medium text-gray-700">Term</label>
								<Select value={filters.term || ''} onValueChange={(value) => handleFilter('term', value)}>
									<SelectTrigger className="bg-white">
										<SelectValue placeholder="Select term" />
									</SelectTrigger>
									<SelectContent className="bg-white border shadow-lg z-50">
										{terms.map((term) => (
											<SelectItem key={term} value={term}>{term}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Reports List */}
				<Card className="bg-white shadow-sm">
					<CardHeader className="pb-4">
						<CardTitle className="text-xl font-semibold text-gray-900">
							Academic Reports ({filteredReports.length})
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="bg-gray-50">
										<TableHead className="font-semibold">Student Name</TableHead>
										<TableHead className="font-semibold">Student ID</TableHead>
										<TableHead className="font-semibold">Class</TableHead>
										<TableHead className="font-semibold">Term</TableHead>
										<TableHead className="text-center font-semibold">Overall Grade</TableHead>
										<TableHead className="text-center font-semibold w-24">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredReports.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-8 text-gray-500">
												No reports found. Please adjust your filters.
											</TableCell>
										</TableRow>
									) : (
										filteredReports.map((report) => {
											const student = getStudentById(report.studentId);
											if (!student) return null;

											return (
												<TableRow key={`${report.studentId}-${report.term}`}>
													<TableCell className="font-medium">{student.name}</TableCell>
													<TableCell>{student.studentId}</TableCell>
													<TableCell>{student.class}</TableCell>
													<TableCell>{report.term}</TableCell>
													<TableCell className="text-center">
														<span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(report.overallGrade)}`}>
															{report.overallGrade}
														</span>
													</TableCell>
													<TableCell className="text-center">
														<Button
															onClick={() => handleViewReport(report)}
															size="sm"
															className="bg-blue-600 hover:bg-blue-700 text-white"
														>
															View
														</Button>
													</TableCell>
												</TableRow>
											);
										})
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				{/* Report View Modal */}
				{selectedReport && (
					<ReportViewModal
						isOpen={isModalOpen}
						onClose={handleCloseModal}
						report={selectedReport}
						student={getStudentById(selectedReport.studentId)!}
					/>
				)}
			</div>
		</div>
	);
};

export default ReportsPage;