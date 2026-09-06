import { getChurches } from '@/actions/getChurches';
import Breadcrumb from '@/components/bread-crumbs';
import EventProfile from '@/components/event-profile';
import { routes } from '@/lib/routes';

interface PageProps {
  params: {
    eventId: string;
  };
}

export default async function EventPage({ params }: PageProps) {
  const { eventId } = await params;
  const churchesRes = await getChurches({ page: 1, limit: 100 });

  const churches = churchesRes.success ? churchesRes.data : [];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Events', href: routes.events() },
          { label: 'View Event' },
        ]}
      />
      <EventProfile churches={churches} />
    </div>
  );
}
