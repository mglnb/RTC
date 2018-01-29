
/**
 * Função para utilizar uma promise e simular async
 * @export
 * @param {Number} t
 * @returns
 */
export function promise (t) {
  return new Promise(resolve => {
    return setTimeout(resolve, t)
  })
}

/**
 * @export
 * @param {string} type ['log', 'error', 'warn']
 * @param {string} color ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'brown']
 * @param {String[]} msg 
 */
export function log (msg, type = 'log', color = 'blue') {
  let colors = {
    'gray': 'font-weight: bold; color: #1B2B34;',
    'red': 'font-weight: bold; background-color: #EC5f67; color: #FFFFFF;',
    'orange': 'font-weight: bold; color: #F99157;',
    'yellow': 'font-weight: bold; color: #FAC863;',
    'green': 'font-weight: bold; color: #99C794;',
    'teal': 'font-weight: bold; color: #5FB3B3;',
    'blue': 'font-weight: bold; color: #6699CC;',
    'purple': 'font-weight: bold; color: #C594C5;',
    'brown': 'font-weight: bold; color: #AB7967;'
  }
  if (type === 'log') {
    console.log(`%c${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Log: %c %s`, `color: ${colors[color]}, font-size: 16px`, '', msg.toString())
  } else if (type === 'error') {
    console.error(`%c${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Error: %c %s`, `color: ${colors.red}, font-size: 16px`, '', msg.toString())
  } else {
    console.log(`%c${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Warning: %c %s`, `color: ${colors.yellow}, font-size: 16px`, '', msg.toString())
  }
}
