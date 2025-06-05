import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Play, Pause, Share, X } from "lucide-react";
import instance from "../utils/axios.js";
import confetti from "canvas-confetti";

const TourPreview = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [error, setError] = useState(null);

  const fetchTour = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await instance.get(`/tours/${id}`);
      const tourData = res.data;
      if (!tourData.steps || tourData.steps.length === 0) {
        setTour({ ...tourData, steps: [] });
        return;
      }
      setTour(tourData);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load tour"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || !tour || !tour.steps || !tour.steps[currentStep]) return;

    const duration = tour.steps[currentStep].duration ?? 3000;
    if (currentStep >= tour.steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((step) => Math.min(step + 1, tour.steps.length - 1));
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, tour]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!tour || !tour.steps) return;
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.key === "ArrowLeft") {
        setCurrentStep((step) => Math.max(step - 1, 0));
        setIsPlaying(false);
      } else if (e.key === "ArrowRight") {
        setCurrentStep((step) => Math.min(step + 1, tour.steps.length - 1));
        setIsPlaying(false);
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setIsPlaying((playing) => !playing);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tour]);

  if (loading) return <div>Loading tour...</div>;

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
        <Button onClick={fetchTour} className="mt-4">
          Retry
        </Button>
      </div>
    );

  if (!tour) return <div>No tour data available</div>;

  if (!tour.steps || tour.steps.length === 0)
    return (
      <div className="p-6 text-center text-white">
        No steps have been added, so this tour has no content to preview.
      </div>
    );

  const currentStepData = tour.steps[currentStep];

  const prevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStep === tour.steps.length - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, tour.steps.length - 1));
    setIsPlaying(false);
  };

  const toggleAutoplay = () => {
    setIsPlaying((playing) => !playing);
  };

  const getStepGradient = (stepIndex) => {
    const gradients = [
      "from-indigo-900 via-purple-900 to-pink-900",
      "from-green-900 via-emerald-900 to-teal-900",
      "from-yellow-900 via-orange-900 to-red-900",
      "from-sky-900 via-blue-900 to-indigo-900",
    ];
    return gradients[stepIndex % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(0,0,0,1))]"></div>

      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">
              {tour.title || "Untitled Tour"}
            </h1>
            <p className="text-gray-400 text-sm">
              by {tour.author || "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShare(true)}
            className="text-white hover:bg-white/10"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Badge
            variant="secondary"
            className="bg-white/10 text-white border-white/20"
          >
            {currentStep + 1} of {tour.steps.length}
          </Badge>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-6">
        <div className="max-w-4xl w-full">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl">
            <CardContent className="p-0">
              <div
                className={`h-96 bg-gradient-to-br ${getStepGradient(
                  currentStep
                )} relative rounded-t-lg overflow-hidden`}
              >
                {currentStepData.image?.endsWith(".webm") ? (
                  <video
                    src={currentStepData.image}
                    autoPlay
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                ) : currentStepData.image ? (
                  <img
                    src={currentStepData.image}
                    alt={currentStepData.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                ) : (
                  <p className="text-lg opacity-80 z-10 relative text-center pt-40">
                    No media available
                  </p>
                )}

                <div className="absolute inset-0 bg-black/30 z-10"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 pointer-events-none">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">
                      {currentStep + 1}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-black/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-300 ease-linear"
                      style={{
                        width: `${
                          ((currentStep + 1) / tour.steps.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {currentStepData.title}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {currentStepData.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      onClick={toggleAutoplay}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {isPlaying ? "Pause" : "Auto Play"}
                    </Button>
                  </div>

                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    {currentStep === tour.steps.length - 1
                      ? "Complete"
                      : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-6">
        <div className="flex gap-3">
          {tour.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                setIsPlaying(false);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-white scale-125"
                  : index < currentStep
                  ? "bg-white/70"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 bg-white text-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Share Demo</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShare(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Share Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/tours/${id}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/tours/${id}`
                        )
                      }
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Share on social media
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            "Check out this interactive tour!"
                          )}&url=${encodeURIComponent(
                            `${window.location.origin}/tours/${id}`
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      Twitter
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            `${window.location.origin}/tours/${id}`
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      LinkedIn
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `mailto:?subject=Check out this tour&body=${encodeURIComponent(
                            `Here's a tour you might like: ${window.location.origin}/tours/${id}`
                          )}`
                        )
                      }
                    >
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TourPreview;
