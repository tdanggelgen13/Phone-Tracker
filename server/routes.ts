import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { phoneLocationRequestSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API status endpoint - check if API key is configured
  app.get("/api/status", (req: Request, res: Response) => {
    const apiKey = process.env.ABSTRACTAPI_KEY;
    return res.status(200).json({
      apiKeyConfigured: !!apiKey,
      message: apiKey 
        ? "AbstractAPI key is configured" 
        : "AbstractAPI key is missing. Data will be generated using simulation."
    });
  });

  // Phone location API endpoint
  app.post("/api/phone-location", async (req: Request, res: Response) => {
    try {
      // Validate request data
      const validatedData = phoneLocationRequestSchema.parse(req.body);
      
      // Process the phone number and get location data
      const phoneLocationData = await storage.getPhoneLocation(validatedData.phoneNumber);
      
      if (!phoneLocationData) {
        return res.status(404).json({ 
          message: `Unable to find location information for ${validatedData.phoneNumber}.` 
        });
      }
      
      // Return location data
      return res.status(200).json(phoneLocationData);
    } catch (error) {
      console.error("Error processing phone location request:", error);
      
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Handle other errors
      return res.status(500).json({ 
        message: "Failed to process phone location request. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
