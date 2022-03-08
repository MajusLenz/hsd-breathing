/**
 * @author Marius Lenzing
 */

var centerX;
var centerY;

var maxBreathingDiameter;
var originalHalfFullDiameter;
var halfFullDiameter;
var tooEmptyDiameter;
var tooFullDiameter;
var currentDiameter

var positionOnSinusCurve = 0;

var screenOrientation;

var lungIsBeingFilled = false;
var lungIsBeingEmptied = false;
var mouseIsInsideCanvas = false;
var endStateIsActive = false;

var lifeSpeed = 300; // TODO make slower
var numberOfLifeShapes = 0;
var oldLifeShapesBackground;
var newestLifeShape = null;
var oldLifeShapes = [];
var createLifeInterval;
var gradient;


/**
 * P5.js Method
 * call once before start
 */
function preload() {
  // Check if Countdown is active
  if (sessionStorage.getItem("countdown")) {
    var deathReason = sessionStorage.getItem("deathReason");
    if (deathReason) {
      jQuery("#endscreen").addClass(deathReason);
    }
    document.getElementById("endscreen").style.display = "unset";
    noLoop();
    triggerEndState();
  }
  else {
    gradient = loadImage('../assets/images/gradient.png');

    jQuery(document).mouseleave(function () {
      mouseIsInsideCanvas = false;
    });

    jQuery(document).mouseenter(function () {
      mouseIsInsideCanvas = true;
    });

    jQuery(window).resize(setup);
  }
}

/**
 * P5.js Method
 * call once on start
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  centerX = windowWidth / 2;
  centerY = windowHeight / 2;

  if (centerX > centerY) {
    screenOrientation = "landscape";
    originalHalfFullDiameter = centerY;
  }
  else {
    screenOrientation = "portrait";
    originalHalfFullDiameter = centerX;
  }

  halfFullDiameter = originalHalfFullDiameter;
  tooEmptyDiameter = originalHalfFullDiameter / 6;
  tooFullDiameter = originalHalfFullDiameter * 2.3;

  oldLifeShapesBackground = createGraphics(windowWidth, windowHeight);

  // create new lifeShape after some seconds
  createLifeInterval = setInterval(function () {
    createNewLifeShape();
  }, lifeSpeed);
}

/**
 * P5.js Method
 * call once every frame
 */
function draw() {
  if (endStateIsActive) {
    return;
  }
  computeInput();
  drawBackground();
  drawLife();
  drawLung();
}

/** takes mouse input to increase or decrease lung */
function computeInput() {
  lungIsBeingFilled = false;
  lungIsBeingEmptied = false;

  if (mouseIsInsideCanvas) {

    if (mouseX > centerX) {
      lungIsBeingEmptied = true;
      emptyLung();
    }
    else {
      lungIsBeingFilled = true;
      fillLung();
    }
  }

  maxBreathingDiameter = halfFullDiameter / 6;
  currentDiameter = computeCircleDiameter();

  if (currentDiameter <= tooEmptyDiameter) {
    jQuery("#endscreen").addClass("lung-was-to-empty");
    sessionStorage.setItem("deathReason", "lung-was-to-empty");
    triggerEndState();
  }
  if (currentDiameter >= tooFullDiameter) {
    jQuery("#endscreen").addClass("lung-was-to-full");
    sessionStorage.setItem("deathReason", "lung-was-to-full");
    triggerEndState();
  }
}

/** draws background */
function drawBackground() {
  background("white");
  if (lungIsBeingEmptied) {
    background("#e1e1e1");
  }

  fill("black");
  if (lungIsBeingFilled) {
    fill("#1a1a1a");
  }
  rect(0, 0, centerX, windowHeight);
}

/** computes state of the green background shapes and renders them */
function drawLife() {
  // draw old shapes
  image(oldLifeShapesBackground, 0, 0);

  // draw new lifeShape
  if (newestLifeShape) {


    // TODO


  }
}

