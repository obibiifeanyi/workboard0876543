
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/services/api";

const ctPowerReportSchema = z.object({
  site_id: z.string().min(1, "Site ID is required"),
  report_number: z.string().optional(),
  diesel_level: z.number().min(0).max(100, "Diesel level must be between 0-100%"),
  generator_runtime: z.number().min(0, "Runtime must be positive"),
  power_reading: z.number().optional(),
  battery_status: z.string().optional(),
  status: z.string().default("operational"),
  comments: z.string().optional(),
});

type CTPowerReportFormData = z.infer<typeof ctPowerReportSchema>;

interface CTPowerReportFormProps {
  onSuccess?: () => void;
}

export const CTPowerReportForm = ({ onSuccess }: CTPowerReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CTPowerReportFormData>({
    resolver: zodResolver(ctPowerReportSchema),
    defaultValues: {
      site_id: '',
      status: 'operational',
    },
  });

  const onSubmit = async (data: CTPowerReportFormData) => {
    setIsSubmitting(true);
    try {
      // Ensure site_id is properly typed as required
      const reportData = {
        site_id: data.site_id, // This is guaranteed to be a string due to validation
        report_datetime: new Date().toISOString(),
        diesel_level: data.diesel_level,
        generator_runtime: data.generator_runtime,
        power_reading: data.power_reading,
        battery_status: data.battery_status,
        comments: data.comments,
        status: data.status,
        report_number: data.report_number,
      };

      const result = await ApiService.createCTPowerReport(reportData);

      if (result.success) {
        toast({
          title: "Success",
          description: "CT Power report submitted successfully",
        });
        form.reset();
        onSuccess?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating CT power report:', error);
      toast({
        title: "Error",
        description: "Failed to submit CT power report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CT Power Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="site_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site ID *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Site ID" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="report_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Report Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diesel_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diesel Level (%) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        placeholder="Enter diesel level percentage" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="generator_runtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generator Runtime (hours) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        placeholder="Enter runtime hours" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="power_reading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power Reading (kW)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        placeholder="Enter power reading" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="battery_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Battery Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select battery status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="charging">Charging</SelectItem>
                        <SelectItem value="discharging">Discharging</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="maintenance_required">Maintenance Required</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Additional comments or observations" rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting Report..." : "Submit CT Power Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
