const colorPickerBtn = document.getElementById("color-picker");
const getAllBtn = document.getElementById("get-all-colors");
const colorList = document.querySelector(".all-colors");
const colorsAll = document.querySelector(".all-website-colors-list");
const colorsAllTitle = document.querySelector(".all-website-colors");
const clearAll = document.querySelector(".clear-all");
const copiedHeader = document.querySelector(".copied");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");
const pickedColorsRGB = JSON.parse(
  localStorage.getItem("picked-colors-rgb") || "[]"
);

//HEX to RGB Calculation

function hexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0;

  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return "rgb(" + +r + "," + +g + "," + +b + ")";
}

//Copy Color from Text to Clipboard

const copyColor = (elem) => {
  navigator.clipboard.writeText(elem.dataset.color);
  elem.innerText = "Copied";
  setTimeout(() => (elem.innerText = elem.dataset.color), 1000);
};

//Copy Color from Rect to Clipboard

const copyColorRect = (elem) => {
  navigator.clipboard.writeText(elem.dataset.color);
};

//Show selected color

const showColors = () => {
  if (!pickedColors.length) return;
  colorList.innerHTML = pickedColors
    .map(
      (color) =>
        `<li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${
          color == "#ffffff" ? "#ccc" : color
        }"></span>
            <span class="value" data-color="${color}">${color} </span>
          </li>
          <li class="rgb-color">
          <span class="rgb-value" data-color=${hexToRGB(color)}>|| ${hexToRGB(
          color
        )}</span>
          </li>`
    )
    .join("");
  document.querySelector(".picked-colors").classList.remove("hide");
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("click", (e) =>
      copyColor(e.currentTarget.lastElementChild)
    );
  });
  document.querySelectorAll(".rgb-color").forEach((li) => {
    li.addEventListener("click", (e) =>
      copyColor(e.currentTarget.lastElementChild)
    );
  });
};
showColors();

//Activate EyeDropper

const activateEyeDropper = () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      const eyeDropper = new EyeDropper();
      const { sRGBHex } = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);

      if (!pickedColors.includes(sRGBHex)) {
        pickedColors.push(sRGBHex);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        pickedColorsRGB.push(hexToRGB(sRGBHex));
        localStorage.setItem(
          "picked-color-rgb",
          JSON.stringify(pickedColorsRGB)
        );
        showColors();
      }
    } catch (error) {
      console.log("Failed to copy the color code!");
    }
    document.body.style.display = "block";
  }, 10);
};

//Delete all Colors stored in Local Storage

const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
};

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: extractColors,
      },
      function (results) {
        displayColors(results[0].result);
      }
    );
  });
});

function extractColors() {
  const elements = document.querySelectorAll("*");
  const colors = new Set();

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const computedStyle = getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    if (
      color &&
      color !== "rgba(0, 0, 0, 0)" &&
      color !== "rgb(0, 0, 0)" &&
      !colors.has(color)
    ) {
      colors.add(color);
    }

    if (
      backgroundColor &&
      backgroundColor !== "rgba(0, 0, 0, 0)" &&
      backgroundColor !== "rgb(0, 0, 0)" &&
      !colors.has(backgroundColor)
    ) {
      colors.add(backgroundColor);
    }
  }

  return Array.from(colors);
}

function displayColors(colors) {
  if (!colors.length) return;
  //Create Rectangles with All Colors from Website
  colorsAll.innerHTML = colors
    .map(
      (color) =>
        `<li class="color allColorRect">
          <span class="rect" data-color="${color}" style="background: ${color}; border: 1px solid ${
          color == "rgb(255, 255, 255)" ? "#ccc" : color
        }""></span></li>`
    )
    .join("");

  document.querySelectorAll(".allColorRect").forEach((li) => {
    li.addEventListener("click", (e) => {
      copyColorRect(e.currentTarget.lastElementChild);
      copiedHeader.classList.remove("hide");
      setTimeout(() => copiedHeader.classList.add("hide"), 1000);
    });
  });
}

//Get all Colors of the Website in an Array

getAllBtn.addEventListener("click", () => {
  colorsAllTitle.classList.remove("hide");
  document.querySelector(".allColorRect").classList.remove("hide");
});
