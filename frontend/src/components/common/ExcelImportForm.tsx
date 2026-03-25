import React, { useRef, useState } from "react";
import Button from "./Button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";

interface ExcelImportFormProps {
  endpoint: "students" | "advisor";
  onImportSuccess: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const ExcelImportForm: React.FC<ExcelImportFormProps> = ({
  endpoint,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleButtonClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}/import`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Import failed due to a server error.";
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          toast.error(message);
        }
        throw new Error(message);
      }

      const result = await response.json();

      toast.success(
        `Import successful! Created: ${result.created}, Updated: ${result.updated}`
      );

      onImportSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during import."
      );
    } finally {
      setIsLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    handleUpload(selectedFile);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={isLoading}
        className="flex items-center space-x-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span>{isLoading ? "Importing..." : "Upload & Import"}</span>
      </Button>
    </>
  );
};
