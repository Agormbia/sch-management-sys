"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Types
interface StudentAdmissionData {
  // Personal Information
  fullName: string;
  gender: string;
  dateOfBirth: Date | undefined;
  placeOfBirth: string;
  nationality: string;
  religion: string;
  hometown: string;
  homeAddress: string;
  gpsAddress: string;

  // Admission Details
  admissionNumber: string;
  admissionDate: Date | undefined;
  academicYear: string;
  classAdmittedInto: string;
  term: string;
  previousSchool: string;
  reasonForTransfer: string;

  // Primary Guardian
  primaryGuardianName: string;
  primaryGuardianRelationship: string;
  primaryGuardianPhone: string;
  primaryGuardianEmail: string;
  primaryGuardianOccupation: string;
  primaryGuardianAddress: string;

  // Secondary Guardian
  secondaryGuardianName: string;
  secondaryGuardianPhone: string;
  secondaryGuardianRelationship: string;
  secondaryGuardianOccupation: string;

  // Other Information
  languagesSpoken: string;
  preferredCommunication: string;
  remarks: string;
}

interface StudentAdmissionFormProps {
  initialData?: any;
}

const StudentAdmissionForm = ({ initialData }: StudentAdmissionFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentAdmissionData>({
    fullName: initialData?.name || '',
    gender: initialData?.sex || '',
    dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : undefined,
    placeOfBirth: initialData?.placeOfBirth || '',
    nationality: initialData?.nationality || '',
    religion: initialData?.religion || '',
    hometown: initialData?.hometown || '',
    homeAddress: initialData?.homeAddress || '',
    gpsAddress: initialData?.gpsAddress || '',
    admissionNumber: initialData?.studentId || `ADM${Date.now().toString().slice(-6)}`,
    admissionDate: initialData?.admissionDate ? new Date(initialData.admissionDate) : undefined,
    academicYear: initialData?.admissionYear || '',
    classAdmittedInto: initialData?.class || '',
    term: initialData?.term || '',
    previousSchool: initialData?.previousSchool || '',
    reasonForTransfer: initialData?.reasonForTransfer || '',
    primaryGuardianName: initialData?.primaryGuardianName || '',
    primaryGuardianRelationship: initialData?.primaryGuardianRelationship || '',
    primaryGuardianPhone: initialData?.primaryGuardianPhone || '',
    primaryGuardianEmail: initialData?.primaryGuardianEmail || '',
    primaryGuardianOccupation: initialData?.primaryGuardianOccupation || '',
    primaryGuardianAddress: initialData?.primaryGuardianAddress || '',
    secondaryGuardianName: initialData?.secondaryGuardianName || '',
    secondaryGuardianPhone: initialData?.secondaryGuardianPhone || '',
    secondaryGuardianRelationship: initialData?.secondaryGuardianRelationship || '',
    secondaryGuardianOccupation: initialData?.secondaryGuardianOccupation || '',
    languagesSpoken: initialData?.languagesSpoken || '',
    preferredCommunication: initialData?.preferredCommunication || '',
    remarks: initialData?.remarks || ''
  });

  // Constants
  const academicYears = ['2024/2025', '2023/2024', '2025/2026'];
  const classes = ['Crèche', 'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1', 'JHS 2', 'JHS 3'];
  const terms = ['1st Term', '2nd Term', '3rd Term'];
  const relationships = ['Father', 'Mother', 'Guardian', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Other'];

  const handleInputChange = (field: keyof StudentAdmissionData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field: keyof StudentAdmissionData, date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = async () => {
    try {
      // Create FormData object to handle file uploads
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof Date) {
          formDataToSend.append(key, value.toISOString());
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Send data to API
      const response = await fetch(
        initialData ? `/api/students/${initialData.id}` : '/api/students',
        {
          method: initialData ? 'PUT' : 'POST',
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit student data');
      }

      // Redirect to students list with refresh parameter
      router.push('/list/students?refresh=true');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit student data. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      gender: '',
      dateOfBirth: undefined,
      placeOfBirth: '',
      nationality: '',
      religion: '',
      hometown: '',
      homeAddress: '',
      gpsAddress: '',
      admissionNumber: `ADM${Date.now().toString().slice(-6)}`,
      admissionDate: undefined,
      academicYear: '',
      classAdmittedInto: '',
      term: '',
      previousSchool: '',
      reasonForTransfer: '',
      primaryGuardianName: '',
      primaryGuardianRelationship: '',
      primaryGuardianPhone: '',
      primaryGuardianEmail: '',
      primaryGuardianOccupation: '',
      primaryGuardianAddress: '',
      secondaryGuardianName: '',
      secondaryGuardianPhone: '',
      secondaryGuardianRelationship: '',
      secondaryGuardianOccupation: '',
      languagesSpoken: '',
      preferredCommunication: '',
      remarks: ''
    });
  };

  // Date Picker Component
  const DatePicker = ({ date, onDateChange, placeholder }: { 
    date: Date | undefined; 
    onDateChange: (date: Date | undefined) => void; 
    placeholder: string;
  }) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
          <div className="flex items-center justify-between p-3 border-b">
            <Button
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => {
                if (date) {
                  const newDate = new Date(date);
                  newDate.setMonth(newDate.getMonth() - 1);
                  onDateChange(newDate);
                }
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border rounded px-2 py-1"
                value={date ? date.getFullYear() : new Date().getFullYear()}
                onChange={(e) => {
                  if (date) {
                    const newDate = new Date(date);
                    newDate.setFullYear(parseInt(e.target.value));
                    onDateChange(newDate);
                  }
                }}
              >
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                className="text-sm border rounded px-2 py-1"
                value={date ? date.getMonth() : new Date().getMonth()}
                onChange={(e) => {
                  if (date) {
                    const newDate = new Date(date);
                    newDate.setMonth(parseInt(e.target.value));
                    onDateChange(newDate);
                  }
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                  <option key={month} value={month}>
                    {format(new Date(2000, month), 'MMMM')}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => {
                if (date) {
                  const newDate = new Date(date);
                  newDate.setMonth(newDate.getMonth() + 1);
                  onDateChange(newDate);
                }
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              onDateChange(newDate);
              if (newDate) {
                setOpen(false);
              }
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    );
  };

  // Calculate age when date of birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Update the age in the form data
      setFormData(prev => ({
        ...prev,
        age: age
      }));
    }
  }, [formData.dateOfBirth]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1920px] mx-auto">
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-6 border-b">
            <CardTitle className="text-3xl font-bold text-gray-900 text-center">
              {initialData ? 'Edit Student Information' : 'New Student Admission'}
            </CardTitle>
            <p className="text-gray-600 text-center mt-2">
              {initialData ? 'Update the student information below' : 'Complete the form below to enroll a new student'}
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
                <TabsTrigger value="admission" className="text-xs">Admission</TabsTrigger>
                <TabsTrigger value="guardian" className="text-xs">Guardian</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth *</Label>
                    <DatePicker
                      date={formData.dateOfBirth}
                      onDateChange={(date) => handleDateChange('dateOfBirth', date)}
                      placeholder="Select date of birth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">Place of Birth</Label>
                    <Input
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                      placeholder="Enter place of birth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      placeholder="Enter nationality"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={formData.religion}
                      onChange={(e) => handleInputChange('religion', e.target.value)}
                      placeholder="Enter religion"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hometown">Hometown</Label>
                    <Input
                      id="hometown"
                      value={formData.hometown}
                      onChange={(e) => handleInputChange('hometown', e.target.value)}
                      placeholder="Enter hometown"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpsAddress">GPS/Digital Address</Label>
                    <Input
                      id="gpsAddress"
                      value={formData.gpsAddress}
                      onChange={(e) => handleInputChange('gpsAddress', e.target.value)}
                      placeholder="Enter GPS address (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languagesSpoken">Languages Spoken at Home</Label>
                    <Input
                      id="languagesSpoken"
                      value={formData.languagesSpoken}
                      onChange={(e) => handleInputChange('languagesSpoken', e.target.value)}
                      placeholder="e.g., English, Twi, Ga"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeAddress">Home Address *</Label>
                  <Textarea
                    id="homeAddress"
                    value={formData.homeAddress}
                    onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                    placeholder="Enter complete home address"
                    rows={3}
                  />
                </div>
              </TabsContent>

              {/* Admission Details */}
              <TabsContent value="admission" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="admissionNumber">Admission Number</Label>
                    <Input
                      id="admissionNumber"
                      value={formData.admissionNumber}
                      onChange={(e) => handleInputChange('admissionNumber', e.target.value)}
                      placeholder="Auto-generated"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Admission Date *</Label>
                    <DatePicker
                      date={formData.admissionDate}
                      onDateChange={(date) => handleDateChange('admissionDate', date)}
                      placeholder="Select admission date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Academic Year *</Label>
                    <Select value={formData.academicYear} onValueChange={(value) => handleInputChange('academicYear', value)}>
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

                  <div className="space-y-2">
                    <Label>Class Admitted Into *</Label>
                    <Select value={formData.classAdmittedInto} onValueChange={(value) => handleInputChange('classAdmittedInto', value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50 max-h-[200px] overflow-y-auto">
                        {classes.map((className) => (
                          <SelectItem key={className} value={className}>{className}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Term *</Label>
                    <Select value={formData.term} onValueChange={(value) => handleInputChange('term', value)}>
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

                  <div className="space-y-2">
                    <Label htmlFor="previousSchool">Previous School Attended</Label>
                    <Input
                      id="previousSchool"
                      value={formData.previousSchool}
                      onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                      placeholder="Enter previous school (optional)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reasonForTransfer">Reason for Transfer</Label>
                  <Textarea
                    id="reasonForTransfer"
                    value={formData.reasonForTransfer}
                    onChange={(e) => handleInputChange('reasonForTransfer', e.target.value)}
                    placeholder="Enter reason for transfer (optional)"
                    rows={3}
                  />
                </div>
              </TabsContent>

              {/* Guardian Details */}
              <TabsContent value="guardian" className="space-y-8">
                {/* Primary Guardian */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Primary Guardian</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryGuardianName">Full Name *</Label>
                      <Input
                        id="primaryGuardianName"
                        value={formData.primaryGuardianName}
                        onChange={(e) => handleInputChange('primaryGuardianName', e.target.value)}
                        placeholder="Enter guardian's full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Relationship *</Label>
                      <Select value={formData.primaryGuardianRelationship} onValueChange={(value) => handleInputChange('primaryGuardianRelationship', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {relationships.map((relationship) => (
                            <SelectItem key={relationship} value={relationship}>{relationship}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryGuardianPhone">Phone Number *</Label>
                      <Input
                        id="primaryGuardianPhone"
                        value={formData.primaryGuardianPhone}
                        onChange={(e) => handleInputChange('primaryGuardianPhone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryGuardianEmail">Email</Label>
                      <Input
                        id="primaryGuardianEmail"
                        type="email"
                        value={formData.primaryGuardianEmail}
                        onChange={(e) => handleInputChange('primaryGuardianEmail', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryGuardianOccupation">Occupation</Label>
                      <Input
                        id="primaryGuardianOccupation"
                        value={formData.primaryGuardianOccupation}
                        onChange={(e) => handleInputChange('primaryGuardianOccupation', e.target.value)}
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryGuardianAddress">Address</Label>
                    <Textarea
                      id="primaryGuardianAddress"
                      value={formData.primaryGuardianAddress}
                      onChange={(e) => handleInputChange('primaryGuardianAddress', e.target.value)}
                      placeholder="Enter guardian's address"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Secondary Guardian */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Secondary Guardian (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="secondaryGuardianName">Full Name</Label>
                      <Input
                        id="secondaryGuardianName"
                        value={formData.secondaryGuardianName}
                        onChange={(e) => handleInputChange('secondaryGuardianName', e.target.value)}
                        placeholder="Enter guardian's full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryGuardianPhone">Phone Number</Label>
                      <Input
                        id="secondaryGuardianPhone"
                        value={formData.secondaryGuardianPhone}
                        onChange={(e) => handleInputChange('secondaryGuardianPhone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select value={formData.secondaryGuardianRelationship} onValueChange={(value) => handleInputChange('secondaryGuardianRelationship', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {relationships.map((relationship) => (
                            <SelectItem key={relationship} value={relationship}>{relationship}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryGuardianOccupation">Occupation</Label>
                      <Input
                        id="secondaryGuardianOccupation"
                        value={formData.secondaryGuardianOccupation}
                        onChange={(e) => handleInputChange('secondaryGuardianOccupation', e.target.value)}
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Footer */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-8"
              >
                Reset
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {initialData ? 'Update Student' : 'Submit Application'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAdmissionForm; 