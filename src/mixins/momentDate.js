import moment from 'moment'

export function dateYYYY (date) {
  return moment(date).format('YYYY');
}

export function dateM (date) {
  return moment(date).format('M');
}

export function dateYYYYMM (date) {
  return moment(date).format('YYYYMM');
}

export function dateYYYYMMDD (date) {
  return moment(date).format('YYYY-MM-DD');
}

export function dateNewYYYY () {
  let newDate = new Date();
  return moment(newDate).format('YYYY');
}

export function dateNewMM () {
  let newDate = new Date();
  return moment(newDate).format('MM');
}

export function dateNewM () {
  let newDate = new Date();
  return moment(newDate).format('M');
}
