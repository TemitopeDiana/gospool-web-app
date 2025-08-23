const home = () => '/';
const passengers = () => '/passengers';
const churches = () => '/churches';
const passengerProfile = (passengerId: string) =>
  `${passengers()}/${passengerId}`;
const createChurchProfile = () => '/create-church-profile';
const churchProfile = (churchId: string) => `${churches()}/${churchId}`;
const createSuperAdminProfile = () => '/create-super-admin-profile';

export const routes = {
  home,
  passengers,
  passengerProfile,
  churchProfile,
  createChurchProfile,
  createSuperAdminProfile,
};
