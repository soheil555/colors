//Variables
let colorDivs = document.querySelectorAll(".color");
let sliders = document.querySelectorAll(".adjust-center");
let hexValues = document.querySelectorAll(".color h2");
let copySection = document.querySelector(".copied");
let saveBox = document.querySelector(".save-box");
let adjustButtons = document.querySelectorAll(".adjust");
let adjustCloses = document.querySelectorAll(".adjust-close");
let generateBtn = document.querySelector(".generate button");
let lockButtons = document.querySelectorAll(".lock");
let saveButton = document.querySelector(".save button");
let closeButton = document.querySelector(".save-close");
let savePaletteButton = document.querySelector(".save-palette");
let paletteNameInput = document.querySelector(".palette-name");
let initialColors;

//Event Listeners
sliders.forEach(slider => {
  slider.addEventListener("input", e => {
    changeColorSilder(e.target);
  });
});

savePaletteButton.addEventListener("click", savePalette);

saveButton.addEventListener("click", () => {
  saveBox.classList.add("active");
});

closeButton.addEventListener("click", () => {
  saveBox.classList.remove("active");
});

lockButtons.forEach((lockBtn, index) => {
  lockBtn.addEventListener("click", () => {
    lockColor(index);
  });
});

generateBtn.addEventListener("click", setColor);

adjustCloses.forEach((adjustClose, index) => {
  adjustClose.addEventListener("click", () => {
    sliders[index].classList.remove("active");
  });
});

adjustButtons.forEach((adjustBtn, index) => {
  adjustBtn.addEventListener("click", () => {
    sliders[index].classList.toggle("active");
  });
});

colorDivs.forEach((colorDiv, index) => {
  colorDiv.addEventListener("change", () => {
    updateTextUI(index);
  });
});

hexValues.forEach((hexValue, index) => {
  hexValue.addEventListener("click", () => {
    copyToClipBoard(index);
  });
});

copySection.addEventListener("transitionend", () => {
  copySection.classList.remove("active");
});

//Functions
function setColor() {
  initialColors = [];

  colorDivs.forEach((colorDiv, index) => {
    let hexText = colorDiv.children[0];
    let baseColor = hexText.innerText;

    if (lockButtons[index].classList.contains("locked")) {
      initialColors.push(baseColor);
    } else {
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

      initialColors.push(color.hex());

      let hue = inputs[0];
      let brightness = inputs[1];
      let saturation = inputs[2];

      setAdjust(color, hue, brightness, saturation);
      updateScroll(color, hue, brightness, saturation);
    }
  });
}

function genreateColor() {
  let randomColor = chroma.random();

  return randomColor;
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
  let currentColor = initialColors[divIndex];
  let inputs = colorDiv.querySelectorAll("input[type='range']");

  let hue = inputs[0];
  let brightness = inputs[1];
  let saturation = inputs[2];

  let newColor = chroma(currentColor)
    .set("hsl.h", hue.value)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value);

  colorDiv.style.backgroundColor = newColor;

  setAdjust(newColor, hue, brightness, saturation);
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

function updateScroll(color, hue, brightness, saturation) {
  hue.value = Math.floor(color.hsl()[0]);
  saturation.value = Math.floor(color.hsl()[1] * 100) / 100;
  brightness.value = Math.floor(color.hsl()[2] * 100) / 100;
}

function copyToClipBoard(index) {
  let textA = document.createElement("textarea");
  textA.value = hexValues[index].innerText;

  document.body.appendChild(textA);
  textA.select();
  document.execCommand("copy");
  document.body.removeChild(textA);

  copySection.classList.add("active");
}

function lockColor(index) {
  let lockBtn = lockButtons[index];

  lockBtn.classList.toggle("locked");

  if (lockBtn.classList.contains("locked")) {
    lockBtn.innerHTML = '<i class="fas fa-lock"></i>';
  } else {
    lockBtn.innerHTML = '<i class="fas fa-lock-open"></i>';
  }
}

function savePalette() {
  let palettes = undefined;

  if (localStorage.getItem("palettes") == null) {
    palettes = [];
  } else {
    palettes = JSON.parse(localStorage.getItem("palettes"));
  }

  let number = palettes.length;
  let name = paletteNameInput.value.trim();

  paletteNameInput.value = "";

  if (name != null && name != "") {
    let palette = { number, name, colors: initialColors };

    palettes.push(palette);
    localStorage.setItem("palettes", JSON.stringify(palettes));

    saveBox.classList.remove("active");
  }
}

setColor();
