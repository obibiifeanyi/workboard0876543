
import { DashboardNav } from "@/components/navigation/DashboardNav";
import { FileText, PieChart, FileCheck, Settings, Package, CreditCard } from "lucide-react";

export const AccountantNavigation = () => {
  const items = [
    {
      title: "Financial Reports",
      href: "/accountant/reports",
      icon: PieChart,
      variant: "default" as const,
    },
    {
      title: "Invoice Management",
      href: "/accountant/invoices",
      icon: FileText,
      variant: "default" as const,
    },
    {
      title: "Memo Approval",
      href: "/accountant/memos",
      icon: FileCheck,
      variant: "default" as const,
    },
    {
      title: "Inventory Management",
      href: "/accountant/inventory",
      icon: Package,
      variant: "default" as const,
    },
    {
      title: "Payment Processing",
      href: "/accountant/payments",
      icon: CreditCard,
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
