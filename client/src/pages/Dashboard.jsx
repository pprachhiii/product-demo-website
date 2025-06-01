// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Edit, Share, Eye } from "lucide-react";
import instance from "../utils/axios";

const Dashboard = () => {
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await instance.get("/tour", { withCredentials: true });
        setTours(res.data);
      } catch (error) {
        console.error(
          "Error fetching tours:",
          error?.response?.data?.message || error.message
        );
      } finally {
        setLoadingTours(false);
      }
    };
    fetchTours();
  }, []);

  const getThumbnailGradient = (type) => {
    const gradients = {
      "gradient-1": "from-blue-400 to-purple-600",
      "gradient-2": "from-green-400 to-blue-600",
      "gradient-3": "from-pink-400 to-red-600",
    };
    return gradients[type] || "from-gray-400 to-gray-600";
  };

  const totalDemos = tours.length;
  const totalViews = tours.reduce((acc, t) => acc + (t.views || 0), 0);
  const published = tours.filter((t) => t.status === "published").length;
  const drafts = tours.filter((t) => t.status === "draft").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Demos</h1>
            <p className="text-gray-600">
              Create and manage your interactive product tours
            </p>
          </div>
          <Link to="/editor">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration">
              <Plus className="w-4 h-4 mr-2" /> Create New Demo
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Demos</p>
                <p className="text-2xl font-bold">
                  {loadingTours ? "..." : totalDemos}
                </p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-2xl font-bold">
                  {loadingTours ? "..." : totalViews.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-2xl font-bold">
                  {loadingTours ? "..." : published}
                </p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Share className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Drafts</p>
                <p className="text-2xl font-bold">
                  {loadingTours ? "..." : drafts}
                </p>
              </div>
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tours */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingTours ? (
            <p>Loading tours...</p>
          ) : tours.length ? (
            tours.map((tour) => (
              <Card key={tour._id} className="hover:shadow-xl transition">
                <CardHeader className="p-0">
                  <div
                    className={`h-48 bg-gradient-to-br ${getThumbnailGradient(
                      tour.thumbnail
                    )} rounded-t-lg relative flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <Play className="w-12 h-12 text-white relative z-10" />
                    <Badge
                      className={`absolute top-4 left-4 ${
                        tour.status === "published"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {tour.status}
                    </Badge>
                    <Badge className="absolute top-4 right-4 bg-white/90 text-gray-700">
                      {tour.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{tour.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {tour.description}
                  </p>
                  <div className="text-sm text-gray-500 flex justify-between mb-4">
                    <span>
                      <Eye className="w-4 h-4 inline mr-1" />
                      {(tour.views || 0).toLocaleString()} views
                    </span>
                    <span>{new Date(tour.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/tour/${tour._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Play className="w-4 h-4 mr-2" /> Preview
                      </Button>
                    </Link>
                    <Link to={`/editor?id=${tour._id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No demos yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first interactive product demo to get started.
              </p>
              <Link to="/editor">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Create Your First Demo
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
