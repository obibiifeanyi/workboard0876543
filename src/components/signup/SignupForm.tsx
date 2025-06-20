import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Loader } from "lucide-react";

interface SignupFormProps {
  onSignup: (
    email: string, 
    password: string, 
    profileData: {
      fullName: string;
      role: string;
      accountType: string;
      phone?: string;
      position?: string;
      department?: string;
      location?: string;
      bio?: string;
    }
  ) => Promise<void>;
  error: string | null;
}

export const SignupForm = ({ onSignup, error }: SignupFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("staff");
  
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Reset success state after delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (isSuccess) {
      timeoutId = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSuccess]);

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
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSignup(email, password, {
        fullName,
        role,
        accountType: role, // Account type matches the selected role
        phone: phone || undefined,
        position: position || undefined,
        department: department || undefined,
        location: location || undefined,
        bio: bio || undefined,
      });
      
      // Show success message
      setIsSuccess(true);
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. Please check your email for verification.",
      });
      
      // Reset form on success
      resetForm();
      
    } catch (error: any) {
      // Handle error
      const errorMessage = error?.message || "An error occurred during signup";
      setFormErrors([errorMessage]);
      
      toast({
        title: "Signup Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setPhone("");
    setPosition("");
    setDepartment("");
    setLocation("");
    setBio("");
    setRole("staff");
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
      
      {isSuccess && (
        <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <AlertDescription className="text-green-800">
              Account created successfully! Please check your email for verification.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Required Fields Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Required Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="role">Role *</Label>
          <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
            <SelectTrigger className="bg-black/5 dark:bg-white/5 border-none">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="staff_admin">Staff Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Optional Fields Section */}
      <div className="space-y-4 pt-4 border-t border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground">Additional Information (Optional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              type="text"
              placeholder="Your job title/position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              type="text"
              placeholder="Your department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="Your work location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself (optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border-none placeholder:text-muted-foreground/50 min-h-[80px]"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full mt-6" 
        disabled={isSubmitting || !email || !password || !fullName}
      >
        {isSubmitting ? (
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
