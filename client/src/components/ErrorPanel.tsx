import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPanelProps {
  message: string;
  onTryAgain: () => void;
}

export default function ErrorPanel({ message, onTryAgain }: ErrorPanelProps) {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-red-500">
        <h3 className="text-lg font-semibold text-white">Error</h3>
      </div>
      <div className="p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div className="ml-4">
            <p className="text-gray-900 font-medium">{message}</p>
            <p className="mt-2 text-gray-600 text-sm">Please check the number and try again, or try a different phone number.</p>
          </div>
        </div>
        <div className="mt-6">
          <Button 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={onTryAgain}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
