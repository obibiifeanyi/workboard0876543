interface TelecomStatusBadgeProps {
  status: "active" | "maintenance" | "inactive";
}

export const TelecomStatusBadge = ({ status }: TelecomStatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "bg-emerald/20 text-emerald";
      case "maintenance":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-red-500/20 text-red-500";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyles()}`}>
      {status}
    </span>
  );
};