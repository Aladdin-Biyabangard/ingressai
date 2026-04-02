import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Github, Chrome, ArrowRight, Eye, EyeOff } from "lucide-react";
import GitLabIcon from "@/components/icons/GitLabIcon";
import ChatButton from "@/components/chat/ChatButton";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate("/dashboard");
  };

  const handleGuest = () => {
    navigate("/dashboard");
  };

  const handleOAuth = (provider: string) => {
    console.log(`OAuth login with ${provider}`);
    // In production, redirect to OAuth provider
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary-foreground animate-float" />
          <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-primary-foreground animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-primary-foreground animate-float" style={{ animationDelay: "4s" }} />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/20 mb-8">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            LearnHub
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Your gateway to knowledge. Access courses, track progress, and connect with a community of learners.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">LearnHub</span>
          </div>

          <Card className="border-0 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-1 pb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isSignUp
                  ? "Sign up to start your learning journey"
                  : "Sign in to continue your learning journey"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* OAuth buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => handleOAuth("google")}
                >
                  <Chrome className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => handleOAuth("github")}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => handleOAuth("gitlab")}
                >
                  <GitLabIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  or continue with email
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 gradient-primary font-semibold text-primary-foreground">
                  {isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>

              <button
                onClick={handleGuest}
                className="w-full flex items-center justify-center gap-2 h-11 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-dashed border-border hover:border-primary/40 hover:bg-primary/5"
              >
                Continue as Guest
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-semibold text-primary hover:underline"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatButton />
    </div>
  );
};

export default Login;
