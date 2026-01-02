import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteStats = {
  total_users: number;
  total_software: number;
  total_downloads: number;
  updated_at?: string;
};

export function useSiteStats() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("site_stats")
      .select("total_users,total_software,total_downloads,updated_at")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching site stats:", error);
      return;
    }

    if (data) {
      setStats({
        total_users: data.total_users ?? 0,
        total_software: data.total_software ?? 0,
        total_downloads: (data as any).total_downloads ?? 0,
        updated_at: data.updated_at,
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      await fetchStats();
      if (mounted) setLoading(false);
    })();

    const onFocus = () => fetchStats();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    const interval = window.setInterval(fetchStats, 15000);

    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { stats, loading, refetch: fetchStats };
}
