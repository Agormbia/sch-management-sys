"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  sex: z.enum(["male", "female"], { message: "Gender is required!" }),
  birthday: z.date({ message: "Date of Birth is required!" }),
  placeOfBirth: z.string().min(1, { message: "Place of Birth is required!" }),
  nationality: z.string().min(1, { message: "Nationality is required!" }),
  religion: z.string().min(1, { message: "Religion is required!" }),
  hometown: z.string().min(1, { message: "Hometown is required!" }),
  homeAddress: z.string().min(1, { message: "Home Address is required!" }),
  gpsAddress: z.string().optional(), // GPS/Digital Address is optional
});

type Inputs = z.infer<typeof schema>;

const PersonalInfoForm = ({
  type,
  data,
  onNext,
}: {
  type: "create" | "update";
  data?: any;
  onNext: (data: Inputs) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        sex: data?.sex || 'male', // Assuming a default sex
        birthday: data?.birthday ? new Date(data.birthday) : undefined, // Handle date conversion if necessary
        placeOfBirth: data?.placeOfBirth || '',
        nationality: data?.nationality || '',
        religion: data?.religion || '',
        hometown: data?.hometown || '',
        homeAddress: data?.homeAddress || '',
        gpsAddress: data?.gpsAddress || '',
    }
  });

  const onSubmit = handleSubmit((data) => {
    onNext(data);
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
          placeholder="First Name"
        />
         <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
           placeholder="Last Name"
        />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">Gender<span className="text-red-500">*</span></label>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-500">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Date of Birth"
          name="birthday"
          defaultValue={data?.birthday}
          register={register}
          error={errors.birthday}
          type="date"
        />
        <InputField
          label="Place of Birth"
          name="placeOfBirth"
          defaultValue={data?.placeOfBirth}
          register={register}
          error={errors.placeOfBirth}
        />
        <InputField
          label="Nationality"
          name="nationality"
          defaultValue={data?.nationality}
          register={register}
          error={errors.nationality}
        />
        <InputField
          label="Religion"
          name="religion"
          defaultValue={data?.religion}
          register={register}
          error={errors.religion}
        />
        <InputField
          label="Hometown"
          name="hometown"
          defaultValue={data?.hometown}
          register={register}
          error={errors.hometown}
        />
        <InputField
          label="Home Address"
          name="homeAddress"
          defaultValue={data?.homeAddress}
          register={register}
          error={errors.homeAddress}
        />
        <InputField
          label="GPS/Digital Address (optional)"
          name="gpsAddress"
          defaultValue={data?.gpsAddress}
          register={register}
          error={errors.gpsAddress}
          required={false} // Explicitly mark as not required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 self-end">
        Next
      </button>
    </form>
  );
};

export default PersonalInfoForm; 