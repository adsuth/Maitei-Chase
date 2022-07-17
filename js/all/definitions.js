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
var MODAL_SHOWN = false
var FADE_DURATION = 0

var IS_MUTED = false
const BGM_MAX_VOLUME = 0.5
const SFX_MAX_VOLUME = 1.0

const nextPage = document.getElementById( "next_page_button" )
const prevPage = document.getElementById( "prev_page_button" )