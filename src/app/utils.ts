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

export function shuffle<T>(arr: T[]): T[] {
  const arrList = arr.slice(); // 小技巧相当于原数组的拷贝,原数组不变
  for (let i = 0; i < arrList.length; i++) {
    const j = getRandomInt(0, i);
    const t = arrList[i];
    arrList[i] = arrList[j];
    arrList[j] = t;
  }
  return arrList;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
