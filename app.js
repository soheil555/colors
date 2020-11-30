//Variables
let colorDivs = document.querySelectorAll(".color");

//Event Listeners

//Functions

function genreateColor() {
  let randomColor = chroma.random();

  return randomColor;
}

function setColor() {
  colorDivs.forEach(colorDiv => {
    let hexText = colorDiv.children[0];

    let randomColor = genreateColor();
    colorDiv.style.backgroundColor = randomColor;

    hexText.innerHTML = randomColor;
    checkDarkness(randomColor, hexText);

    let color = chroma(randomColor);
    let inputs = colorDiv.querySelectorAll("input");

    let hue = inputs[0];
    let brightness = inputs[1];
    let saturation = inputs[2];

    setAdjust(color, hue, brightness, saturation);
  });
}

function setAdjust(color, hue, brightness, saturation) {
  //Hue set
  hue.style.backgroundImage = `linear-gradient(to right, red 0%, #ff0 17%, lime 33%, cyan 50%, blue 66%, #f0f 83%, red 100%)`;

  //Brightness set
  let midbrightness = color.set("hsl.l", 0.5);
  let brightScale = chroma.scale(["black", midbrightness, "white"]);
  brightness.style.backgroundImage = `linear-gradient(to right,${brightScale(
    0
  )},${brightScale(0.5)},${brightScale(1)})`;

  //Saturation set
  let noSat = color.set("hsl.s", 0);
  let fullSat = color.set("hsl.s", 1);

  let satScale = chroma.scale([noSat, color, fullSat]);

  saturation.style.backgroundImage = `linear-gradient(to right,${satScale(
    0
  )},${satScale(1)})`;
}

function checkDarkness(color, text) {
  let darkNess = chroma(color).luminance();
  if (darkNess > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

setColor();
