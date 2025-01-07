import { DashboardLayout } from "@/components/DashboardLayout";
import { MemoGeneration } from "@/components/staff/MemoGeneration";

const Memos = () => {
  return (
    <DashboardLayout title="Memos">
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
        <MemoGeneration />
      </div>
    </DashboardLayout>
  );
};

export default Memos;