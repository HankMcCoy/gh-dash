import flatMapOrig from 'lodash/fp/flatMap'

const flatMap = flatMapOrig.convert({ cap: false })

const intersperse = separator =>
  flatMap((v, i, values) => {
    const s = typeof separator === 'function' ? separator(i) : separator
    return i === values.length - 1 ? [v] : [v, s]
  })

export default intersperse
