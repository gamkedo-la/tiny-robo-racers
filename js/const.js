// Debug
var DEBUG = true;
var TRACK_SCREENSHOT = false;
const STRESSTEST_AI = false; // add 20 more cars with random attributes

var IS_EDITOR = false;

const EDITOR_PENCIL = 1;
const EDITOR_BUCKET = 2;

const KEY_ESC = 27;
const KEY_D = 68;
const KEY_E = 69;
const KEY_S = 83;
const KEY_T = 84;

const FRAME_RATE = 60;
const FRAME_RATE_DELTA = 1000 / FRAME_RATE;

const DRIVE_POWER = 10 / FRAME_RATE_DELTA;
const GROUNDSPEED_DECAY_MULT = 0.94 / FRAME_RATE_DELTA;

const SENSOR_MIN_LENGTH = 10;
const SENSOR_MAX_LENGTH = 100;

const GAME_FONT = 'bold 16pt Verdana';
const GAME_FONT_LARGE = 'bold 36pt Verdana';
const GAME_FONT_BUTTON = '13pt Verdana';

const TRACK_WIDTH = 10;
const TRACK_HEIGHT = 10;
const TRACK_COLS = 120;
const TRACK_ROWS = 74;

const TRACK_PADDING_TOP = 60;

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYERSTART = 2;

const TRACK_GOALSTART = 3;
const TRACK_GOALEND = 4;

var TRACK_IMAGES = [];
TRACK_IMAGES[TRACK_ROAD] = 'track_road';
TRACK_IMAGES[TRACK_WALL] = 'track_wall';
TRACK_IMAGES[TRACK_PLAYERSTART] = 'track_playerstart';
