export = (oldDate: number, newDate = Date.now()) =>
  new Date(oldDate).setHours(0, 0, 0, 0) === new Date(newDate).setHours(0, 0, 0, 0);