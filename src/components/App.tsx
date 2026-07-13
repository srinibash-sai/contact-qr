import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  deleteProfile,
  duplicateProfile,
  emptyProfile,
  saveProfile,
  setActiveId,
  type Profile,
} from "@/lib/db";
import { useTheme } from "@/hooks/useTheme";
import { useProfiles } from "@/hooks/useProfiles";
import { TopBar } from "@/components/TopBar";
import { Loading } from "@/components/Loading";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { QRView } from "@/components/qr/QRView";
import { EditForm } from "@/components/edit/EditForm";
import { ProfilesList } from "@/components/profiles/ProfilesList";
import { useLenis } from "@/hooks/useLenis";

type View = "loading" | "onboarding" | "qr" | "edit" | "profiles";

export function App() {
  useLenis();
  const { dark, toggle: toggleTheme } = useTheme();
  const { profiles, activeId, activeProfile, ready, refresh } = useProfiles();
  const [view, setView] = useState<View>("loading");
  const [editing, setEditing] = useState<Profile | null>(null);

  // Pick initial view once profiles load
  useEffect(() => {
    if (ready && view === "loading") {
      setView(profiles.length === 0 ? "onboarding" : "qr");
    }
  }, [ready, profiles.length, view]);

  return (
    <div className="min-h-[100dvh] hero-bg">
      <TopBar
        dark={dark}
        onToggleTheme={toggleTheme}
        onProfiles={profiles.length ? () => setView("profiles") : undefined}
        showBack={view === "edit" || view === "profiles"}
        onBack={() => setView("qr")}
      />

      <main className="mx-auto w-full max-w-md px-5 pb-24 pt-2">
        {view === "loading" && <Loading />}

        {view === "onboarding" && (
          <Onboarding
            onCreate={async (draft) => {
              const p = { ...emptyProfile(draft.name || "Personal"), ...draft };
              await saveProfile(p);
              await setActiveId(p.id);
              await refresh();
              setView("qr");
              toast.success("Profile created");
            }}
          />
        )}

        {view === "qr" && activeProfile && (
          <QRView
            profile={activeProfile}
            profileCount={profiles.length}
            onEdit={() => {
              setEditing(activeProfile);
              setView("edit");
            }}
            onSwitch={() => setView("profiles")}
          />
        )}

        {view === "qr" && !activeProfile && ready && (
          <div className="pt-24 text-center text-muted-foreground animate-in fade-in-0">
            No profile selected.
          </div>
        )}

        {view === "edit" && editing && (
          <EditForm
            initial={editing}
            onCancel={() => setView("qr")}
            onSave={async (updated) => {
              await saveProfile(updated);
              await refresh();
              setView("qr");
              toast.success("Saved");
            }}
            onDelete={
              profiles.length > 1
                ? async () => {
                    await deleteProfile(editing.id);
                    const { list } = await refresh();
                    setView(list.length ? "qr" : "onboarding");
                    toast.success("Profile deleted");
                  }
                : undefined
            }
          />
        )}

        {view === "profiles" && (
          <ProfilesList
            profiles={profiles}
            activeId={activeId}
            onSelect={async (id) => {
              await setActiveId(id);
              await refresh();
              setView("qr");
            }}
            onNew={() => {
              setEditing(emptyProfile(`Profile ${profiles.length + 1}`));
              setView("edit");
            }}
            onDuplicate={async (id) => {
              await duplicateProfile(id);
              await refresh();
              toast.success("Duplicated");
            }}
            onDelete={async (id) => {
              await deleteProfile(id);
              const { list } = await refresh();
              if (!list.length) setView("onboarding");
              toast.success("Deleted");
            }}
            onImport={async (p) => {
              await saveProfile(p);
              await setActiveId(p.id);
              await refresh();
              setView("qr");
              toast.success("Imported");
            }}
          />
        )}
      </main>
    </div>
  );
}
