
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Loader } from "lucide-react";

interface TelecomSite {
  id: string;
  name: string;
  location: string;
  site_number: string | null;
  status: string | null;
}

interface TelecomSiteSelectorProps {
  selectedSiteId: string;
  onSiteSelect: (siteId: string) => void;
}

export const TelecomSiteSelector = ({ selectedSiteId, onSiteSelect }: TelecomSiteSelectorProps) => {
  const [sites, setSites] = useState<TelecomSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching telecom sites...');

      const { data, error: fetchError } = await supabase
        .from('telecom_sites')
        .select('id, name, location, site_number, status')
        .eq('status', 'active')
        .order('name');

      if (fetchError) {
        console.error('Error fetching telecom sites:', fetchError);
        setError('Failed to load sites');
        return;
      }

      console.log('Telecom sites fetched successfully:', data);
      setSites(data || []);

    } catch (error) {
      console.error('Error fetching sites:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const selectedSite = sites.find(site => site.id === selectedSiteId);

  return (
    <div className="space-y-2">
      <Select value={selectedSiteId} onValueChange={onSiteSelect}>
        <SelectTrigger className="bg-white/5 border-white/10 rounded-[30px]">
          <SelectValue placeholder="Select telecom site...">
            {selectedSite && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{selectedSite.name} - {selectedSite.location}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-black/95 backdrop-blur-lg border-white/10 max-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Loading sites...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : sites.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No active sites found
            </div>
          ) : (
            sites.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                <div className="flex items-center gap-2 w-full">
                  <MapPin className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{site.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {site.location} {site.site_number && `• #${site.site_number}`}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {error && (
        <button 
          onClick={fetchSites}
          className="text-xs text-blue-500 hover:text-blue-700 underline"
        >
          Retry loading sites
        </button>
      )}
    </div>
  );
};
