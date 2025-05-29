import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Boxes,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSigningUp(true);
    try {
      const res = await instance.post("/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gray-100 p-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Experience the Demo
        </h2>
        <p className="text-lg text-gray-600 max-w-md text-center">
          See how our product works and discover features that make your
          workflow faster and smarter.
        </p>
      </div>

      {/* right side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
        {/* LOGO */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm p-10">
          <CardHeader className="text-center pb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Create your account
            </CardTitle>
            <p className="text-gray-600">
              Start creating amazing product demos today
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
              <div className="form-control">
                <Label>Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10 rounded"
                  />
                </div>
              </div>

              <div className="form-control">
                <Label>Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <Input
                    type="email"
                    className="pl-10 rounded"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                <Label>Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 rounded"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <Button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 py-3 px-4 flex items-center bg-white border border-l-0 hover:bg-white focus:bg-white focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-black" />
                    ) : (
                      <Eye className="size-5 text-black" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="btn btn-primary w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700  text-white rounded p-2"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Loading...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 "
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
