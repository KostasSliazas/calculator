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
  const add = (n, o) => n + o
  const sub = (n, o) => n - o
  const mul = (n, o) => n * o
  const div = (n, o) => n / o
  const res = n => n
  const snd = new window.Audio('data:audio/mp3;base64,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')
  const cal = (num1, num2, calback) => {
    if (typeof calback === 'function') {
      const n1 = num1.toString()?.split('.')[1]?.length || 0
      const n2 = num2.toString()?.split('.')[1]?.length || 0
      if (typeof n1 !== 'undefined' || typeof n2 !== 'undefined') return parseFloat(calback(num1, num2).toFixed(n1 + n2))
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
    if (e.target.tagName !== 'INPUT' || e.target.id === 'src' || e.target.id === 'esound') return
    operator = null // operator null after num click
    if (e.target.dataset.num) {
      if (firstNumber[0] === '0' && firstNumber[1] !== '.') firstNumber.length = 0
      firstNumber.push(e.target.value)
    }

    // set operator
    if (e.target.dataset.fun) operator = e.target.value

    // delete operator remove one digit
    if (operator === '⌫') {
      firstNumber = result.toString(10).substring(0, 15).replace(/[^0-9]/g, '.').split('')
      result = 0
      lastopOperator = null
      firstNumber.pop()
      firstNumber.join('').charAt(firstNumber.join('').length - 1) === '.' && firstNumber.pop()
    }

    if (!firstNumber.length) firstNumber = ['0']
    if (operator === ',' && !firstNumber.includes('.')) firstNumber.push('.')

    result = firstNumber.join('')

    if (operator === '/' || operator === '*' || operator === '+' || operator === '-' || operator === '=') {
      firstNumber.length = 0
      if (secondNumber && lastopOperator) {
        result = cal(Number(secondNumber), Number(result), cals[lastopOperator])
      }
      secondNumber = result
      console.log(operator)
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

    calcScreen.classList.add('blink')
    const tim = window.setTimeout(() => {
      calcScreen.classList.remove('blink')
      window.clearTimeout(tim)
    }, 100)
    // play some creepy sound
    if (document.getElementById('esound').checked) sound()
  }

  calc.addEventListener('click', btn, true)

  function sound () {
    snd.play()
    window.navigator.vibrate(30)
  }
})()
