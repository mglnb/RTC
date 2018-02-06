export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export function promise (t) {
  return new Promise(resolve => {
    return setTimeout(resolve, t)
  })
}