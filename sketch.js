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

/**
 * P5.js Method
 * call once before start
 */
function preload() {

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
    background("#EEEEEEFF");
  }

  fill("black");
  if (lungIsBeingEmptied) {
    fill("#111111FF");
  }
  rect(0,0, centerX, windowHeight);
}

/** computes state of breathing animation and renders lung */
function drawLung() {
  fill("blue");

  maxBreathingDiameter = halfFullDiameter /6;

  breathingSpeed = 1;

  var currentDiameter = halfFullDiameter + sin(positionOnSinusCurve) * maxBreathingDiameter;

  circle(centerX, centerY, currentDiameter);

  positionOnSinusCurve += .02 * breathingSpeed;
}

/** takes mouse input to increase or decrease lung */
function computeInput() {
  lungIsBeingFilled = false;
  lungIsBeingEmptied = false;

  if (mouseIsPressed) {

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
  //console.log("fill");
}

/** makes lung smaller by tiny amount */
function emptyLung() {
  halfFullDiameter -= 0.1;
  //console.log("empty");
}
