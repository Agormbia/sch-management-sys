"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';

// Extend jsPDF with auto-table
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Define PDF table configuration types
interface TableColumnStyle {
  cellWidth: number | 'auto' | 'wrap';
}

interface TableHeadStyles {
  fillColor: [number, number, number];
  textColor: [number, number, number];
  fontStyle: 'bold';
  halign: 'left';
}

interface TableStyles {
  fontSize: number;
  cellPadding: number;
  valign: 'middle';
}

interface TableConfig {
  theme: 'plain';
  headStyles: TableHeadStyles;
  styles: TableStyles;
  columnStyles: {
    [key: string]: TableColumnStyle;
  };
}

interface Receipt {
  id: string;
  studentName: string;
  class: string;
  feeType: string;
  amount: number;
  datePaid: string;
  issuedBy: string;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}

// Define table configuration types
type TableColumnWidth = number | 'auto' | 'wrap';

interface ColumnWidthStyle {
  cellWidth: TableColumnWidth;
}

interface TableConfig extends Partial<UserOptions> {
  columnStyles: {
    [key: string]: ColumnWidthStyle;
  };
}

const ReceiptsPage = () => {
  const [activeTab, setActiveTab] = useState('all-receipts');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedFeeType, setSelectedFeeType] = useState('All Fee Types');
  const [dateFilter, setDateFilter] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showStudentReceipts, setShowStudentReceipts] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const itemsPerPage = 10;

  const printRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const receipts: Receipt[] = [
    {
      id: '000456',
      studentName: 'Ama Serwaa',
      class: 'JHS 1',
      feeType: 'Tuition Fee',
      amount: 950.00,
      datePaid: 'Jun 1, 2025',
      issuedBy: 'Admin',
      paymentMethod: 'Mobile Money',
      transactionId: 'MTN-20250601-001',
      notes: 'Payment for Term 2 tuition fees'
    },
    {
      id: '000457',
      studentName: 'Kwame Yeboah',
      class: 'Basic 6',
      feeType: 'Uniform',
      amount: 120.00,
      datePaid: 'Jun 2, 2025',
      issuedBy: 'Admin',
      paymentMethod: 'Cash'
    },
    {
      id: '000458',
      studentName: 'Esi Mensah',
      class: 'JHS 2',
      feeType: 'Exam Fee',
      amount: 75.00,
      datePaid: 'Jun 3, 2025',
      issuedBy: 'Bursar',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '000459',
      studentName: 'Kofi Asante',
      class: 'Primary 3',
      feeType: 'PTA',
      amount: 50.00,
      datePaid: 'Jun 5, 2025',
      issuedBy: 'Admin',
      paymentMethod: 'Cash'
    }
  ];

  // Filter receipts based on search criteria
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = searchQuery === '' || 
      receipt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || receipt.class === selectedClass;
    const matchesFeeType = selectedFeeType === 'All Fee Types' || receipt.feeType === selectedFeeType;
    const matchesDate = !dateFilter || receipt.datePaid.includes(dateFilter);
    return matchesSearch && matchesClass && matchesFeeType && matchesDate;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const paginatedReceipts = filteredReceipts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReceiptClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  };

  // Export to Excel function
  const exportToExcel = () => {
    const dataToExport = filteredReceipts.map(receipt => ({
      'Receipt No': receipt.id,
      'Student Name': receipt.studentName,
      'Class': receipt.class,
      'Fee Type': receipt.feeType,
      'Amount (GHS)': receipt.amount,
      'Date Paid': receipt.datePaid,
      'Payment Method': receipt.paymentMethod,
      'Transaction ID': receipt.transactionId || '',
      'Issued By': receipt.issuedBy,
      'Notes': receipt.notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Receipts');
    XLSX.writeFile(wb, 'receipts_export.xlsx');
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };  const handleDownloadPDF = (receipt: Receipt) => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Receipt #${receipt.id}`,
      subject: 'School Fee Receipt',
      author: 'SchoolSys Academy',
      creator: 'SchoolSys Management System'
    });
    
    // Set modern blue color for header background
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add white text for header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHOOLSYS ACADEMY', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('P.O. Box 1234, Accra, Ghana | Tel: +233 123 456 789', 105, 30, { align: 'center' });
    
    // Reset text color to black
    doc.setTextColor(0, 0, 0);
    
    // Add receipt number in a modern badge
    doc.setFillColor(34, 197, 94); // Green-600
    doc.roundedRect(140, 45, 55, 15, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(`Receipt #${receipt.id}`, 167.5, 54, { align: 'center' });
    
    // Reset text color to black
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Date: ${receipt.datePaid}`, 20, 54);    // Define table configuration with proper typing
    const tableDefaults: UserOptions = {
      theme: 'plain',
      headStyles: {
        fillColor: [241, 245, 249] as [number, number, number],
        textColor: [71, 85, 105] as [number, number, number],
        fontStyle: 'bold',
        halign: 'left',
        fontSize: 11
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        valign: 'middle',
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 'auto' }
      },
      margin: { top: 10 }
    };    // Add Student Information table with proper typing
    doc.autoTable({
      ...tableDefaults,
      startY: 65,
      head: [['STUDENT INFORMATION']],
      body: [
        ['Student Name:', receipt.studentName],
        ['Class:', receipt.class]
      ]
    });    // Add Payment Details table with proper typing
    doc.autoTable({
      ...tableDefaults,
      startY: doc.lastAutoTable.finalY + 10,
      head: [['PAYMENT DETAILS']],
      body: [
        ['Fee Type:', receipt.feeType],
        ['Amount:', `GHS ${receipt.amount.toFixed(2)}`],
        ['Amount in Words:', numberToWords(receipt.amount)],
        ['Payment Method:', receipt.paymentMethod],
        ['Transaction ID:', receipt.transactionId || 'N/A']
      ]
    });    // Add Notes if they exist
    if (receipt.notes) {
      doc.autoTable({
        ...tableDefaults,
        startY: doc.lastAutoTable.finalY + 10,
        head: [['NOTES']],
        body: [[receipt.notes]],
        columnStyles: {
          0: { cellWidth: 'auto' } // Override for full width
        }
      });
    }
    
    // Add Footer
    const footerY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated document.', 105, footerY, { align: 'center' });
    doc.text('No signature is required.', 105, footerY + 5, { align: 'center' });
    doc.text('For any queries, please contact the school administration.', 105, footerY + 10, { align: 'center' });
    
    // Add QR Code with receipt details (optional, if you want to add this feature)
    // doc.addImage(QRCode, 'PNG', 20, footerY - 30, 30, 30);
    
    // Save the PDF with a clean filename
    doc.save(`SchoolSys-Receipt-${receipt.id}-${receipt.datePaid.replace(/[^0-9]/g, '')}.pdf`);
  };

  // Helper function to convert number to words
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    
    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      
      if (n < 10) return ones[n];
      
      if (n < 20) return teens[n - 10];
      
      if (n < 100) {
        return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      }
      
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanThousand(n % 100) : '');
    };
    
    return convertLessThanThousand(Math.floor(num)) + (num % 1 !== 0 ? ' and ' + Math.round((num % 1) * 100) + ' Pesewas' : '');
  };

  return (
    <div className="flex-1 p-4">
      {/* Receipts Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('all-receipts')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 flex items-center ${
            activeTab === 'all-receipts' 
              ? 'border-blue-500 text-blue-600 bg-blue-50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <i className="fas fa-list mr-2"></i> All Receipts
        </button>
        <button 
          onClick={() => setActiveTab('search-student')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 flex items-center ${
            activeTab === 'search-student' 
              ? 'border-blue-500 text-blue-600 bg-blue-50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <i className="fas fa-search mr-2"></i> Search by Student
        </button>
        <button 
          onClick={() => setActiveTab('new-receipt')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 flex items-center ${
            activeTab === 'new-receipt' 
              ? 'border-blue-500 text-blue-600 bg-blue-50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <i className="fas fa-plus mr-2"></i> Issue New Receipt
        </button>
      </div>

      {/* All Receipts View */}
      {activeTab === 'all-receipts' && (
        <div>
          <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex space-x-2">
              <input
                type="text" 
                placeholder="Search receipts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Classes</option>
                <option>Primary 1</option>
                <option>Primary 2</option>
                <option>Primary 3</option>
                <option>JHS 1</option>
                <option>JHS 2</option>
                <option>JHS 3</option>
              </select>
              <select 
                value={selectedFeeType}
                onChange={(e) => setSelectedFeeType(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Fee Types</option>
                <option>Tuition Fee</option>
                <option>Exam Fee</option>
                <option>Uniform</option>
                <option>PTA</option>
                <option>Library</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="flex items-center">to</span>
              <input 
                type="date" 
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <i className="fas fa-filter mr-1"></i> Apply
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (GHS)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReceipts.map((receipt) => (
                    <tr key={receipt.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{receipt.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{receipt.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{receipt.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{receipt.feeType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{receipt.amount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{receipt.datePaid}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{receipt.issuedBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleReceiptClick(receipt)}
                            title="View Receipt"
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors duration-200"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(receipt)}
                            title="Download PDF"
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors duration-200"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                          <button 
                            onClick={() => {
                              handleReceiptClick(receipt);
                              setTimeout(handlePrint, 100);
                            }}
                            title="Print Receipt"
                            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-full transition-colors duration-200"
                          >
                            <i className="fas fa-print"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredReceipts.length)}</span> of{' '}
                    <span className="font-medium">{filteredReceipts.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <button 
                onClick={exportToExcel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <i className="fas fa-file-export mr-2"></i> Export to Excel
              </button>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Total Collected:</span> GHS {filteredReceipts.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Search by Student View */}
      {activeTab === 'search-student' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Search Student Receipts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or ID"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 2);
                }}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Classes</option>
              <option>Primary 1</option>
              <option>Primary 2</option>
              <option>Primary 3</option>
              <option>JHS 1</option>
              <option>JHS 2</option>
              <option>JHS 3</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <i className="fas fa-filter mr-1"></i> Search
            </button>
          </div>
          
          {showSearchResults && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h4 className="font-medium">Search Results</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="student-search-result px-4 py-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setShowSearchResults(false);
                      setShowStudentReceipts(true);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{receipt.studentName}</p>
                        <p className="text-sm text-gray-500">{receipt.class} | Student ID: STU-{receipt.id}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {filteredReceipts.filter(r => r.studentName === receipt.studentName).length} receipts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Receipt Form */}
      {activeTab === 'new-receipt' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Issue New Receipt</h3>
          <form>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="student-select" className="block text-sm font-medium text-gray-700">Student*</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="student-select"
                    placeholder="Search student by name or ID"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="student-class" className="block text-sm font-medium text-gray-700">Class</label>
                  <input
                    type="text"
                    id="student-class"
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value="JHS 1"
                  />
                </div>
                <div>
                  <label htmlFor="student-id" className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="text"
                    id="student-id"
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value="STU-2025-001"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="payment-type" className="block text-sm font-medium text-gray-700">Payment Type*</label>
                  <select
                    id="payment-type"
                    required
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select payment type</option>
                    <option value="tuition">Tuition Fee</option>
                    <option value="exam">Exam Fee</option>
                    <option value="uniform">Uniform</option>
                    <option value="pta">PTA</option>
                    <option value="library">Library</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {paymentType === 'other' && (
                  <div>
                    <label htmlFor="other-payment" className="block text-sm font-medium text-gray-700">Payment Description</label>
                    <input
                      type="text"
                      id="other-payment"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="amount-paid" className="block text-sm font-medium text-gray-700">Amount Paid (GHS)*</label>
                  <input
                    type="number"
                    id="amount-paid"
                    step="0.01"
                    min="0"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="payment-date" className="block text-sm font-medium text-gray-700">Date of Payment*</label>
                  <input
                    type="date"
                    id="payment-date"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">Payment Method*</label>
                <select
                  id="payment-method"
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="momo">Mobile Money</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              
              {paymentMethod === 'momo' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="momo-network" className="block text-sm font-medium text-gray-700">Mobile Network</label>
                    <select
                      id="momo-network"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>MTN</option>
                      <option>Vodafone Cash</option>
                      <option>AirtelTigo Money</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="momo-number" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input
                      type="text"
                      id="momo-number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === 'bank' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <input
                      type="text"
                      id="bank-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="transaction-id" className="block text-sm font-medium text-gray-700">Transaction ID</label>
                    <input
                      type="text"
                      id="transaction-id"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="payment-notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  id="payment-notes"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="email-receipt"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="email-receipt" className="ml-3 block text-sm font-medium text-gray-700">
                  Email receipt to parent
                </label>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('all-receipts')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fas fa-receipt mr-2"></i> Generate Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Receipt Details</h3>
                    <div className="mt-6">
                      <div className="border-b pb-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xl font-bold">SCHOOLSYS ACADEMY</h4>
                          <div className="text-sm text-gray-500">Official Receipt</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">P.O. Box 1234, Accra</div>
                          <div className="text-sm font-medium">#{selectedReceipt.id}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Student Name:</p>
                          <p className="font-medium">{selectedReceipt.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Class:</p>
                          <p className="font-medium">{selectedReceipt.class}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fee Type:</p>
                          <p className="font-medium">{selectedReceipt.feeType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date:</p>
                          <p className="font-medium">{selectedReceipt.datePaid}</p>
                        </div>
                      </div>

                      <div className="border-t border-b py-4 mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Amount:</p>
                            <p className="text-xl font-bold text-green-600">GHS {selectedReceipt.amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment Method:</p>
                            <p className="font-medium">{selectedReceipt.paymentMethod}</p>
                          </div>
                        </div>
                      </div>

                      {selectedReceipt.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500">Notes:</p>
                          <p className="font-medium">{selectedReceipt.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => selectedReceipt && handleDownloadPDF(selectedReceipt)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <i className="fas fa-download mr-2"></i> Download PDF
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <i className="fas fa-print mr-2"></i> Print
                </button>
                <button
                  type="button"
                  onClick={closeReceiptModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptsPage;


