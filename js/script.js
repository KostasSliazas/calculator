(function () {
  'use strict'
  const BEEP_AUDIO = new window.Audio('data:audio/mp3;base64,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')
  const CALC = document.getElementById('calculator')
  const CALC_SCREEN = document.getElementById('src')
  CALC_SCREEN.value = 0
  let n1 = []
  let n2 = 0
  let op = null
  let lastop = null
  let result = 0

  const sound = () => {
    BEEP_AUDIO.play()
    window.navigator.vibrate(30)
  }

  const add = (n, o) => n + o
  const sub = (n, o) => n - o
  const div = (n, o) => n / o
  const mul = (n, o) => n * o
  const res = (n) => n

  const cals = {
    '/': div,
    '×': mul,
    '+': add,
    '-': sub,
    '=': res
  }

  const cal = (num1, num2, calback) => {
    if (typeof calback === 'function') {
      const n1 = num1.toString().split('.')[1]
      const n2 = num2.toString().split('.')[1]
      const len1 = (n1 && n1.length) || 0
      const len2 = (n2 && n2.length) || 0
      if (lastop !== '/') {
        return parseFloat(calback(Number(num1), Number(num2)).toFixed(len1 + len2))
      }
      return calback(Number(num1), Number(num2))
    }
  }

  const btn = (e) => {
    // if don't mach input or screen or esaund return
    if (!e.target.matches('input') || e.target.id === 'src' || e.target.id === 'esound') return

    // if checked sound play that creapy sound
    if (document.getElementById('esound').checked) sound()


    // set operator when target is fun
    if (e.target.dataset.fun) op = e.target.value

    // when number pressed push to array number
    if (e.target.dataset.num) {
      op = null
      if (n1[0] === '0' && n1[1] !== '.') n1.length = 0
      n1.push(e.target.value)
    }

    // operator delete last number
    if (op === '⌫') {
      n1 = result.toString(10).substring(0, 15).replace(/[^0-9]/g, '.').split('')
      n1.pop()
      n1.join('').charAt(n1.join('').length - 1) === '.' && n1.pop()
    }

    // if no number set 0
    if (!n1.length) n1 = ['0']
    if (op === ',' && !n1.includes('.')) n1.push('.')
    result = n1.join('')


    // operator is /*+-=
    if (op === '/' || op === '×' || op === '+' || op === '-' || op === '=') {
      if (n2 && lastop) result = cal(Number(n2), Number(result), cals[lastop])
      lastop = res(op)
      n2 = result
      n1.length = 0
    }

    // operator clear all
    if (op === 'C') {
      op = lastop = null
      result = n2 = n1.length = 0
    }
    CALC_SCREEN.value = !isFinite(result) ? 'ERROR' : result
    e.stopPropagation()
    e.preventDefault()
    return
  }

  // CALC.addEventListener('click', btn, true)


  document.addEventListener('DOMContentLoaded', init)

  function init() {
    const root = document.documentElement
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min
    const setVariables = vars => Object.entries(vars).forEach(v => {
      if (typeof v[1] === 'function') return v[1]()
      root.style.setProperty(v[0], v[1])
    })
    const myVariables = [{
        'e': () => root.removeAttribute('style')
      },
      {
        '--color0': '#fff',
        '--color1': '#aaa',
        '--color2': '#bbb',
        '--color3': '#777',
        '--color4': '#888'
      },
      {
        '--color0': '#bdddfe',
        '--color1': '#81a1c2',
        '--color2': '#456586',
        '--color3': '#09294a',
        '--color4': '#111'
      },
      {
        '--color0': '#aaa',
        '--color1': '#bbb',
        '--color2': '#777',
        '--color3': '#222',
        '--color4': '#000'
      }
    ]

    var arrayHelper = function () {
      var ob = {}      
      ob.value = ob.full = this.length
      ob.increment = function () {
        this.value = this.value ? --this.value : this.full - 1
      }
      ob.decrement = function () {
        this.value = this.value < this.full - 1 ? ++this.value : 0
      }
      return ob
    }
    const ok = arrayHelper.call(myVariables)
    setVariables(myVariables[parseInt(localStorage.getItem('kktheme')) || 0])

    // everything to handle swipe left/right
    // https://code-maven.com/swipe-left-right-vanilla-javascript

    let startXPos
    let startYPos
    let startTime

    function touchStart(e) {
      e.preventDefault()
      startXPos = e.touches[0].pageX
      startYPos = e.touches[0].pageY
      startTime = new Date()

      CALC_SCREEN.classList.add('blink')
      btn(e)
    }

    function touchEnd(e) {
      e.preventDefault()
      const endXPos = e.changedTouches[0].pageX
      const endYPos = e.changedTouches[0].pageY
      const endTime = new Date()
      const moveX = endXPos - startXPos
      const moveY = endYPos - startYPos
      const elapsedTime = endTime - startTime
      if (Math.abs(moveX) > 30 && Math.abs(moveY) < 30 && elapsedTime < 1000) {
        if (moveX < 0) ok.decrement() // eslint-disable-line
        else ok.increment() // eslint-disable-line

        setVariables(myVariables[ok.value || 0])
        localStorage.setItem('kktheme', ok.value || 0)
      }
      setTimeout(() => CALC_SCREEN.classList.remove('blink'), 99) // blink screen number
    }


    CALC.addEventListener('mousedown', e => {
      CALC_SCREEN.classList.add('blink')
      btn(e)
    })

    CALC.addEventListener('mouseup', e => {
      setTimeout(() => CALC_SCREEN.classList.remove('blink'), 99) // blink screen number
    })

    CALC.addEventListener('touchstart', touchStart)
    CALC.addEventListener('touchend', touchEnd)

  }
})()