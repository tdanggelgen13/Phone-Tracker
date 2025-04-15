import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ApiKeyNotice() {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Perhatian!</AlertTitle>
      <AlertDescription>
        API key belum dikonfigurasi. Data lokasi saat ini menggunakan data simulasi.
        Untuk mendapatkan data lokasi yang akurat, Anda perlu mendapatkan API key
        dari AbstractAPI dan mengaturnya sebagai variabel lingkungan <code>ABSTRACTAPI_KEY</code>.
      </AlertDescription>
    </Alert>
  );
}