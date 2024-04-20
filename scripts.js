const DELAY = 50;
const NUM_BOXES = 25;

const container = document.getElementById("container");
const newImageBtn = document.getElementById("btn-new-image");
const scrambleBtn = document.getElementById("btn-scramble");
const sortBtn = document.getElementById("btn-sort");
const IMAGES = [
  "https://picsum.photos/id/77/400/400",
  "https://picsum.photos/id/133/400/400",
  "https://picsum.photos/id/318/400/400",
  "https://picsum.photos/id/292/400/400",
  "https://picsum.photos/id/250/400/400",
];

let currentImageIndex = 0;

// get random image
function setRandomImage() {
  let randomIndex = Math.floor(Math.random() * IMAGES.length);

  // Ensure that the new index is different than the current one
  while (randomIndex === currentImageIndex) {
    randomIndex = Math.floor(Math.random() * IMAGES.length);
  }
  // set selected image as current
  currentImageIndex = randomIndex;

  // udpate container with new image, divided into squares
  createBoxes();

  // disable sort button until scrambled
  sortBtn.disabled = true;
}

// create boxes, each one having the corresponding part of the background image
function createBoxes() {
  // empty container
  container.innerHTML = "";

  // define current image url
  const imageUrl = IMAGES[currentImageIndex];

  // Get container size, taking into account padding
  const containerStyles = window.getComputedStyle(container);
  const containerPaddingLeft = parseFloat(containerStyles.paddingLeft);
  const containerPaddingRight = parseFloat(containerStyles.paddingRight);
  const containerPaddingTop = parseFloat(containerStyles.paddingTop);
  const containerPaddingBottom = parseFloat(containerStyles.paddingBottom);

  // Calculate the size of each box
  const boxSize = Math.sqrt(NUM_BOXES);
  const containerWidth =
    container.offsetWidth - containerPaddingLeft - containerPaddingRight;
  const containerHeight =
    container.offsetHeight - containerPaddingTop - containerPaddingBottom;
  const boxWidth = containerWidth / boxSize;
  const boxHeight = containerHeight / boxSize;

  for (let i = 0; i < NUM_BOXES; i++) {
    const box = document.createElement("div");
    box.className = "box";
    box.dataset.num = i;
    box.style.width = boxWidth + "px";
    box.style.height = boxHeight + "px";
    box.style.backgroundImage = "url(" + imageUrl + ")";
    box.style.backgroundSize = containerWidth + "px " + containerHeight + "px";

    // position image within the box according to the box position within the grid
    box.style.backgroundPosition =
      (i % boxSize) * (containerWidth / boxSize) * -1 +
      "px " +
      Math.floor(i / boxSize) * (containerHeight / boxSize) * -1 +
      "px";
    container.appendChild(box);
  }
}

// scramble iamge
function scrambleImage() {
  const elements = Array.prototype.slice.call(container.children); // Convert NodeList to array

  // Shuffle the elements
  for (var i = elements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    var temp = elements[i];
    elements[i] = elements[j];
    elements[j] = temp;
  }

  // Append shuffled elements back to the container
  elements.forEach(function (element) {
    container.appendChild(element);
  });
  // enable sort button once scrambled
  sortBtn.disabled = false;
}

// sort the scrambled image
function startSort() {
  let bubbles = Array.from(document.querySelectorAll(".box"));
  bubbleSort(bubbles, bubbles.length);
}

async function bubbleSort(bubbles) {
  setButtonState("disable");

  let length = bubbles.length;
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      let k = j + 1;
      let value1 = parseInt(bubbles[j].dataset.num);
      let value2 = parseInt(bubbles[k].dataset.num);

      bubbles[j].classList.add("active");
      bubbles[k].classList.add("active");

      if (value1 > value2) {
        // Swap the bubbles in the array
        [bubbles[j], bubbles[k]] = [bubbles[k], bubbles[j]];
        // Move the bubbles in the DOM
        await swapWithDelay(bubbles[k], bubbles[j]);
      }

      bubbles[j].classList.remove("active");
      bubbles[k].classList.remove("active");
    }
    bubbles[length - i - 1].classList.add("sorted");
    bubbles[length - i - 1].style.zIndex = length - i; // Adjusted zIndex calculation
  }
  setButtonState("enable");
}
// swap the image with a small delay to show the proccess
function swapWithDelay(bubble1, bubble2) {
  return new Promise((resolve) => {
    setTimeout(() => {
      container.insertBefore(bubble2, bubble1);
      resolve();
    }, DELAY);
  });
}

// enable/disable buttons
function setButtonState(state) {
  newImageBtn.disabled = state === "disable" ? true : false;
  scrambleBtn.disabled = state === "disable" ? true : false;
  sortBtn.disabled = state === "disable" ? true : false;
}

// button event listeners
newImageBtn.addEventListener("click", setRandomImage);
scrambleBtn.addEventListener("click", scrambleImage);
sortBtn.addEventListener("click", startSort);

// load first image
setRandomImage();
