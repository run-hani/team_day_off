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

/* 날짜별 소팅 */
export function sortAscending (datas, keyName, splite) {
  datas.sort((a, b) => {
    let arr0 = a[keyName].toString().split(splite)
    let arr1 = b[keyName].toString().split(splite)
    let date_a = new Date(arr0[0], arr0[1] - 1, arr0[2])
    let date_b = new Date(arr1[0], arr1[1] - 1, arr1[2])

    if (date_a < date_b) return 1
    if (date_a > date_b) return -1
  })
}
