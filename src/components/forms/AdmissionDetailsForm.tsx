"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

interface FormProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  data: any;
}

const schema = z.object({
  admissionNumber: z.string().min(1, { message: "Admission Number is required!" }), // Assuming editable
  admissionDate: z.date({ message: "Admission Date is required!" }),
  academicYear: z.string().min(1, { message: "Academic Year is required!" }),
  class: z.string().min(1, { message: "Class is required!" }),
  term: z.string().min(1, { message: "Term is required!" }),
  previousSchool: z.string().optional(),
  reasonForTransfer: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const AdmissionDetailsForm = ({ onNext, onPrevious, data }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      admissionNumber: data?.admissionNumber || '',
      admissionDate: data?.admissionDate ? new Date(data.admissionDate) : undefined,
      academicYear: data?.academicYear || '2024/2025', // Assuming a default academic year
      class: data?.class || '',
      term: data?.term || '',
      previousSchool: data?.previousSchool || '',
      reasonForTransfer: data?.reasonForTransfer || '',
    },
  });

  const handleNextClick = handleSubmit((formData) => {
    onNext(formData);
  });

  const handlePreviousClick = () => {
    onPrevious();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Admission Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Admission Number"
          name="admissionNumber"
          defaultValue={data?.admissionNumber}
          register={register}
          error={errors.admissionNumber}
        />
         <InputField
          label="Admission Date"
          name="admissionDate"
          defaultValue={data?.admissionDate}
          register={register}
          error={errors.admissionDate}
          type="date"
        />

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">Academic Year<span className="text-red-500">*</span></label>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            {...register("academicYear")}
            defaultValue={data?.academicYear}
          >
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
          </select>
          {errors.academicYear?.message && (
            <p className="text-xs text-red-500">
              {errors.academicYear.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">Class Admitted Into<span className="text-red-500">*</span></label>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            {...register("class")}
            defaultValue={data?.class}
          >
            <option value="">Select Class</option>
            <option value="Creche">Crèche</option>
            <option value="Nursery">Nursery</option>
            <option value="KG">KG</option>
            <option value="Primary 1">Primary 1</option>
            <option value="Primary 2">Primary 2</option>
            <option value="Primary 3">Primary 3</option>
            <option value="Primary 4">Primary 4</option>
            <option value="Primary 5">Primary 5</option>
            <option value="Primary 6">Primary 6</option>
            <option value="JHS 1">JHS 1</option>
            <option value="JHS 2">JHS 2</option>
            <option value="JHS 3">JHS 3</option>
          </select>
          {errors.class?.message && (
            <p className="text-xs text-red-500">
              {errors.class.message.toString()}
            </p>
          )}
        </div>

         <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">Term<span className="text-red-500">*</span></label>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            {...register("term")}
            defaultValue={data?.term}
          >
            <option value="">Select Term</option>
            <option value="1">1st Term</option>
            <option value="2">2nd Term</option>
            <option value="3">3rd Term</option>
          </select>
          {errors.term?.message && (
            <p className="text-xs text-red-500">
              {errors.term.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Previous School Attended (optional)"
          name="previousSchool"
          defaultValue={data?.previousSchool}
          register={register}
          error={errors.previousSchool}
        />

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">Reason for Transfer (optional)</label>
          <textarea
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            {...register("reasonForTransfer")}
            defaultValue={data?.reasonForTransfer}
            rows={3}
          ></textarea>
          {errors.reasonForTransfer?.message && (
            <p className="text-xs text-red-500">
              {errors.reasonForTransfer.message.toString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handlePreviousClick}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdmissionDetailsForm; 