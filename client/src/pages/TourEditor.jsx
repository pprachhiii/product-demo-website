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

const TourEditor = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const tourId = id || null;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const fileInputRef = useRef(null);
  const [tourDescription, setTourDescription] = useState("");

  useEffect(() => {
    if (isNew) {
      const fallbackStep = {
        id: Date.now().toString(),
        title: "Welcome Step",
        description: "Introduce users to your product",
        image: null,
        annotations: [],
      };
      setTitle("");
      setDescription("");
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
          if (stepData.length === 0) {
            stepData = [
              {
                id: Date.now().toString(),
                title: "Welcome Step",
                description: "Introduce users to your product",
                image: null,
                annotations: [],
              },
            ];
          }

          // stepData = data;
        }

        const normalizedSteps = stepData.map((step) => ({
          id: step._id || step.id || Date.now().toString(),
          ...step,
        }));

        setTitle(tourData.title);
        setDescription(tourData.description);
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
          annotations: [],
        };
        setTitle("New Product Demo");
        setDescription("");
        setSteps([fallbackStep]);
        setSelectedStep(fallbackStep.id);
      } finally {
        setLoading(false);
      }
    }

    fetchTour();
  }, [tourId, isNew]);

  const updateStep = (id, changes) => {
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
      annotations: [],
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
      const cleanedSteps = steps.map((step) => ({ ...step }));

      if (isNew) {
        const response = await instance.post(`/tours`, {
          title,
          description: tourDescription,
          steps: cleanedSteps,
        });
        alert("Tour created successfully!");
        const newId = response.data.id || response.data._id;
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

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateStep(selectedStep, { image: url });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        setChunks((prev) => [...prev, e.data]);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        updateStep(selectedStep, { image: url });
        setChunks([]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
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
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium truncate">
                          {step.title}
                        </span>
                      </div>
                      {steps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStep(step.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <div className="bg-gray-100 h-16 rounded mt-2 flex items-center justify-center">
                      {step.image ? (
                        step.image.endsWith(".webm") ? (
                          <video
                            src={step.image}
                            controls
                            className="h-full object-cover rounded"
                          />
                        ) : (
                          <img
                            src={step.image}
                            alt="Step preview"
                            className="h-full object-cover rounded"
                          />
                        )
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 flex flex-col bg-gray-100">
            <div className="flex-1 p-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      Step {steps.findIndex((s) => s.id === selectedStep) + 1}:{" "}
                      {currentStep?.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          fileInputRef.current && fileInputRef.current.click()
                        }
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative">
                    {currentStep?.image ? (
                      currentStep.image.endsWith(".webm") ? (
                        <video
                          src={currentStep.image}
                          controls
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      ) : (
                        <img
                          src={currentStep.image}
                          alt="Step content"
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      )
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Upload a screenshot or image
                        </p>
                        <p className="text-sm text-gray-500">
                          Or use the screen recorder to capture your workflow
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <h3 className="font-semibold mb-4">Step Properties</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="step-title">Step Title</Label>
                <Input
                  id="step-title"
                  value={currentStep?.title || ""}
                  onChange={(e) =>
                    updateStep(selectedStep, { title: e.target.value })
                  }
                  placeholder="Enter step title"
                />
              </div>

              <div>
                <Label htmlFor="step-description">Description</Label>
                <Textarea
                  id="step-description"
                  value={currentStep?.description || ""}
                  onChange={(e) =>
                    updateStep(selectedStep, { description: e.target.value })
                  }
                  placeholder="Describe what happens in this step"
                  rows={3}
                />
              </div>

              <div>
                <Label>Tour Settings</Label>
                <div className="mt-2 space-y-3">
                  <div>
                    <Label htmlFor="tour-description">Tour Description</Label>
                    <Textarea
                      id="tour-description"
                      value={tourDescription}
                      onChange={(e) => setTourDescription(e.target.value)}
                      placeholder="Describe your product demo"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourEditor;