/** computes state of breathing animation and renders lung */
function drawLung() {
  noStroke();

  var transparencyModifier = map(currentDiameter, tooEmptyDiameter, originalHalfFullDiameter, 0, 1, true);
  var saturation = Math.floor( map(currentDiameter, tooEmptyDiameter, tooFullDiameter, 200, 0, true) );
  var breathingSpeed = map(currentDiameter, originalHalfFullDiameter, tooFullDiameter, 1, 7, true);

  // draw main circle
  var transparency = 1 * transparencyModifier;
  fill("rgba(" + saturation +"," + saturation + ",255," + transparency + ")");
  circle(centerX, centerY, currentDiameter);

  // draw outer circles
  transparency = 0.5 * transparencyModifier;
  fill("rgba(" + saturation +"," + saturation + ",255," + transparency + ")");
  circle(centerX, centerY, computeCircleDiameter(-0.2) *1.1);

  transparency = 0.45 * transparencyModifier;
  fill("rgba(" + saturation +"," + saturation + ",255," + transparency + ")");
  circle(centerX, centerY, computeCircleDiameter(-0.4) *1.2);

  transparency = 0.35 * transparencyModifier;
  fill("rgba(" + saturation +"," + saturation + ",255," + transparency + ")");
  circle(centerX, centerY, computeCircleDiameter(-0.6) *1.3);

  transparency = 0.3 * transparencyModifier;
  fill("rgba(" + saturation +"," + saturation + ",255," + transparency + ")");
  circle(centerX, centerY, computeCircleDiameter(-0.8) *1.4);

  positionOnSinusCurve += 0.02 * breathingSpeed;
}

/** math magic */
function computeCircleDiameter(sinusOffset = 0) {
  var result = halfFullDiameter + sin(positionOnSinusCurve + sinusOffset) * maxBreathingDiameter;

  if (result < 0) {
    result = 0;
  }
  return result;
}

/** makes lung bigger by tiny amount */
function fillLung() {
  halfFullDiameter += 0.1;
}

/** makes lung smaller by tiny amount */
function emptyLung() {
  halfFullDiameter -= 0.1;
}


/** create data for new green rectangle and add old data to static background */
function createNewLifeShape() {
  // add current lifeShape to old lifeShapes
  if (newestLifeShape !== null) {
    oldLifeShapesBackground.image(gradient, newestLifeShape.x, newestLifeShape.y, newestLifeShape.w, newestLifeShape.h);
    numberOfLifeShapes++;
    newestLifeShape = null;
  }

  // if lung is healthy add new lifeShape
  var lungIsHealthy = mouseIsInsideCanvas
      && currentDiameter > tooEmptyDiameter * 3
      && currentDiameter < tooFullDiameter / 1.2;

  if (!lungIsHealthy) {
    return;
  }

  var rectWidth = windowWidth / 8;

  var x = random([0, rectWidth, rectWidth *2, rectWidth *3, rectWidth *4, rectWidth *5, rectWidth *6, rectWidth *7]);

  var rectHeight = random(100, windowHeight * 0.55);

  var y = Math.random() < 0.5 ? 0 : windowHeight;
  if (y !== 0) { // rect is on bottom
    y = y - rectHeight;
  }

  var maxTransparency = 1;

  newestLifeShape = {x:x, y:y, w:rectWidth, h:rectHeight, maxTransparency:maxTransparency, currentTransparency:0};
}


// ENDSTATE:

/** Stops breathing. Shows overlay with restart-countdown */
function triggerEndState() {
  endStateIsActive = true;

  jQuery(window).off("resize", setup);

  document.getElementById("endscreen").style.display = "flex";

  var timeLeft = sessionStorage.getItem("countdown");
  if (timeLeft > 0) {
    seconds = timeLeft;
  } else {
    // Set the date we're counting down to
    var countDownDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).getTime();
    //console.log(timeLeft);
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
    //console.log(seconds)

    // Display the result in the element with id="endscreen"
    document.getElementById("countdown").innerHTML = (hours > 9 ? "" : "0") + hours + ":"
      + (minutes > 9 ? "" : "0") + minutes + ":" + (seconds > 9 ? "" : "0") + seconds + "";

    // If the count down is finished, write some text
    if (distance <= 0) {
      clearInterval(x);
      sessionStorage.removeItem("countdown");
      window.location.reload();
    }
  }, 1000);
}