import dayjs from 'dayjs';

export const calculateAge = (birthDate: string) => {
  return dayjs().diff(dayjs(birthDate), 'year');
};
