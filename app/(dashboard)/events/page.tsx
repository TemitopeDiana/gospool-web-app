import EventsPage from '@/components/events-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
};

export default async function Events({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};

  const eventType = sp?.eventType || 'gospool';
  const page = Number(sp.page ?? 1);
  const limit = Number(sp.limit ?? 10);

  return <EventsPage initialEventType={eventType} />;
}
