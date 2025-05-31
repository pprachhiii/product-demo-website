import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Play, Pause, Share, X } from "lucide-react";
import instance from "../utils/axios.js";

const TourPreview = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTour() {
      try {
        setLoading(true);
        const res = await instance.get(`/tours/${id}`);
        setTour(res.data);
        setCurrentStepIndex(0);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [id]);

  useEffect(() => {
    if (!isPlaying || !tour) return;

    if (currentStepIndex >= tour.steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((idx) => idx + 1);
    }, tour.steps[currentStepIndex].duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, tour]);

  if (loading) return <div>Loading tour...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tour) return <div>No tour data available</div>;

  const step = tour.steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col max-w-4xl mx-auto relative">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{tour.title}</h1>
        <Badge variant="secondary">By {tour.author}</Badge>
      </header>

      <Card className="flex-1 bg-gray-800">
        <CardHeader>
          <CardTitle>
            Step {currentStepIndex + 1} of {tour.steps.length}: {step.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <p className="mb-4">{step.description}</p>
          <p className="italic text-sm text-gray-500">
            Duration: {step.duration / 1000}s
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Prev
        </Button>
        <Button variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? (
            <>
              <Pause className="mr-2 w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 w-4 h-4" /> Play
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setCurrentStepIndex((i) => Math.min(i + 1, tour.steps.length - 1))
          }
          disabled={currentStepIndex === tour.steps.length - 1}
        >
          Next <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={() => setShowShareModal(true)}>
          <Share className="mr-2 w-4 h-4" /> Share
        </Button>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-md w-96 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Share This Tour</h2>
            <p className="mb-2">Copy the link below to share:</p>
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/tour/${id}`}
              className="w-full bg-gray-700 text-white p-2 rounded"
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TourPreview;
