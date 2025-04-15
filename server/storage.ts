import { 
  users, type User, type InsertUser, 
  phoneLocations, type PhoneLocation, type InsertPhoneLocation
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Define interface with CRUD methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPhoneLocation(phoneNumber: string): Promise<PhoneLocation | null>;
  savePhoneLocation(phoneLocation: InsertPhoneLocation): Promise<PhoneLocation>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPhoneLocation(phoneNumber: string): Promise<PhoneLocation | null> {
    // Check if we already have this phone number in the database
    const [existingLocation] = await db
      .select()
      .from(phoneLocations)
      .where(eq(phoneLocations.phoneNumber, phoneNumber));
    
    if (existingLocation) {
      return existingLocation;
    }
    
    try {
      // If not found in the database, we'll try to fetch from the AbstractAPI
      // Import the API utility dynamically to avoid circular dependencies
      const { fetchPhoneLocation } = await import('./phoneApi');
      
      // Fetch from the API
      const apiLocationData = await fetchPhoneLocation(phoneNumber);
      
      // If we got data from the API, save and return it
      if (apiLocationData) {
        return this.savePhoneLocation(apiLocationData);
      }
      
      // If API call failed or returned no data, we'll fall back to the mock data
      // (This will be useful until you configure the API key)
      console.warn('Could not fetch phone data from API. Using fallback data generation.');
      
      // Generate mock data based on the phone number
      const seed = Array.from(phoneNumber).reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const randomize = (min: number, max: number) => {
        const x = Math.sin(seed) * 10000;
        return min + ((x - Math.floor(x)) * (max - min));
      };
      
      // Extract country code if available, or use US as default
      const countryCode = phoneNumber.startsWith("+") ? phoneNumber.substring(1, 3) : "1";
      
      let country = "United States";
      let city = "New York";
      let region = "NY";
      let carrier = "Sample Carrier";
      let timezone = "UTC-5";
      
      // Basic country detection based on common country codes
      if (countryCode === "44") {
        country = "United Kingdom";
        city = "London";
        region = "England";
        carrier = "British Telecom";
        timezone = "UTC+0";
      } else if (countryCode === "49") {
        country = "Germany";
        city = "Berlin";
        region = "Berlin";
        carrier = "Deutsche Telekom";
        timezone = "UTC+1";
      } else if (countryCode === "33") {
        country = "France";
        city = "Paris";
        region = "Île-de-France";
        carrier = "Orange";
        timezone = "UTC+1";
      } else if (countryCode === "81") {
        country = "Japan";
        city = "Tokyo";
        region = "Kanto";
        carrier = "NTT Docomo";
        timezone = "UTC+9";
      } else if (countryCode === "86") {
        country = "China";
        city = "Beijing";
        region = "Beijing";
        carrier = "China Mobile";
        timezone = "UTC+8";
      } else if (countryCode === "91") {
        country = "India";
        city = "Mumbai";
        region = "Maharashtra";
        carrier = "Jio";
        timezone = "UTC+5:30";
      } else if (countryCode === "62") {
        country = "Indonesia";
        city = "Jakarta";
        region = "Java";
        carrier = "Telkomsel";
        timezone = "UTC+7";
      }
      
      // Generate somewhat realistic lat/long based on the country
      let latitude = 40.7128; // New York by default
      let longitude = -74.0060;
      
      if (country === "United Kingdom") {
        latitude = 51.5074 + randomize(-0.1, 0.1);
        longitude = -0.1278 + randomize(-0.1, 0.1);
      } else if (country === "Germany") {
        latitude = 52.5200 + randomize(-0.1, 0.1);
        longitude = 13.4050 + randomize(-0.1, 0.1);
      } else if (country === "France") {
        latitude = 48.8566 + randomize(-0.1, 0.1);
        longitude = 2.3522 + randomize(-0.1, 0.1);
      } else if (country === "Japan") {
        latitude = 35.6762 + randomize(-0.1, 0.1);
        longitude = 139.6503 + randomize(-0.1, 0.1);
      } else if (country === "China") {
        latitude = 39.9042 + randomize(-0.1, 0.1);
        longitude = 116.4074 + randomize(-0.1, 0.1);
      } else if (country === "India") {
        latitude = 19.0760 + randomize(-0.1, 0.1);
        longitude = 72.8777 + randomize(-0.1, 0.1);
      } else if (country === "Indonesia") {
        latitude = -6.2088 + randomize(-0.1, 0.1);
        longitude = 106.8456 + randomize(-0.1, 0.1);
      } else {
        // US or other countries - randomize around New York
        latitude = 40.7128 + randomize(-0.3, 0.3);
        longitude = -74.0060 + randomize(-0.3, 0.3);
      }
      
      // Create mock phone location data
      const phoneLocationData: InsertPhoneLocation = {
        phoneNumber,
        city: city ?? null,
        region: region ?? null,
        country: country ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        carrier: carrier ?? null,
        timezone: timezone ?? null,
        lookupTime: new Date().toISOString(),
      };
      
      return this.savePhoneLocation(phoneLocationData);
    } catch (error) {
      console.error('Error in getPhoneLocation:', error);
      return null;
    }
  }

  async savePhoneLocation(insertPhoneLocation: InsertPhoneLocation): Promise<PhoneLocation> {
    const [phoneLocation] = await db
      .insert(phoneLocations)
      .values(insertPhoneLocation)
      .returning();
    
    return phoneLocation;
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
