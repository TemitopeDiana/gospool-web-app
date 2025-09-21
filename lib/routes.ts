const home = () => '/';
const passengers = () => '/passengers';
const churches = () => '/churches';
const passengerProfile = (passengerId: string) =>
  `${passengers()}/${passengerId}`;
const churchProfile = (churchId: string) => `${churches()}/${churchId}`;
const createSuperAdminProfile = () => '/create-super-admin-profile';
const branchPage = (churchId: string, branchId: string) =>
  `${churchProfile(churchId)}/branches/${branchId}`;
const addBranch = () => '/add-branch';
const drivers = () => '/drivers';
const driverProfile = (driverId: string) => `${drivers()}/${driverId}`;
const signIn = () => '/sign-in';
const rides = () => '/rides';
const bus = () => '/bus';
const busProfile = (busId: string) => `${bus()}/${busId}`;

export const routes = {
  home,
  passengers,
  passengerProfile,
  churchProfile,
  createSuperAdminProfile,
  branchPage,
  addBranch,
  drivers,
  driverProfile,
  signIn,
  rides,
  bus,
  busProfile,
  churches,
};
