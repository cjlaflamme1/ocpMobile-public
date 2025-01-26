

export const dateOnly = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};
export const dateAndTime = (date: Date) => {
  const d = new Date(date);
  const timeDate = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return timeDate;
};

export const timeOnly = (date: Date) => {
  const d = new Date(date);
  const timeDate = `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return timeDate;
};

export const dateYearMonthDay = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${(d.getMonth() + 1)}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

export const dateMonthDayYear = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${(d.getMonth() + 1)}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${month}-${day}-${year}`;
};

export const dayOfWeek = (date: Date) => {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const d = new Date(date);
  return weekday[d.getDay()];
}

export const timeSince = (date: Date) => {

  let seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    const yearQuantity = Math.floor(interval);
    if (yearQuantity === 1) {
      return yearQuantity + ' year';
    } else {
      return yearQuantity + ' years';
    }
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const monthQuantity = Math.floor(interval);
    if (monthQuantity === 1) {
      return monthQuantity + ' month';
    } else {
      return monthQuantity + ' months';
    }
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const dayQuantity = Math.floor(interval);
    if (dayQuantity === 1) {
      return dayQuantity + ' day';
    } else {
      return dayQuantity + ' days';
    }
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const hourQuantity = Math.floor(interval);
    if (hourQuantity === 1) {
      return hourQuantity + " hour";
    } else {
      return hourQuantity + " hours";
    }
  }
  interval = seconds / 60;
  if (interval > 1) {
    const minuteQuantity = Math.floor(interval);
    if (minuteQuantity === 1) {
      return minuteQuantity + ' minute';
    } else {
      return minuteQuantity + ' minutes';
    }
  }
  return Math.floor(seconds) + " seconds";
}
