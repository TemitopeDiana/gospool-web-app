const home = () => '/';
const passengers = () => '/passengers';
const passengerProfile = (passengerId: string) =>
  `${passengers()}/${passengerId}`;
const drivers = () => '/drivers';
const driverProfile = (driverId: string) => `${drivers()}/${driverId}`;

export const routes = {
  home,
  passengers,
  passengerProfile,
  drivers,
  driverProfile,
};
