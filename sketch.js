/**
 * @author Marius Lenzing
 */

var centerX;
var centerY;

var maxBreathingDiameter;
var halfFullDiameter;
var positionOnSinusCurve = 0;

var breathingSpeed;

var screenOrientation;

var lungIsBeingFilled = false;
var lungIsBeingEmptied = false;
var mouseIsInsideCanvas = false;

/**
 * P5.js Method
 * call once before start
 */
function preload() {
  // todo add font
}

/**
 * P5.js Method
 * call once on start
 */
function setup() {
  createCanvas(windowWidth, windowHeight);

  centerX = windowWidth /2;
  centerY = windowHeight /2;

  if (centerX > centerY) {
    screenOrientation = "landscape";
    halfFullDiameter = centerY;
  }
  else {
    screenOrientation = "portrait";
    halfFullDiameter = centerX;
  }

  noStroke();
}

/**
 * P5.js Method
 * call once every frame
 */
function draw() {
  computeInput();
  drawBackground();
  drawLung();
}

/** draws background */
function drawBackground() {
  background("white");
  if (lungIsBeingFilled) {
    background("#e1e1e1");
  }

  fill("black");
  if (lungIsBeingEmptied) {
    fill("#1a1a1a");
  }
  rect(0,0, centerX, windowHeight);
}

/** computes state of breathing animation and renders lung */
function drawLung() {
  breathingSpeed = 1;

  fill("rgba(255,0,0,1)");
  circle(centerX, centerY, computeCircleDiameter());

  fill("rgba(255,0,0,0.5)");
  circle(centerX, centerY, computeCircleDiameter(-0.2) *1.1);

  fill("rgba(255,0,0,0.45)");
  circle(centerX, centerY, computeCircleDiameter(-0.4) *1.2);

  fill("rgba(255,0,0,0.35)");
  circle(centerX, centerY, computeCircleDiameter(-0.6) *1.3);

  fill("rgba(255,0,0,0.3)");
  circle(centerX, centerY, computeCircleDiameter(-0.8) *1.4);

  positionOnSinusCurve += .02 * breathingSpeed;
}

/** math magic */
function computeCircleDiameter(sinusOffset = 0) {
  maxBreathingDiameter = halfFullDiameter /6;

  var result = halfFullDiameter + sin(positionOnSinusCurve + sinusOffset) * maxBreathingDiameter;

  if(result < 0) {
    result = 0;
  }
  return result;
}

/** takes mouse input to increase or decrease lung */
function computeInput() {
  lungIsBeingFilled = false;
  lungIsBeingEmptied = false;

  if (mouseIsInsideCanvas) {

    if (mouseX > centerX) {
      lungIsBeingFilled = true;
      fillLung();
    }
    else {
      lungIsBeingEmptied = true;
      emptyLung();
    }
  }
}

/** makes lung bigger by tiny amount */
function fillLung() {
  halfFullDiameter += 0.1;
}

/** makes lung smaller by tiny amount */
function emptyLung() {
  halfFullDiameter -= 0.1;
}

jQuery(document).mouseleave(function () {
  mouseIsInsideCanvas = false;
});

jQuery(document).mouseenter(function () {
  mouseIsInsideCanvas = true;
});

jQuery(window).resize(function() {
  setup();
});