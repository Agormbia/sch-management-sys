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
  primaryGuardianName: z.string().min(1, { message: "Primary guardian name is required!" }),
  primaryGuardianRelationship: z.string().min(1, { message: "Primary guardian relationship is required!" }),
  primaryGuardianPhone: z.string().min(1, { message: "Primary guardian phone is required!" }),
  primaryGuardianEmail: z.string().email().optional(), // Email optional as per image doesn't show * for it
  primaryGuardianOccupation: z.string().min(1, { message: "Primary guardian occupation is required!" }),
  primaryGuardianAddress: z.string().min(1, { message: "Primary guardian address is required!" }),
  secondaryGuardianName: z.string().optional(),
  secondaryGuardianPhone: z.string().optional(),
  secondaryGuardianRelationship: z.string().optional(),
  secondaryGuardianOccupation: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const GuardianForm = ({ onNext, onPrevious, data }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      primaryGuardianName: data?.primaryGuardianName || '',
      primaryGuardianRelationship: data?.primaryGuardianRelationship || '',
      primaryGuardianPhone: data?.primaryGuardianPhone || '',
      primaryGuardianEmail: data?.primaryGuardianEmail || '',
      primaryGuardianOccupation: data?.primaryGuardianOccupation || '',
      primaryGuardianAddress: data?.primaryGuardianAddress || '',
      secondaryGuardianName: data?.secondaryGuardianName || '',
      secondaryGuardianPhone: data?.secondaryGuardianPhone || '',
      secondaryGuardianRelationship: data?.secondaryGuardianRelationship || '',
      secondaryGuardianOccupation: data?.secondaryGuardianOccupation || '',
    },
  });

  const handleNextClick = handleSubmit((formData) => {
    onNext(formData);
  });

  const handlePreviousClick = () => {
    onPrevious();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleNextClick}>
      <h2 className="text-xl font-semibold text-gray-800">Guardian Information</h2>

      {/* Primary Guardian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="text-lg font-medium text-gray-700 col-span-full">Primary Guardian</h3>
        <InputField
          label="Full Name"
          name="primaryGuardianName"
          defaultValue={data?.primaryGuardianName}
          register={register}
          error={errors.primaryGuardianName}
        />
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">Relationship<span className="text-red-500">*</span></label>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            {...register("primaryGuardianRelationship")}
            defaultValue={data?.primaryGuardianRelationship}
          >
            <option value="">Select Relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Other">Other</option>
          </select>
          {errors.primaryGuardianRelationship?.message && (
            <p className="text-xs text-red-500">
              {errors.primaryGuardianRelationship.message.toString()}
            </p>
          )}
        </div>
         <InputField
          label="Phone Number"
          name="primaryGuardianPhone"
          defaultValue={data?.primaryGuardianPhone}
          register={register}
          error={errors.primaryGuardianPhone}
        />
         <InputField
          label="Email (optional)"
          name="primaryGuardianEmail"
          defaultValue={data?.primaryGuardianEmail}
          register={register}
          error={errors.primaryGuardianEmail}
          required={false}
          type="email"
        />
        <InputField
          label="Occupation"
          name="primaryGuardianOccupation"
          defaultValue={data?.primaryGuardianOccupation}
          register={register}
          error={errors.primaryGuardianOccupation}
        />
        <InputField
          label="Address"
          name="primaryGuardianAddress"
          defaultValue={data?.primaryGuardianAddress}
          register={register}
          error={errors.primaryGuardianAddress}
          className="col-span-full"
        />
      </div>

      {/* Secondary Guardian (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
         <h3 className="text-lg font-medium text-gray-700 col-span-full">Secondary Guardian (Optional)</h3>
        <InputField
          label="Full Name"
          name="secondaryGuardianName"
          defaultValue={data?.secondaryGuardianName}
          register={register}
          error={errors.secondaryGuardianName}
          required={false}
        />
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">Relationship</label>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            {...register("secondaryGuardianRelationship")}
            defaultValue={data?.secondaryGuardianRelationship}
          >
             <option value="">Select Relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Other">Other</option>
          </select>
          {errors.secondaryGuardianRelationship?.message && (
            <p className="text-xs text-red-500">
              {errors.secondaryGuardianRelationship.message.toString()}
            </p>
          )}
        </div>
         <InputField
          label="Phone Number"
          name="secondaryGuardianPhone"
          defaultValue={data?.secondaryGuardianPhone}
          register={register}
          error={errors.secondaryGuardianPhone}
          required={false}
        />
        <InputField
          label="Occupation"
          name="secondaryGuardianOccupation"
          defaultValue={data?.secondaryGuardianOccupation}
          register={register}
          error={errors.secondaryGuardianOccupation}
          required={false}
        />
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
    </form>
  );
};

export default GuardianForm; 