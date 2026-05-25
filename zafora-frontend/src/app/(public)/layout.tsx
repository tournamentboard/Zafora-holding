import PublicShell from "@/src/components/layout/PublicShell";
import AnnouncementBar from "@/src/components/common/AnnouncementBar";
import { apiClient } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";

async function getAnnouncementBar() {
  try {
    const setting = await apiClient<{ key: string; value: string }>({
      path: API.CONTENT.SETTINGS("announcement_bar"),
      next: { revalidate: 60 },
    });
    if (setting?.value) return JSON.parse(setting.value);
  } catch {}
  return null;
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcementData = await getAnnouncementBar();

  return (
    <>
      <AnnouncementBar data={announcementData} />
      <PublicShell>{children}</PublicShell>
    </>
  );
}
