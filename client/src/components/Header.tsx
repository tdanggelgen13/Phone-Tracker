import { MapPin, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-primary" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Phone Location Tracker</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
            <HelpCircle className="h-6 w-6 text-gray-400" />
          </Button>
        </div>
      </div>
    </header>
  );
}
