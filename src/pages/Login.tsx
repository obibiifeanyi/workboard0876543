import { LoginForm } from "@/components/login/LoginForm";
import { LoginHeader } from "@/components/login/LoginHeader";
import { WorkProgressDonut } from "@/components/login/WorkProgressDonut";

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <LoginHeader />
        <div className="grid md:grid-cols-2 gap-8">
          <LoginForm />
          <WorkProgressDonut />
        </div>
      </div>
    </div>
  );
};

export default Login;