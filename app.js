//Variables
let colorDivs = document.querySelectorAll(".color");
let sliders = document.querySelectorAll(".adjust-center");

//Event Listeners

sliders.forEach(slider => {
  slider.addEventListener("input", e => {
    changeColorSilder(e.target);
  });
});

colorDivs.forEach((colorDiv, index) => {
  colorDiv.addEventListener("change", () => {
    updateTextUI(index);
  });
});

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
    let icons = colorDiv.querySelectorAll(".controls div");

    for (icon of icons) {
      checkDarkness(randomColor, icon);
    }

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

function changeColorSilder(target) {
  let divIndex =
    target.getAttribute("data-hue") ||
    target.getAttribute("data-sat") ||
    target.getAttribute("data-bright");

  let colorDiv = colorDivs[divIndex];
  let currentColor = colorDiv.querySelector("h2").innerText;
  let inputs = colorDiv.querySelectorAll("input[type='range']");

  let hue = inputs[0].value;
  let brightness = inputs[1].value;
  let saturation = inputs[2].value;

  let newColor = chroma(currentColor)
    .set("hsl.h", hue)
    .set("hsl.s", saturation)
    .set("hsl.l", brightness);

  colorDiv.style.backgroundColor = newColor;
}

function updateTextUI(index) {
  let header = colorDivs[index].querySelector("h2");
  let icons = colorDivs[index].querySelectorAll(".controls div");
  let color = chroma(colorDivs[index].style.backgroundColor);

  header.innerText = color.hex();

  checkDarkness(color, header);
  for (icon of icons) {
    checkDarkness(color, icon);
  }
}

setColor();
