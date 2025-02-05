import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ForgotPasswordButton } from "./ForgotPasswordButton";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Username:</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-5 py-3 text-base border rounded transition-all duration-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password:</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-5 py-3 text-base border rounded transition-all duration-500"
        />
      </div>

      <div className="flex justify-between items-center">
        <ForgotPasswordButton onClick={() => {}} />
      </div>

      <Button 
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
      >
        Login
      </Button>
    </form>
  );
};