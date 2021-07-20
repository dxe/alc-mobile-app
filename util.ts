import moment from "moment";

export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const utcToLocal = (date: string | undefined): moment.Moment => {
  if (date) {
    return moment(date).utc(true).local();
  }
  return moment().utc(true).local();
};
