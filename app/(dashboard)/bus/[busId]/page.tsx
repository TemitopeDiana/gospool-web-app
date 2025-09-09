// 'use client';
import SvgIcon from '@/components/svg-icon';
import Image from 'next/image';

const data = [
  {
    dateBooked: { date: '12 Jan', time: '8:50 am' },
    passenger: {
      url: '/assets/profile-pic.png',
      name: 'olayeni cardoso',
      email: 'olayenicardoso@gmail.com',
    },
  },
  {
    dateBooked: { date: '12 Jan', time: '8:50 am' },
    passenger: {
      url: '/assets/profile-pic.png',
      name: 'oluwajohn boro gbenga',
      email: 'borogbenga@gmail.com',
    },
  },
];

function BusProfile() {
  return (
    <div className="flex flex-col sm:items-start sm:flex-row gap-6">
      <div className="bg-background flex flex-col gap-5 py-8 px-5 rounded-20 flex-1 max-w-[326px]">
        <div>
          <div className="flex relative">
            <Image
              src="/assets/bus.png"
              alt="bus-img"
              width={121}
              height={68}
            />
            <div className="absolute left-[81px] bottom-5 w-12 h-12 flex items-center justify-center rounded-full bg-background">
              <Image
                src="/assets/profile-pic.png"
                alt="profile-pic"
                width={40}
                height={40}
              />
            </div>
          </div>

          <h1 className="font-medium text-xl md:text-3xl">Joseph Boro</h1>
        </div>

        <ul className="bg-gray-100 rounded-12 p-2 flex flex-col gap-2">
          <li className="rounded-12 bg-background text-primary flex items-center justify-between p-3">
            <div className="flex items-center gap-4">
              <SvgIcon name="calendar" className="w-4 h-4" />
              <p>Booked</p>
            </div>
            <p className="text-primary-500">28</p>
          </li>
          <li className="rounded-12 bg-background text-primary flex items-center justify-between p-3">
            <div className="flex items-center gap-4">
              <SvgIcon name="seats" className="w-4 h-4" />
              <p>Seats</p>
            </div>
            <p className="text-primary-500">48</p>
          </li>
        </ul>

        <ul className="flex flex-col gap-6">
          <li className="flex items-center justify-between">
            <p className="text-gray-500">Plate number</p>
            <p>1234ABC</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="text-gray-500">Color</p>
            <p>Blue</p>
          </li>
        </ul>
      </div>

      {/* bookings */}
      <div className="bg-background rounded-12 p-5 flex-1">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date booked</th>
                <th>Passenger</th>
              </tr>
            </thead>

            <tbody>
              {data.map((el, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <p>{el.dateBooked.date}</p>
                      <p className="text-gray-500">{el.dateBooked.time}</p>
                    </div>
                  </td>
                  <td className="flex items-center gap-2">
                    <Image
                      src="/assets/profile-pic.png"
                      alt="profile-pic"
                      width={32}
                      height={32}
                    />

                    <div>
                      <p className="capitalize">{el.passenger.name}</p>
                      <p className="text-gray-500">{el.passenger.email}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BusProfile;
