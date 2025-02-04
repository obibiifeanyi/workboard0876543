import { DashboardNav } from "@/components/navigation/DashboardNav";
import { FileText, PieChart, FileCheck, Settings } from "lucide-react";

export const AccountantNavigation = () => {
  const items = [
    {
      title: "Invoice Management",
      href: "/accountant/invoices",
      icon: FileText,
      variant: "default" as const,
    },
    {
      title: "Financial Reports",
      href: "/accountant/reports",
      icon: PieChart,
      variant: "default" as const,
    },
    {
      title: "Memo Approval",
      href: "/accountant/memos",
      icon: FileCheck,
      variant: "default" as const,
    },
    {
      title: "Settings",
      href: "/accountant/settings",
      icon: Settings,
      variant: "default" as const,
    },
  ];

  return <DashboardNav items={items} />;
};