
function createFetcher (func) {
  const cache = {}

  return {
    read(...args) {
      const key = args.join('')
      if (key in cache) {
        return cache[key]
      } else {
        throw func(...args).then(v => cache[key] = v)
      }
    }, 
  }
}

export default createFetcher