import { unstable_noStore as noStore } from "next/cache";
import { sanityClient } from "@/lib/sanity.client";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import { FloatingContactsButton } from "./floating-contacts-button";

interface SiteSettings {
  primaryContacts?: Array<{
    label?: string;
    url?: string;
    icon?: string;
  }>;
}

export async function FloatingContacts() {
  noStore();
  const settings = await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);

  const contacts = settings?.primaryContacts ?? [];

  return <FloatingContactsButton contacts={contacts} />;
}
