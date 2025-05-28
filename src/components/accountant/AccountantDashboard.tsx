
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountantNavigation } from "@/components/accountant/AccountantNavigation";
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
        .select('role_id')
        .eq('id', session.user.id)
        .single();

      if (!profile || !profile.role_id) {
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
      <Outlet />
    </DashboardLayout>
  );
};

export default AccountantDashboard;
