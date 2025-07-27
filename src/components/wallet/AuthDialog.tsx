import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, UserPlus } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: "login" | "signup";
  setActiveTab: (tab: "login" | "signup") => void;
  onSuccess: (isAdmin?: boolean) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
  activeTab,
  setActiveTab,
  onSuccess,
}) => {
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [signupEmail, setSignupEmail] = React.useState("");
  const [signupPassword, setSignupPassword] = React.useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = React.useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    //Check for admin credentials
    const isAdmin = loginEmail === "admin" && loginPassword === "admin@123";

    if (isAdmin) {
      toast.success("Successfully logged in as Admin");
      onOpenChange(false);
      onSuccess(true);
    } else {
      // This would be replaced with actual authentication logic
      toast.success("Successfully logged in");
      onOpenChange(false);
      onSuccess(false);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupConfirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // This would be replaced with actual registration logic
    toast.success("Account created successfully");
    onOpenChange(false);
    onSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            {activeTab === "login" ? "Log In" : "Sign Up"}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {activeTab === "login"
              ? "Welcome back! Log in to your AirNode Alliance account"
              : "Create a new account to join the AirNode Alliance"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4 bg-ana-darkblue/50">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username/Email</Label>
                <Input
                  id="email"
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email id "
                  className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
                />
              </div>
              <div className="text-xs text-white/50">
                Add commentMore actions Demo credentials: admin / admin@123
              </div>
              <div className="pt-4 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Log In</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="********"
                  className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
                />
              </div>

              <div className="pt-4 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Sign Up</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
