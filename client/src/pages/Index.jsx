import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Play,
  Share,
  Edit,
  Eye,
  Zap,
  Users,
  Globe,
  X,
  ArrowLeft,
  Pause,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navbar";
import instance from "../utils/axios.js";

const demoFallbackData = {
  title: "Demo Tour (This is just demo data)",
  author: "Demo Author",
  steps: [
    {
      title: "Welcome Step",
      description: "This is the first step of the demo tour.",
      duration: 3000,
      image: null,
    },
    {
      title: "Second Step",
      description: "Here is some more info in the demo.",
      duration: 3000,
      image: null,
    },
  ],
};

const getStepGradient = (step) => {
  const gradients = [
    "from-blue-600 to-purple-600",
    "from-purple-600 to-pink-600",
    "from-pink-600 to-red-600",
  ];
  return gradients[step % gradients.length];
};

const Index = () => {
  const [demo, setDemo] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // Demo steps load effect — uncomment to fetch from API if available
  // useEffect(() => {
  //   const fetchDemo = async () => {
  //     try {
  //       const res = await instance.get("/api/tours/demo");
  //       let tourData = res.data;
  //       // fallback steps
  //       if (!tourData.steps || tourData.steps.length === 0) {
  //         tourData.steps = demoFallbackData.steps;
  //       }
  //       setDemo(tourData);
  //     } catch (err) {
  //       console.error("Failed to fetch demo:", err);
  //       setDemo(demoFallbackData);
  //     }
  //   };
  //   fetchDemo();
  // }, []);

  // For demo purpose, directly set fallback data here:
  useEffect(() => {
    setDemo(demoFallbackData);
  }, []);

  // Autoplay effect for demo tour steps
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= demo?.steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, demo.steps.length - 1));
    }, demo.steps[currentStep].duration || 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, demo]);

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, demo.steps.length - 1));
  };

  const toggleAutoplay = () => {
    setIsPlaying((prev) => !prev);
  };

  const getStartRoute = () => (isAuthenticated ? "/editor" : "/register");

  // If no demo loaded, don't render modal content
  if (!demo) return null;

  const currentStepData = demo.steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8 animate-fade-in cursor-pointer select-none">
            <Zap className="w-4 h-4 mr-2" />
            Create Interactive Product Demos
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            Build. Share. Convert.
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            Create stunning interactive product tours that engage your audience
            and drive conversions. Record, edit, and share your demos with the
            world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Link to={isAuthenticated ? "/editor" : "/login"}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Creating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            {/* Watch Demo button - opens modal */}
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              onClick={() => {
                setShowDemoModal(true);
                setCurrentStep(0);
                setIsPlaying(false);
              }}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          <div
            className="relative max-w-4xl mx-auto animate-fade-in cursor-pointer"
            onClick={() => {
              setShowDemoModal(true);
              setCurrentStep(0);
              setIsPlaying(false);
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Interactive Demo Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything you need to create amazing demos
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Edit className="w-8 h-8 text-blue-600" />,
                bg: "bg-blue-100",
                title: "Visual Editor",
                desc: "Intuitive drag-and-drop interface to create professional product tours with annotations and highlights.",
              },
              {
                icon: <Share className="w-8 h-8 text-purple-600" />,
                bg: "bg-purple-100",
                title: "Easy Sharing",
                desc: "Share your demos with unique links, embed them anywhere, or keep them private for internal use.",
              },
              {
                icon: <Eye className="w-8 h-8 text-green-600" />,
                bg: "bg-green-100",
                title: "Analytics",
                desc: "Track views, engagement, and conversion rates to optimize your product demonstrations.",
              },
            ].map(({ icon, bg, title, desc }, idx) => (
              <Card
                key={idx}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`${bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Built for modern teams</h3>
            <div className="space-y-6">
              {[
                {
                  icon: <Users className="w-5 h-5 text-blue-600" />,
                  bg: "bg-blue-100",
                  title: "Collaborative Editing",
                  desc: "Work together with your team to create the perfect demo experience.",
                },
                {
                  icon: <Globe className="w-5 h-5 text-purple-600" />,
                  bg: "bg-purple-100",
                  title: "Global CDN",
                  desc: "Fast loading times worldwide with our optimized content delivery network.",
                },
                {
                  icon: <Zap className="w-5 h-5 text-green-600" />,
                  bg: "bg-green-100",
                  title: "Lightning Fast",
                  desc: "Optimized for speed and performance across all devices and browsers.",
                },
              ].map(({ icon, bg, title, desc }, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    {icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{title}</h4>
                    <p className="text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo preview area clickable */}
          <div
            className="bg-white rounded-2xl p-8 shadow-xl cursor-pointer"
            onClick={() => {
              setShowDemoModal(true);
              setCurrentStep(0);
              setIsPlaying(false);
            }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Play className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-gray-600">Demo Preview Area</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to create your first demo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teams already using our platform to showcase their
            products.
          </p>
          <Link to={getStartRoute()}>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DemoFlow
          </div>
          <p className="text-gray-400 mb-4">
            The fastest way to build and share product demos.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link to="/about" className="hover:text-white transition">
              About
            </Link>
            <Link to="/pricing" className="hover:text-white transition">
              Pricing
            </Link>
            <Link to="/support" className="hover:text-white transition">
              Support
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              Terms
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} DemoFlow. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Demo Preview Modal */}
      {showDemoModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDemoModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
              aria-label="Close demo preview"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              {demo.title}{" "}
              <span className="text-sm text-gray-400 ml-2">
                (This is just demo data)
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-8">By {demo.author}</p>

            {/* Step progress bar */}
            <div className="flex items-center mb-6 space-x-2">
              {demo.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-2 rounded-full cursor-pointer transition-colors ${
                    idx === currentStep
                      ? `bg-gradient-to-r ${getStepGradient(idx)}`
                      : "bg-gray-300"
                  }`}
                  onClick={() => {
                    setCurrentStep(idx);
                    setIsPlaying(false);
                  }}
                />
              ))}
            </div>

            {/* Step Content */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {currentStepData.description}
              </p>
              {currentStepData.image && (
                <img
                  src={currentStepData.image}
                  alt={currentStepData.title}
                  className="mx-auto rounded-lg max-h-48"
                />
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6 mt-6">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                aria-label="Previous step"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                onClick={toggleAutoplay}
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                aria-label={isPlaying ? "Pause tour" : "Play tour"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={nextStep}
                disabled={currentStep === demo.steps.length - 1}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                aria-label="Next step"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
