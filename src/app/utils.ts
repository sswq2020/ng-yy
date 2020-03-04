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
