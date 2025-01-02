import { ClockInButton } from "@/components/ClockInButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground animate-fade-in">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <h1 className="text-4xl font-bold mb-8">Welcome to WorkFlow</h1>
      <div className="flex flex-col items-center gap-8">
        <ClockInButton />
        <p className="text-muted-foreground">
          Click to clock in and proceed to login
        </p>
      </div>
    </div>
  );
};

export default Index;