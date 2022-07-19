/******************************************
*     Global Definitions
******************************************/

// These are over-written depending on the page/ state

// Players
var PLAYER = "Player"
var CHASER = "Chaser"

// CSV Path
const QUESTIONS_CSV_PATH = "./questions.csv"

var KEY_BINDS = {}

var TIMER = null
const TIMER_INCREMENT = 10

var MODAL_SHOWN = false
var FADE_DURATION = 0

var IS_MUTED = false

var BGM_VOLUME = localStorage.getItem( "BGM_VOLUME" ) ?? 0.5
var SFX_VOLUME = localStorage.getItem( "SFX_VOLUME" ) ?? 1.0

const sfx_volume = document.getElementById( "sfx_volume" )
const bgm_volume = document.getElementById( "bgm_volume" )

const nextPage = document.getElementById( "next_page_button" )
const prevPage = document.getElementById( "prev_page_button" )