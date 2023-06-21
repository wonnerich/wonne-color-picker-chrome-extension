const colorPickerBtn = document.getElementById("color-picker");
const colorList = document.querySelector(".all-colors");
const clearAll = document.querySelector(".clear-all");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");
const pickedColorsRGB = JSON.parse(
  localStorage.getItem("picked-colors-rgb") || "[]"
);

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

const copyColor = (elem) => {
  navigator.clipboard.writeText(elem.dataset.color);
  elem.innerText = "Copied";
  setTimeout(() => (elem.innerText = elem.dataset.color), 1000);
};

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

const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
};

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);
