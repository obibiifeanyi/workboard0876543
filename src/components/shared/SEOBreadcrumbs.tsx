
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/dashboard': 'Dashboard',
  '/admin': 'Admin Dashboard',
  '/manager': 'Manager Dashboard',
  '/staff': 'Staff Dashboard',
  '/accountant': 'Accountant Dashboard',
  '/hr': 'HR Dashboard',
  '/settings': 'Settings',
  '/documents': 'Documents',
  '/reports': 'Reports',
  '/telecom': 'Telecom Sites',
  '/projects': 'Projects',
  '/memos': 'Memos',
  '/tasks': 'Tasks',
  '/battery-reports': 'Battery Reports',
  '/telecom-reports': 'Telecom Reports',
  '/meetings': 'Meetings',
  '/profile': 'Profile'
};

export const SEOBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null; // Don't show breadcrumbs on home page
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];

  // Build breadcrumb items from pathname
  let currentPath = '';
  pathnames.forEach((name) => {
    currentPath += `/${name}`;
    const label = routeLabels[currentPath] || name.charAt(0).toUpperCase() + name.slice(1);
    breadcrumbItems.push({
      label,
      href: currentPath
    });
  });

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <div key={item.href || item.label} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {index === 0 && <Home className="h-4 w-4" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href!} className="flex items-center gap-1 hover:text-primary transition-colors">
                      {index === 0 && <Home className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
