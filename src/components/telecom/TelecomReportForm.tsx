
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const telecomReportSchema = z.object({
  site_id: z.string().optional(),
  report_category: z.enum(["power", "customer_complaint", "security", "uncategorized", "general"]),
  signal_strength: z.number().optional(),
  network_status: z.string(),
  equipment_status: z.string(),
  issues_reported: z.string().optional(),
  maintenance_required: z.boolean().default(false),
  recommendations: z.string().optional(),
  priority_level: z.enum(["low", "normal", "high", "critical"]).default("normal"),
  
  // Power category fields
  generator_runtime: z.number().optional(),
  diesel_level: z.number().optional(),
  power_status: z.string().optional(),
  
  // Customer complaint fields
  customer_complaint_details: z.string().optional(),
  
  // Security fields
  security_incident_type: z.string().optional(),
  security_details: z.string().optional(),
  
  // Uncategorized fields
  uncategorized_type: z.string().optional(),
});

type TelecomReportFormData = z.infer<typeof telecomReportSchema>;

interface TelecomReportFormProps {
  siteId?: string;
  onSuccess?: () => void;
}

export const TelecomReportForm = ({ siteId, onSuccess }: TelecomReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<TelecomReportFormData>({
    resolver: zodResolver(telecomReportSchema),
    defaultValues: {
      site_id: siteId || '',
      report_category: "general",
      network_status: '',
      equipment_status: '',
      maintenance_required: false,
      priority_level: "normal",
    },
  });

  const watchedCategory = form.watch("report_category");

  const onSubmit = async (data: TelecomReportFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a report",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('telecom_reports')
        .insert({
          site_id: data.site_id || null,
          reporter_id: user.id,
          report_date: new Date().toISOString().split('T')[0],
          report_category: data.report_category,
          signal_strength: data.signal_strength,
          network_status: data.network_status,
          equipment_status: data.equipment_status,
          issues_reported: data.issues_reported,
          maintenance_required: data.maintenance_required,
          recommendations: data.recommendations,
          priority_level: data.priority_level,
          generator_runtime: data.generator_runtime,
          diesel_level: data.diesel_level,
          power_status: data.power_status,
          customer_complaint_details: data.customer_complaint_details,
          security_incident_type: data.security_incident_type,
          security_details: data.security_details,
          uncategorized_type: data.uncategorized_type,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Telecom report submitted successfully",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating telecom report:', error);
      toast({
        title: "Error",
        description: "Failed to submit telecom report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telecom Site Report</CardTitle>
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
                    <FormLabel>Site ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Site ID" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="report_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="power">Power</SelectItem>
                        <SelectItem value="customer_complaint">Customer Complaint</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Tabs value={watchedCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="power">Power</TabsTrigger>
                <TabsTrigger value="customer_complaint">Customer</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="uncategorized">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="signal_strength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signal Strength (dBm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            placeholder="e.g. -75" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="network_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Network Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select network status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                            <SelectItem value="no_signal">No Signal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="equipment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Status</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe equipment condition and status" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="power" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="generator_runtime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Generator Runtime (hours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            placeholder="Enter runtime hours" 
                          />
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
                        <FormLabel>Diesel Level (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            placeholder="Enter diesel level percentage" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="power_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Power Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select power status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="grid_power">Grid Power</SelectItem>
                          <SelectItem value="generator_power">Generator Power</SelectItem>
                          <SelectItem value="battery_backup">Battery Backup</SelectItem>
                          <SelectItem value="no_power">No Power</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="customer_complaint" className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer_complaint_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Complaint Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe the customer complaint in detail" 
                          rows={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <FormField
                  control={form.control}
                  name="security_incident_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Incident Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select incident type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="theft">Theft</SelectItem>
                          <SelectItem value="vandalism">Vandalism</SelectItem>
                          <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                          <SelectItem value="equipment_damage">Equipment Damage</SelectItem>
                          <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="security_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Provide detailed information about the security incident" 
                          rows={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="uncategorized" className="space-y-4">
                <FormField
                  control={form.control}
                  name="uncategorized_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Specify the type of report" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="issues_reported"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issues Reported</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe any issues encountered" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendations</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Provide recommendations for improvement" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting Report..." : "Submit Telecom Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
