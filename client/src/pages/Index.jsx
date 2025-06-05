import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navbar";

const Index = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const tourId = "683c9d2bd56dc5e9fd449332";

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

            {/* Watch Demo button navigates to preview page */}
            <Link to={`/dashboard`}>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Interactive Demo Preview clickable box */}
          <Link to={`/dashboard`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 border cursor-pointer max-w-4xl mx-auto animate-fade-in">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Interactive Demo Preview
                  </p>
                </div>
              </div>
            </div>
          </Link>
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
                link: "/editor",
              },
              {
                icon: <Share className="w-8 h-8 text-purple-600" />,
                bg: "bg-purple-100",
                title: "Easy Sharing",
                desc: "Share your demos with unique links, embed them anywhere, or keep them private for internal use.",
                link: "/dashboard",
              },
              {
                icon: <Eye className="w-8 h-8 text-green-600" />,
                bg: "bg-green-100",
                title: "Analytics",
                desc: "Track views, engagement, and conversion rates to optimize your product demonstrations.",
                link: "/dashboard",
              },
            ].map(({ icon, bg, title, desc, link }, idx) => (
              <Link to={link} key={idx} className="block">
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
              </Link>
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

          {/* Demo Preview Area clickable */}
          <Link to={`/dashboard`}>
            <div className="bg-white rounded-2xl p-8 shadow-xl cursor-pointer">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Play className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-gray-600">Demo Preview Area</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
