/***数组是否包含某项**/
export function inArr(arr: any[], target: any): boolean {
  return arr.indexOf(target) > -1;
}

/***限制数的范围**/
export function limitNumberInRange(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/***获取百分比**/
export function _getPercent(val: number, min: number, max: number) {
  return ((val - min) / (max - min)) * 100;
}

/***判断是否为NAN,返回值为true说明不是数字**/
export function assertValueValid(value: any): boolean {
  const a = (typeof value !== 'number') ? parseFloat(value) : value;
  return isNaN(a);
}

/***时钟补零**/
export function pad(num: number, n: number = 2) {
  let len = num.toString().length;
  let str = num.toString();
  while (len < n) {
    str = '0' + str;
    len++;
  }
  return str;
}
