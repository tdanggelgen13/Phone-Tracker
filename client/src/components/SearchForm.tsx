import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Phone, Search } from "lucide-react";
import { validatePhoneNumber } from "@/lib/phoneUtils";

const formSchema = z.object({
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .refine(validatePhoneNumber, {
      message: "Please enter a valid phone number",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface SearchFormProps {
  onSubmit: (phoneNumber: string) => void;
}

export default function SearchForm({ onSubmit }: SearchFormProps) {
  const [isValidNumber, setIsValidNumber] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const handleNumberChange = (value: string) => {
    setIsValidNumber(validatePhoneNumber(value));
  };

  const handleSubmit = (values: FormValues) => {
    onSubmit(values.phoneNumber);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Track Phone Location</h2>
        <p className="text-gray-600 mb-6 text-sm">Enter a phone number to find its approximate geographic location.</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">Phone Number</FormLabel>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNumberChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    {field.value && isValidNumber && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  <FormMessage className="mt-2 text-red-500 text-sm" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full flex justify-center py-6 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span>Track Location</span>
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
