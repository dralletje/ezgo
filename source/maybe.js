// MAYBE
let Success = value => {
  return {
    success: true,
    value: value,

    map: fn => Success(fn(value)),
    flatMap: fn => {
      // Make sure the returned value has .success and .value
      let result = fn(value)
      if (typeof result.success !== 'boolean' || typeof result.flatMap !== 'function') {
        throw new Error('(Flat)Mapper function does not return a Maybe!')
      }
      return result
    },
  }
}

let Failure = message => {
  let failure = {
    success: false,
    value: message,

    map: fn => failure,
    flatMap: fn => failure,
  }
  return failure
}

export {Success, Failure}
