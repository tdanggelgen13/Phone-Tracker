import { MapPin, Globe, Radio, Clock, RefreshCw, Share2, Printer } from "lucide-react";
import { PhoneLocationResponse } from "@/types";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ResultsPanelProps {
  phoneNumber: string;
  locationData: PhoneLocationResponse;
}

export default function ResultsPanel({ phoneNumber, locationData }: ResultsPanelProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <div className="p-4 bg-primary">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Location Results</h3>
          <span className="text-white text-sm">{phoneNumber}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="md:flex md:space-x-6">
          {/* Location Info */}
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="space-y-6">
              {/* Primary Location with Full Address */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase">Location</h4>
                <div className="mt-2 flex items-start">
                  <MapPin className="text-xl text-primary mt-1" />
                  <div className="ml-2">
                    <p className="text-lg font-medium text-gray-900">
                      {locationData.city}, {locationData.region}
                    </p>
                    {locationData.formattedAddress && (
                      <p className="text-sm text-gray-600 mt-1">
                        {locationData.formattedAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Country */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase">Country</h4>
                <div className="mt-2 flex items-start">
                  <Globe className="text-xl text-primary mt-1" />
                  <p className="ml-2 text-lg font-medium text-gray-900">{locationData.country}</p>
                </div>
              </div>
              
              {/* Network Provider */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase">Network Provider</h4>
                <div className="mt-2 flex items-start">
                  <Radio className="text-xl text-primary mt-1" />
                  <p className="ml-2 text-lg font-medium text-gray-900">{locationData.carrier}</p>
                </div>
              </div>
              
              {/* Time Zone */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase">Time Zone</h4>
                <div className="mt-2 flex items-start">
                  <Clock className="text-xl text-primary mt-1" />
                  <p className="ml-2 text-lg font-medium text-gray-900">{locationData.timezone}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Display and Address Section */}
          <div className="md:w-1/2">
            <Map 
              latitude={locationData.latitude} 
              longitude={locationData.longitude}
              label={locationData.latitude && locationData.longitude 
                ? `${locationData.latitude}° N, ${locationData.longitude}° W` 
                : `Location coordinates unavailable`}
            />
            
            {/* Detailed Address Information Box */}
            <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</h4>
              <p className="text-gray-800">
                {locationData.formattedAddress || "Alamat lengkap tidak tersedia"}
              </p>
              
              {locationData.latitude && locationData.longitude && (
                <div className="mt-2 text-xs text-gray-500">
                  Koordinat: {locationData.latitude}°, {locationData.longitude}°
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions Footer */}
      <Separator />
      <div className="px-6 py-4">
        <div className="flex justify-between">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center">
            <RefreshCw className="mr-1 h-4 w-4" /> Refresh
          </Button>
          <div>
            <Button variant="ghost" className="mr-3 text-primary hover:text-primary/80 text-sm font-medium flex items-center">
              <Share2 className="mr-1 h-4 w-4" /> Share
            </Button>
            <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
              <Printer className="mr-1 h-4 w-4" /> Print
            </Button>
          </div>
        </div>
      </div>
      
      {/* Disclaimer Notice */}
      <div className="mt-4 mb-2 mx-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Disclaimer:</strong> This tool provides approximate location based on phone number prefixes and public carrier data. Results may not be accurate and should not be used for emergency services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
