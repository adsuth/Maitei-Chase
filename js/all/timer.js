/******************************************
*     Timer
******************************************/
// ps: i stole this from my other project :)
class Timer {
  constructor(root, settings = {}) {
    this.root = root

    this.started = false
    this.running = false

    this.interval = null
    this.INTERVAL_LENGTH = settings?.interval ?? 10

    this.maxSeconds = settings?.secs ?? 30
    this.maxMinutes = settings?.mins ?? 1

    this.goBeyondRange = settings?.mins ?? false
    this.timerEndCallback = settings?.timerEndCallback ?? function() {}
    
    this.milliseconds = 0
    this.seconds = this.maxSeconds
    this.minutes = this.maxMinutes
  }

  start() {
    this.started = true
    this.running = true

    this.interval = setInterval( () => {
      this.update()
    }, this.INTERVAL_LENGTH )
  }

  play( cb = () => {}  ) {
    this.running = true

    this.interval = setInterval(() => {
      this.update()
    }, this.INTERVAL_LENGTH )
    cb()
  }
  
  stop( cb = () => {} ) {
    this.running = false

    if ( this.interval ) {
      clearInterval( this.interval )
    }
    cb()
  }

  /**
   * Toggle the state of the timer. This can also start the timer.
   * @returns TRUE if it started playing; FALSE if it was stopped 
   */
  toggle() {
    if ( !TIMER.started ) { TIMER.start(); return true }
    
    if ( TIMER.running ) { TIMER.stop(); return false }
    else { TIMER.play(); return true }
  }

  reset() {
    this.stop()
    this.started = false
    this.running = false
    
    if ( this.interval )
    {
      clearInterval( this.interval )
      this.interval = null
    }
    
    this.milliseconds = 0
    this.seconds = this.maxSeconds
    this.minutes = this.maxMinutes
    this.updateDisplay()
  }

  /**
   * Extend the timer by adding seconds
   * @param {Number} secs Seconds to be added to timer
   */
  addTime(secs = 2) {
    this.seconds += secs
    if (this.seconds > 59) {
      this.minutes++
      this.seconds %= 60
    }
    if ( this.goBeyondRange && this.seconds > this.maxSeconds )
    {
      this.seconds = this.maxSeconds
    }

    this.updateDisplay()
  }

  removeTime(secs = 2) {
    this.seconds -= secs
    
    if ( this.seconds < 0 ) {
      this.minutes--
      this.seconds = 60 - Math.abs( this.seconds )
    }

    if ( this.minutes < 0 ) { 
      this.minutes = 0
      this.seconds = 0

      this.updateDisplay()
      this.stop()
      this.timerEndCallback()
      return 
    }   

    this.updateDisplay()
  }


  update() {
    this.milliseconds -= this.INTERVAL_LENGTH
    
    // time up
    if (this.minutes <= 0 && this.seconds <= 0 && this.milliseconds <= 0) {
      // end game
      this.stop()
      return this.timerEndCallback()
    }

    // if a second has passed
    if ( this.milliseconds < 0 )
    {
      this.seconds--
      this.milliseconds = 1000
    }

    // if a minute has passed
    if (this.seconds < 0) {
      this.minutes--
      this.seconds = 59
    }
    this.updateDisplay()
  }

  updateDisplay() {
    let displaySeconds = "" + this.seconds

    // format if seconds too short
    if (this.seconds.toString().length < 2) {
      displaySeconds = "0" + displaySeconds
    }

    document.getElementById( this.root ).innerHTML = 
      `${ this.minutes }:${displaySeconds}`
  }
}