(function () {
  'use strict'

  const calc = document.getElementById('calculator')
  const calcScreen = document.getElementById('src')
  calcScreen.value = 0
  let firstNumber = ['0']
  let secondNumber = 0
  let operator = null
  let lastopOperator = null
  let result = 0
  const add = (n, o) => (n % 1 !== 0 || o % 1 !== 0) ? ((n * 10) + (o * 10)) / 10 : n + o
  const sub = (n, o) => (n % 1 !== 0 || o % 1 !== 0) ? ((n * 10) - (o * 10)) / 10 : n - o
  const mul = (n, o) => (n % 1 === 0 && o % 1 === 0) ? n * o : ((n * 10) * (o * 10)) / 100
  const div = (n, o) => ((n !== o) && (n % 1 !== 0 || o % 1 !== 0)) ? (n * 10) / (o * 10) : n / o
  const res = n => n

  const cal = (num1, num2, calback) => {
    if (typeof calback === 'function') {
      return calback(num1, num2)
    }
  }

  const cals = {
    '/': div,
    '*': mul,
    '+': add,
    '-': sub,
    '=': res
  }

  const btn = e => {
    // if target !== input || id === src (sreen) || id === esoud return false and do nothing
    if (e.target.tagName !== 'INPUT' || e.target.id === 'src' || e.target.id === 'esound') return false
    operator = null

    // if e.target data === num push value (number)
    if (e.target.dataset.num) {
      if (firstNumber[0] === '0' && firstNumber[1] !== '.') firstNumber.length = 0
      firstNumber.push(e.target.value)
      // operator null after num click
    }
    // set operator
    if (e.target.dataset.fun) operator = e.target.value
    if (operator === '⌫') {
      firstNumber = result
        .toString(10)
        .substring(0, 15)
        .replace(/[^0-9]/g, '.')
        .split('')
      result = 0
      lastopOperator = null
      firstNumber.pop()
    }

    (!firstNumber.length) && (firstNumber = ['0'])

    if (operator === ',' && !firstNumber.includes('.')) {
      firstNumber.push('.')
    }

    result = firstNumber.join('')

    if (operator === '/' || operator === '*' || operator === '+' || operator === '-' || operator === '=') {
      if (lastopOperator === operator) return false
      firstNumber.length = 0
      if (secondNumber && lastopOperator) {
        result = cal(parseFloat(secondNumber), parseFloat(result), cals[lastopOperator])
      }
      secondNumber = result
      lastopOperator = res(operator)
    }

    if (!isFinite(result)) {
      calcScreen.value = 'Ooops!'
      return
    }

    if (operator === 'C') {
      firstNumber.length = 0
      secondNumber = 0
      result = 0
      calcScreen.value = '0'
    }

    calcScreen.value = result

    // play some creepy sound
    if (document.getElementById('esound').checked) sound()
  }

  calc.addEventListener('click', btn, true)
  const snd = new window.Audio(
    'data:audio/mp3;base64,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'
  )

  function sound () {
    snd.play()
    window.navigator.vibrate(30)
  }
})()
