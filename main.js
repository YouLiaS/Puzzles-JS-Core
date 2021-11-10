$(() => {

  const stg = {
    getRandomDight(to = 16, from = 1) {
      return Math.floor(Math.random() * to) + from
    },
    getPuzleItem(count) {
      return `<div class="piece" data-count="${count}"></div>`
    },
    getEmptyDiv(cls = 'drag', count = 16) {
      let layout = ''
      for (let i = 0; i < count; i++) {
        layout += `<div class="${cls}" data-api="${i + 1}""></div>`
      }
      return layout
    },
    getRandomArr(targetLength = 16) {
      const arr = []
      let index
      while (arr.length !== targetLength) {
        index = this.getRandomDight()
        if (!arr.includes(index)) {
          arr.push(index)
        }
      }
      return arr
    },
    _$(selector) {
      return document.querySelector(selector)
    },
    Matched(apis, idxs) {
      for (let i = 0; i < apis.length; i++) {
        if (apis[i] !== idxs[i]) {
          return false
        }
      }
      return true
    },
    init() {
      const root = this._$('.pieces-block')
      const solutionRoot = this._$('.puzzle-block')
      const randomArr = this.getRandomArr()
      root.innerHTML = ''
      solutionRoot.innerHTML = stg.getEmptyDiv()
      randomArr.forEach(i => {
        root.insertAdjacentHTML('beforeend', this.getPuzleItem(i))
      })
      $('.piece').draggable({
        revert: true,
        revertDuration: 500,
      })
      $('.drag').droppable({
        accept: '.piece',
        drop: function (event, ui) {
          let draggableElement = ui.draggable
          let droppedOn = $(this)
          $(draggableElement).css({
            top: 0,
            left: 0,
            position: 'relative'
          }).appendTo(droppedOn)
        }
      })
    }
  }

  // Start Timer function
  let interval
  const time = {
    sec: 59,
    startInterval() {
      time.sec = 59
      interval = setInterval(() => {
        if (time.sec >= 0) {
          $('.timer').text(`00:${time.sec > 9? time.sec : '0' + time.sec}`)
          $('.messages-timer').text(`You still have time, you sure? 00:${time.sec > 9? time.sec : '0' + time.sec}`)
        }
        time.sec -= 1
      }, 1000)
    },
    stopInterval() {
      clearInterval(interval)
    }
  }

  $('#new-game').click(function () {
    stg.init()
    $('#start-game').removeClass('disabled').prop('disabled', false)
    $('.messages-timer').removeClass('hidden')
    $('.timer').text('01:00')
  })

  $('#start-game').click(function () {
    $('#check-result').removeClass('disabled').prop('disabled', false)
    $('#new-game').addClass('disabled').prop('disabled', true)
    $(this).addClass('disabled').prop('disabled', true)
    time.startInterval()
  })

  $('#check-result').click(function () {
    let a = []
    let b = []
    for (let i = 0; i < $('.puzzle-block').children().length; i++) {

      let api = $('.puzzle-block').children()[i].dataset.api

      if (!$('.puzzle-block').children()[i].children[0]) {
        b.push('false')
      } else {
        let idx = $('.puzzle-block').children()[i].children[0].dataset.idx
        b.push(idx)
      }
      a.push(api)

      $('.modal').removeClass('hidden')
      $('.bg').removeClass('hidden')

      $('#modal-close').click(function () {
        $('.modal').addClass('hidden')
        $('.bg').addClass('hidden')
      })

      $('#modal-check').click(function () {
        $('.messages-timer').addClass('hidden')
        $('#new-game').removeClass('disabled').prop('disabled', false)
        $('#check-result').addClass('disabled').prop('disabled', true)
        if (!stg.Matched(a, b)) {
          $('.messages-title').text("It's a pity, but you lost")
        } else if (stg.Matched(a, b)) {
          $('.messages-title').text("Woohoo, well done, you did it!")
        }
        time.stopInterval()
      })
    }
  })

  stg.init()
})