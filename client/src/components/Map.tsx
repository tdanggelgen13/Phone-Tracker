import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";

interface MapProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  label?: string;
}

export default function Map({ latitude, longitude, label }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Guard against null or undefined coordinates
    if (!mapRef.current || typeof latitude !== 'number' || typeof longitude !== 'number') return;
    
    // Default coordinates for Jakarta, Indonesia if latitude/longitude are invalid
    const lat = isFinite(latitude) ? latitude : -6.2088;
    const lng = isFinite(longitude) ? longitude : 106.8456;

    // Initialize map if it doesn't exist yet
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 13);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    } else {
      // Update the view if map already exists
      mapInstanceRef.current.setView([lat, lng], 13);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Add marker at the location
    const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
    if (label) {
      marker.bindPopup(label).openPopup();
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current && !mapRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, label]);

  return (
    <Card className="rounded-lg overflow-hidden border border-gray-200 h-80 relative">
      <div id="map" ref={mapRef} className="h-full w-full z-0" />
      
      {label && (
        <div className="absolute bottom-3 right-3 bg-white bg-opacity-80 rounded-md px-3 py-1 text-sm z-10">
          <span className="font-medium">{label}</span>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 bg-white bg-opacity-70 px-1 py-0.5 text-xs text-gray-600 z-10">
        Map data © OpenStreetMap
      </div>
    </Card>
  );
}
