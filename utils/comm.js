function isEmpty(obj) {
  return typeof obj === 'undefined' || obj === null;
}

function findNames(arrayOfDict, type) {
  let findItems = arrayOfDict.filter(item => item.type === type);
  let names = findItems.map(item => {
    // 如果 name 属性是数组，则展开数组并返回元素；否则直接返回 name
    return Array.isArray(item.name) ? item.name : [item.name];
  });
  // 展开所有数组元素到一个新数组
  return names.flat();
}
function hexToRGBA(hex, alpha = 1) {
  // 移除 '#' 
  hex = hex.replace(/^#/, '');
  // 转换十六进制颜色到 RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 创建 RGBA 字符串
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  return rgba;
}

function countTypes(arrayOfDict, typeName) {
  let count = 0;
  arrayOfDict.forEach(item => {
    if (item.type === typeName) {
      count++;
    }
  })
  return count
}
module.exports = {isEmpty, findNames, hexToRGBA, countTypes};