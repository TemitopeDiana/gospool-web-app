const home = () => '/';
const passengers = () => '/passengers';
const passengerProfile = (passengerId: string) =>
  `${passengers()}/${passengerId}`;

export const routes = {
  home,
  passengers,
  passengerProfile,
};
