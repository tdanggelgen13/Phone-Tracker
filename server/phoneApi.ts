import fetch from 'node-fetch';
import { InsertPhoneLocation } from '@shared/schema';

// Interface for responses from AbstractAPI
interface AbstractApiResponse {
  phone: string;
  valid: boolean;
  country: {
    name: string;
    code: string;
    prefix: string;
  };
  location: {
    city?: string;
    region?: string;
    timezone?: string;
    latitude?: number;
    longitude?: number;
  };
  carrier: {
    name?: string;
  };
  type?: string;
}

/**
 * Fetches phone number location information from AbstractAPI
 * 
 * @param phoneNumber The phone number to lookup
 * @returns Phone location data or null if unable to retrieve
 */
export async function fetchPhoneLocation(phoneNumber: string): Promise<InsertPhoneLocation | null> {
  // Check if API key is available
  const apiKey = process.env.ABSTRACTAPI_KEY;
  if (!apiKey) {
    console.error('AbstractAPI key is missing. Configure ABSTRACTAPI_KEY in environment variables.');
    return null;
  }

  try {
    // Make request to AbstractAPI
    const url = `https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${encodeURIComponent(phoneNumber)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json() as AbstractApiResponse;
    
    // Check if the phone number is valid
    if (!data.valid) {
      return null;
    }
    
    // Format full address from available location components
    const addressParts = [];
    if (data.location.city) addressParts.push(data.location.city);
    if (data.location.region) addressParts.push(data.location.region);
    if (data.country.name) addressParts.push(data.country.name);
    
    const formattedAddress = addressParts.length > 0 
      ? addressParts.join(", ")
      : null;
    
    // Map the API response to our database schema
    const phoneLocationData: InsertPhoneLocation = {
      phoneNumber,
      city: data.location.city ?? null,
      region: data.location.region ?? null,
      country: data.country.name ?? null,
      latitude: data.location.latitude ?? null,
      longitude: data.location.longitude ?? null,
      carrier: data.carrier.name ?? null,
      timezone: data.location.timezone ?? null,
      lookupTime: new Date().toISOString(),
      formattedAddress,
    };
    
    return phoneLocationData;
  } catch (error) {
    console.error('Error fetching phone location from AbstractAPI:', error);
    return null;
  }
}