"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Student, StudentReport } from '../app/(dashboard)/list/results/page';

interface ReportContextType {
  reports: StudentReport[];
  addReport: (report: StudentReport) => void;
  getReportsByStudent: (studentId: string) => StudentReport[];
  getReportByStudentAndTerm: (studentId: string, term: string) => StudentReport | undefined;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<StudentReport[]>([]);

  const addReport = useCallback((report: StudentReport) => {
    setReports(prevReports => {
      // Remove any existing report for the same student and term
      const filteredReports = prevReports.filter(
        r => !(r.studentId === report.studentId && r.term === report.term)
      );
      // Add the new report
      return [...filteredReports, report];
    });
  }, []);

  const getReportsByStudent = useCallback((studentId: string) => {
    return reports.filter(report => report.studentId === studentId);
  }, [reports]);

  const getReportByStudentAndTerm = useCallback((studentId: string, term: string) => {
    return reports.find(report => report.studentId === studentId && report.term === term);
  }, [reports]);

  return (
    <ReportContext.Provider value={{
      reports,
      addReport,
      getReportsByStudent,
      getReportByStudentAndTerm,
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
