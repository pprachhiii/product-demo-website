import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navbar";
import { Save, Play, Plus, X, Upload, Video, Eye } from "lucide-react";
import instance from "../utils/axios";

const TourEditor = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const tourId = id || null;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [tourDescription, setTourDescription] = useState("");
  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isNew) {
      const fallbackStep = {
        id: Date.now().toString(),
        title: "Welcome Step",
        description: "Introduce users to your product",
        image: null,
      };
      setTitle("");
      setTourDescription("");
      setSteps([fallbackStep]);
      setSelectedStep(fallbackStep.id);
      setLoading(false);
      return;
    }

    if (!tourId) {
      console.error("Tour ID is missing.");
      setLoading(false);
      return;
    }

    async function fetchTour() {
      try {
        const { data: tourData } = await instance.get(`/tours/${tourId}`);

        let stepData = tourData.steps || [];
        if (stepData.length === 0) {
          stepData = [
            {
              _id: Date.now().toString(),
              title: "Welcome Step",
              description: "Introduce users to your product",
              image: null,
            },
          ];
        }

        const normalizedSteps = stepData.map((step) => ({
          id: step._id || step.id || Date.now().toString(),
          ...step,
        }));

        setTitle(tourData.title || "");
        setTourDescription(tourData.description || "");
        setSteps(normalizedSteps);
        setSelectedStep(normalizedSteps[0]?.id || null);
      } catch (error) {
        console.error("Error fetching tour:", error);
        const fallbackStep = {
          id: Date.now().toString(),
          title: "Welcome Step",
          description: "Introduce users to your product",
          image: null,
        };
        setTitle("New Product Demo");
        setTourDescription("");
        setSteps([fallbackStep]);
        setSelectedStep(fallbackStep.id);
      } finally {
        setLoading(false);
      }
    }

    fetchTour();
  }, [tourId, isNew]);

  const updateStep = (id, changes) => {
    if (!id) return;
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...changes } : step))
    );
  };

  const addStep = () => {
    const newStep = {
      id: Date.now().toString(),
      title: `Step ${steps.length + 1}`,
      description: "",
      image: null,
    };
    setSteps([...steps, newStep]);
    setSelectedStep(newStep.id);
  };

  const deleteStep = (stepId) => {
    if (steps.length <= 1) return;

    const filtered = steps.filter((step) => step.id !== stepId);
    setSteps(filtered);

    if (selectedStep === stepId) {
      setSelectedStep(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const saveTour = async () => {
    try {
      const cleanedSteps = steps.map((step) => {
        const { id, ...rest } = step;
        return { _id: id, ...rest };
      });

      console.log("Saving tour with:", {
        title,
        description: tourDescription,
        steps: cleanedSteps,
      });

      if (isNew) {
        const response = await instance.post(`/tours`, {
          title,
          description: tourDescription,
          steps: cleanedSteps,
        });
        alert("Tour created successfully!");
        const newId = response.data._id || response.data.id;
        navigate(`/editor/${newId}`);
      } else {
        await instance.put(`/tours/${tourId}`, {
          title,
          description: tourDescription,
          steps: cleanedSteps,
        });
        alert("Tour saved successfully!");
      }
    } catch (error) {
      console.error("Error saving tour:", error);
      alert("Error saving tour");
    }
  };

  // --- NEW: Real file upload ---
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file && selectedStep) {
      try {
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        // Adjust this endpoint if needed
        const response = await instance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const uploadedUrl = response.data.url; // Your backend must return this URL

        updateStep(selectedStep, { image: uploadedUrl });
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed. Please try again.");
      } finally {
        setUploading(false);
        // Reset file input so same file can be uploaded again if needed
        event.target.value = "";
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const chunks = [];

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });

        // Upload the recorded video blob
        try {
          setUploading(true);
          const formData = new FormData();
          formData.append("file", blob, "recording.webm");

          const response = await instance.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const uploadedUrl = response.data.url;

          updateStep(selectedStep, { image: uploadedUrl });
        } catch (uploadError) {
          console.error("Upload failed:", uploadError);
          alert("Recording upload failed.");
        } finally {
          setUploading(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  if (loading) return <div>Loading...</div>;

  const currentStep = steps.find((step) => step.id === selectedStep);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold border-0 bg-transparent p-0 focus-visible:ring-0 max-w-md"
                placeholder="Tour Title"
              />
              <Badge variant="secondary">{isNew ? "Draft" : "Editing"}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (tourId) {
                    navigate(`/preview/${tourId}`);
                  } else {
                    alert("Please save the tour before previewing");
                  }
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={saveTour}
                className="bg-green-600 text-white"
                disabled={uploading}
                title={uploading ? "Wait for upload to finish" : ""}
              >
                <Save className="w-4 h-4 mr-2" />
                {isNew ? "Create" : "Save"}
              </Button>
              <Button size="sm" className="bg-blue-600 text-white">
                <Play className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-140px)]">
          {/* Sidebar (LEFT) */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Steps</h3>
                <Button
                  size="sm"
                  onClick={addStep}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={uploading}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={toggleRecording}
                  disabled={uploading}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {steps.map((step, index) => (
                <Card
                  key={step.id}
                  className={`cursor-pointer mb-3 ${
                    selectedStep === step.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedStep(step.id)}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">{step.title}</CardTitle>
                      <p className="text-xs text-gray-600 truncate max-w-xs">
                        {step.description || "No description"}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStep(step.id);
                      }}
                      disabled={steps.length <= 1 || uploading}
                      title={
                        steps.length <= 1
                          ? "At least one step required"
                          : "Delete Step"
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Editor (RIGHT) */}
          <div className="flex-1 p-6 overflow-y-auto">
            {!currentStep ? (
              <div>Select a step to edit</div>
            ) : (
              <>
                <Input
                  placeholder="Step Title"
                  value={currentStep.title}
                  onChange={(e) =>
                    updateStep(currentStep.id, { title: e.target.value })
                  }
                  className="mb-4 text-lg"
                />
                <Textarea
                  placeholder="Step Description"
                  value={currentStep.description}
                  onChange={(e) =>
                    updateStep(currentStep.id, { description: e.target.value })
                  }
                  className="mb-4 h-32"
                />

                {/* Image Section */}
                <div className="mb-4">
                  {currentStep.image ? (
                    <img
                      src={currentStep.image}
                      alt="Step"
                      className="max-w-full max-h-64 object-contain"
                    />
                  ) : (
                    <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500">
                      No image uploaded
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*,video/*"
                  disabled={uploading}
                />
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-4"
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Image/Video"}
                </Button>
              </>
            )}

            <div className="mt-8">
              <Label>Tour Description</Label>
              <Textarea
                placeholder="Enter tour description"
                value={tourDescription}
                onChange={(e) => setTourDescription(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourEditor;
