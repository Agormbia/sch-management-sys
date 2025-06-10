"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: () => <div className="p-4">Student form coming soon...</div>,
  subject: () => <div className="p-4">Subject form coming soon...</div>,
  class: () => <div className="p-4">Class form coming soon...</div>,
  result: () => <div className="p-4">Result form coming soon...</div>,
  attendance: () => <div className="p-4">Attendance form coming soon...</div>,
  event: () => <div className="p-4">Event form coming soon...</div>,
  announcement: () => <div className="p-4">Announcement form coming soon...</div>
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: keyof typeof forms;
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            console.log(`Attempting to delete ${table} with id:`, id);
            const response = await fetch(`/api/${table}/${id}`, {
              method: 'DELETE',
            });

            const data = await response.json();
            console.log('Delete response:', data);

            if (!response.ok) {
              throw new Error(data.error || `Failed to delete ${table}`);
            }

            // Close the modal
            setOpen(false);
            
            // Refresh the page to update the list
            window.location.href = `/list/${table}s?refresh=true`;
          } catch (error) {
            console.error(`Error deleting ${table}:`, error);
            alert(`Failed to delete ${table}. Please try again.`);
          }
        }} 
        className="p-4 flex flex-col gap-4"
      >
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button 
          type="submit"
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-red-800 transition-colors"
        >
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table] ? forms[table](type, data) : <div className="p-4">Form not found for {table}</div>
    ) : (
      "Invalid form type"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[100%] md:w-[98%] lg:w-[95%] xl:w-[90%] 2xl:w-[80%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
