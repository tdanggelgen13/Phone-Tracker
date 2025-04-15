export interface PhoneLocationResponse {
  city: string;
  region: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  carrier: string;
  timezone: string;
  formattedAddress?: string; // Alamat lengkap yang diformat
}

export interface PhoneLocationRequest {
  phoneNumber: string;
}
