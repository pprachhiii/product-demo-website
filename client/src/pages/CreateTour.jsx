import { useState } from "react";
import instance from "../utils/axios";
import toast from "react-hot-toast";

export default function CreateTour() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([{ image: "", description: "" }]);
  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };
  const addStep = () => {
    setSteps([...steps, { image: "", description: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || steps.length === 0) {
      return toast.error("Title and at least one step are required.");
    }
    try {
      const token = localStorage.getItem("token");
      const res = await instance.post(
        "/api/tours",
        { title, steps },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Tour saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save tour");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Create New Tour</h1>

      <input
        type="text"
        placeholder="Tour Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {steps.map((step, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <input
            type="text"
            placeholder="Image URL or Path"
            value={step.image}
            onChange={(e) => handleStepChange(index, "image", e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Step Description"
            value={step.description}
            onChange={(e) =>
              handleStepChange(index, "description", e.target.value)
            }
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
      ))}

      <button
        onClick={addStep}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        + Add Step
      </button>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Save Tour
      </button>
    </div>
  );
}
