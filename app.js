//Variables
let colorDivs = document.querySelectorAll(".color");

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
  });
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
