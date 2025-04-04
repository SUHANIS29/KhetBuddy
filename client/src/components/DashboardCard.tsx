import { useTranslation } from "react-i18next";
import { ArrowUpFromLine, ArrowDownFromLine, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  items: {
    name: string;
    value: string;
    trend?: "up" | "down";
    highlight?: boolean;
  }[];
  actionText: string;
  onAction: () => void;
  type: "success" | "info" | "accent";
}

const DashboardCard = ({ title, icon, items, actionText, onAction, type }: DashboardCardProps) => {
  const { t } = useTranslation();
  
  const getBorderClass = () => {
    switch (type) {
      case "success": return "border-[#388E3C]";
      case "info": return "border-[#1976D2]";
      case "accent": return "border-[#FFB300]";
      default: return "border-gray-300";
    }
  };
  
  const getIconClass = () => {
    switch (type) {
      case "success": return "text-[#388E3C]";
      case "info": return "text-[#1976D2]";
      case "accent": return "text-[#FFB300]";
      default: return "text-gray-500";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${getBorderClass()}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className={getIconClass()}>{icon}</div>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-neutral-medium">{item.name}</span>
            <span className={`font-semibold ${item.highlight ? (type === "success" ? "text-[#388E3C]" : type === "info" ? "text-[#1976D2]" : "text-[#FFB300]") : ""}`}>
              {item.value}
              {item.trend && item.trend === "up" && (
                <ArrowUpFromLine className="h-3 w-3 inline ml-1 text-[#388E3C]" />
              )}
              {item.trend && item.trend === "down" && (
                <ArrowDownFromLine className="h-3 w-3 inline ml-1 text-[#D32F2F]" />
              )}
            </span>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onAction}
        className="mt-4 text-primary font-semibold text-sm flex items-center hover:underline"
      >
        {actionText} <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

export default DashboardCard;
