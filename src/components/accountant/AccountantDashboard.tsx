import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
import { DocumentAnalyzer } from "@/components/staff/DocumentAnalyzer";
import { ChatBox } from "@/components/ChatBox";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AccountantDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccountantAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('account_type, status')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.account_type !== 'accountant' || profile.status !== 'active') {
        navigate('/login');
      }
    };

    checkAccountantAccess();
  }, [navigate]);

  return (
    <DashboardLayout
      title="Accountant Dashboard"
      navigation={<AccountantNavigation />}
    >
      <div className="space-y-6 p-6">
        <DocumentAnalyzer />
        <Outlet />
      </div>
      <ChatBox />
    </DashboardLayout>
  );
};

export default AccountantDashboard;