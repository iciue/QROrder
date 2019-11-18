const getTag = (v) => {
  return Object.prototype.toString.call(v).slice(8, -1)
}

// 深度对比两个值是否相等
export function isEqual(obj, other) {
  const objType = getTag(obj)
  const otherType = getTag(other)
  if (objType !== otherType) return false
  if (isNaN(obj) && isNaN(other)) return true

  if (objType === 'Array') {
    return objType.length === other.length ? objType.every((v, i) => isEqual(v, other[i])) : false
  }
  
  if (objType === 'Object') {
    const keys1 = Object.keys(obj).sort()
    const keys2 = Object.keys(other).sort()
    return isEqual(keys1, keys2) && keys1.every((key) => isEqual(obj[key], other[key]))
  }
  
  if (typeof obj === 'object') {
    return String(obj)  === String(other)
  }

  return obj === other // 剩余的基本类型
}

// 根据 字符串 对数组进行分组
export function groupBy(target, str) {
  const ret = {}
  target.forEach(it => {
    const category = it[str] || false
    category && ret[category] ? ret[category].push(it) : ret[category] = [it]
  })
  return ret
}

