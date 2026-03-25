import React from "react";
import Button from "./Button";
import { Download } from "lucide-react";

interface ExcelExportButtonProps {
  endpoint: "students" | "advisor";
  label: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  endpoint,
  label,
}) => {
  const handleExport = () => {
    const url = `${API_BASE_URL}/${endpoint}/export`;
    window.open(url, "_blank");
  };

  return (
    <Button
      onClick={handleExport}
      variant="secondary"
      className="flex items-center space-x-2"
    >
      <Download className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
};
