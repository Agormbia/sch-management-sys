"use client";

interface FormProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  data: any;
}

const OtherInfoForm = ({ onNext, onPrevious, data }: FormProps) => {
  // In a real scenario, you would have state and form handling here
  const handleSubmitClick = () => {
    // Collect data from this form section and pass to onNext (which is handleSubmit in NewStudentAdmissionForm)
    onNext({}); // Passing empty object for now, replace with actual form data
  };

  const handlePreviousClick = () => {
    onPrevious();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Information</h2>
      <p>Other information form coming soon...</p>
      {/* Add your form fields here */}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handlePreviousClick}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmitClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default OtherInfoForm; 