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

  centerX = windowWidth / 2;
  centerY = windowHeight / 2;

  if (centerX > centerY) {
    screenOrientation = "landscape";
    halfFullDiameter = centerY;
  }
  else {
    screenOrientation = "portrait";
    halfFullDiameter = centerX;
  }

  noStroke();

  // Check if Countdown is active
  if (sessionStorage.getItem("countdown")) {
    document.getElementById("endscreen").style.display = "unset"
    noLoop();
    triggerEndState();
  }
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
  rect(0, 0, centerX, windowHeight);
}

/** computes state of breathing animation and renders lung */
function drawLung() {
  breathingSpeed = 1;

  fill("rgba(0,0,255,1)");
  circle(centerX, centerY, computeCircleDiameter());

  fill("rgba(0,0,255,0.5)");
  circle(centerX, centerY, computeCircleDiameter(-0.2) * 1.1);

  fill("rgba(0,0,255,0.45)");
  circle(centerX, centerY, computeCircleDiameter(-0.4) * 1.2);

  fill("rgba(0,0,255,0.35)");
  circle(centerX, centerY, computeCircleDiameter(-0.6) * 1.3);

  fill("rgba(0,0,255,0.3)");
  circle(centerX, centerY, computeCircleDiameter(-0.8) * 1.4);

  positionOnSinusCurve += .02 * breathingSpeed;
  if ((computeCircleDiameter(-0.8) * 1.4) == 0) {
    noLoop();
    triggerEndState();
    return;
  }
}

/** math magic */
function computeCircleDiameter(sinusOffset = 0) {
  maxBreathingDiameter = halfFullDiameter / 6;

  var result = halfFullDiameter + sin(positionOnSinusCurve + sinusOffset) * maxBreathingDiameter;

  if (result < 0) {
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
  halfFullDiameter -= 0.9;
}

jQuery(document).mouseleave(function () {
  mouseIsInsideCanvas = false;
});

jQuery(document).mouseenter(function () {
  mouseIsInsideCanvas = true;
});

jQuery(window).resize(function () {
  setup();
});


// ENDSTATE:

/** Stops breathing. Shows overlay with restart-countdown */
function triggerEndState() {
  document.getElementById("endscreen").style.display = "flex";

  var timeLeft = sessionStorage.getItem("countdown");
  if (timeLeft > 0) {
    seconds = timeLeft;
  } else {
    // Set the date we're counting down to
    var countDownDate = new Date(new Date().getTime() + (60 * 1000)).getTime();
    console.log(timeLeft);
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var seconds = Math.floor((countDownDate - now) / 1000);
    sessionStorage.setItem("countdown", seconds);
  }

  // Update the count down every 1 second
  var x = setInterval(function () {
    // Get today's date and time

    let distance = sessionStorage.getItem("countdown") - 1;
    sessionStorage.setItem("countdown", distance);

    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
    var minutes = Math.floor((distance % (60 * 60)) / (60));
    var seconds = Math.floor((distance % (60)));
    console.log(seconds)

    // Display the result in the element with id="endscreen"
    document.getElementById("countdown").innerHTML = (hours > 9 ? "" : "0") + hours + ":"
      + (minutes > 9 ? "" : "0") + minutes + ":" + (seconds > 9 ? "" : "0") + seconds + "";

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      loop();
      sessionStorage.removeItem("countdown");
      document.getElementById("endscreen").style.display = "none";
    }
  }, 1000);
}