import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import ResultsPanel from "@/components/ResultsPanel";
import ErrorPanel from "@/components/ErrorPanel";
import ApiKeyNotice from "@/components/ApiKeyNotice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PhoneLocationResponse } from "@/types";

interface ApiStatus {
  apiKeyConfigured: boolean;
  message: string;
}

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [locationData, setLocationData] = useState<PhoneLocationResponse | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();

  // Check API status to see if API key is configured
  const { data: apiStatus } = useQuery<ApiStatus>({
    queryKey: ['/api/status'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/status");
      return response.json();
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const response = await apiRequest("POST", "/api/phone-location", { phoneNumber });
      return response.json();
    },
    onSuccess: (data: PhoneLocationResponse) => {
      setLocationData(data);
      setShowResults(true);
      setShowError(false);
    },
    onError: (error: Error) => {
      setShowResults(false);
      setShowError(true);
      setErrorMessage(error.message || "Unable to find location information for this phone number.");
      toast({
        title: "Error",
        description: error.message || "Unable to find location information for this phone number.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (number: string) => {
    setPhoneNumber(number);
    mutate(number);
  };

  const handleTryAgain = () => {
    setShowError(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Display API key notice if API key is not configured */}
          {apiStatus && !apiStatus.apiKeyConfigured && <ApiKeyNotice />}
          
          <SearchForm onSubmit={handleSubmit} />
          
          {isPending && (
            <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              </div>
            </div>
          )}
          
          {showResults && locationData && (
            <ResultsPanel 
              phoneNumber={phoneNumber} 
              locationData={locationData} 
            />
          )}
          
          {showError && (
            <ErrorPanel 
              message={errorMessage} 
              onTryAgain={handleTryAgain} 
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
