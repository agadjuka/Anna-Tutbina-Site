import { unstable_noStore as noStore } from "next/cache";
import { getSiteSettings } from "@/lib/site-settings";
import { FloatingContactsButton } from "./floating-contacts-button";

export async function FloatingContacts() {
  noStore();
  /* Общий на весь рендер источник настроек — тот же запрос нужен футеру и
     `getHomeData()`, раньше он уходил в Sanity трижды. См. `lib/site-settings.ts`. */
  const settings = await getSiteSettings();

  const contacts = settings?.primaryContacts ?? [];

  return <FloatingContactsButton contacts={contacts} />;
}
