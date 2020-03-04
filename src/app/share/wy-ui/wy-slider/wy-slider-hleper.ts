/***到视口left,top的距离+可能有滚动条的距离**/
export function getElementOffset(el: HTMLElement): { top: number; left: number } {
  // 获取到视口的距离 https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
  const rect = el.getBoundingClientRect();
  const win = el.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageXOffset,
    left: rect.left + win.pageYOffset,
  };
}
