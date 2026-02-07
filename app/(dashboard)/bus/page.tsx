import { BusPageComponent } from '@/components/bus-page';
import { getBuses } from '@/actions/getBuses';
import { getChurches } from '@/actions/getChurches';

export default async function BusPage() {
  const [busesRes, churchesRes] = await Promise.all([
    getBuses({
      // church: '',
      // branch: '',
      page: 1,
      limit: 50,
    }),
    getChurches({ page: 1, limit: 100 }),
  ]);

  const buses = busesRes.success ? busesRes.data : [];
  const pagination = busesRes.success ? busesRes.pagination : undefined;
  const churches = churchesRes.success ? churchesRes.data : [];

  return (
    <BusPageComponent
      buses={buses}
      pagination={pagination}
      churches={churches}
    />
  );
}
