import { ProfilePageClient } from "@/components/ProfilePageClient";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return <ProfilePageClient handle={handle} />;
}
