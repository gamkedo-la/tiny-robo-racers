// Debug
const DEBUG = true;

const KEY_ESC = 27;

const FRAME_RATE = 60;
const FRAME_RATE_DELTA = 1000 / FRAME_RATE;

const DRIVE_POWER = 10 / FRAME_RATE_DELTA;
const GROUNDSPEED_DECAY_MULT = 0.94 / FRAME_RATE_DELTA;

const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 40;
const TRACK_ROWS =  15;
const TRACK_COLS = 20;

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYERSTART = 2;

var TRACK_IMAGES = [];
TRACK_IMAGES[TRACK_ROAD] = 'track_road';
TRACK_IMAGES[TRACK_WALL] = 'track_wall';
