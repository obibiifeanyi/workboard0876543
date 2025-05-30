
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "lucide-react";

interface SignupFormProps {
  onSignup: (email: string, password: string, fullName: string, role: string, accountType: string, phone?: string) => Promise<void>;
  error: string | null;
}

export const SignupForm = ({ onSignup, error }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("staff");
  const [accountType, setAccountType] = useState("staff");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!email || !password || !fullName) {
      errors.push("Please fill in all required fields");
    }
    
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }
    
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Please enter a valid email address");
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSignup(email, password, fullName, role, accountType, phone || undefined);
    } finally {
      setLoading(false);
    }
  };

  // Display user-friendly error messages
  const getErrorMessage = (error: string) => {
    if (error.includes("User already registered") || error.includes("Email address is already registered")) {
      return "An account with this email already exists. Please try logging in instead.";
    }
    if (error.includes("Database error saving new user")) {
      return "There was an issue creating your account. Please try again or contact support.";
    }
    if (error.includes("Invalid email")) {
      return "Please enter a valid email address.";
    }
    if (error.includes("Password should be at least 6 characters")) {
      return "Password must be at least 6 characters long.";
    }
    if (error.includes("Email not confirmed")) {
      return "Please check your email and confirm your account before signing in.";
    }
    return error;
  };

  const allErrors = [...formErrors, ...(error ? [getErrorMessage(error)] : [])];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {allErrors.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {allErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2 text-left">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
          disabled={loading}
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
          disabled={loading}
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
          disabled={loading}
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="role">Role *</Label>
        <Select value={role} onValueChange={setRole} disabled={loading}>
          <SelectTrigger className="bg-black/5 dark:bg-white/5 border-none">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="accountant">Accountant</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="accountType">Account Type *</Label>
        <Select value={accountType} onValueChange={setAccountType} disabled={loading}>
          <SelectTrigger className="bg-black/5 dark:bg-white/5 border-none">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="accountant">Accountant</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
          disabled={loading}
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
          disabled={loading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !email || !password || !fullName}
      >
        {loading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};
