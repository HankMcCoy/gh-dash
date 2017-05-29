import flatMapOrig from 'lodash/fp/flatMap'

const flatMap = flatMapOrig.convert({ cap: false })

const intersperse = separator =>
  flatMap((v, i, values) => (i === values.length - 1 ? [v] : [v, separator]))

export default intersperse
