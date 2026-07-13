import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getActiveId,
  listProfiles,
  setActiveId as setActiveIdDb,
  type Profile,
} from "@/lib/db";

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const list = await listProfiles();
    let active = await getActiveId();
    if (!active && list.length) {
      active = list[0].id;
      await setActiveIdDb(active);
    }
    setProfiles(list);
    setActiveState(active);
    return { list, active };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refresh();
      } finally {
        setReady(true);
      }
    })();
  }, [refresh]);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeId) ?? null,
    [profiles, activeId],
  );

  return {
    profiles,
    activeId,
    activeProfile,
    ready,
    refresh,
    setActiveId: setActiveIdDb,
  };
}
