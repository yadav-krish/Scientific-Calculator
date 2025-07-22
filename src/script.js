const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".btn.number");
let currentInput = "0";
function updateDisplay() {
  display.textContent = currentInput;
}
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    if (value == "." && currentInput.includes(".")) return;
    else if (currentInput == "0" && value != ".") {
      currentInput = value;
    } else {
      currentInput += value;
    }
    updateDisplay();
  });
});

// Adding Functionality of operators
const operatorButtons = document.querySelectorAll(".btn.operator");
const equalButton = document.querySelector(".btn.equal");

let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Handle operator buttons (+, -, ×, ÷)
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (firstOperand === null) {
      firstOperand = parseFloat(currentInput);
      currentInput = "0";
    } else if (waitingForSecondOperand === true) {
      const result = operate(firstOperand, parseFloat(currentInput), operator);
      currentInput = result.toString();
      firstOperand = result;
      updateDisplay();
    }
    operator = value;
    waitingForSecondOperand = true;
  });
});

// Handle = button
equalButton.addEventListener("click", () => {
  if (firstOperand !== null && operator !== null) {
    const secondOperand = parseFloat(currentInput);
    const result = operate(firstOperand, secondOperand, operator);
    currentInput = result.toString();
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
  }
});

// Core logic to calculate
function operate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b !== 0 ? a / b : "Error";
    default:
      return b;
  }
}
// Adding Event Listeners for Clear Buttons
const clearButton = document.getElementById("clear");
const allClearButton = document.getElementById("all-clear");

// All Clear : Reset Everything
allClearButton.addEventListener("click", () => {
  currentInput = "0";
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
});
// Clear : Remove last character
clearButton.addEventListener("click", () => {
  if (currentInput.length > 1) currentInput = currentInput.slice(0, -1);
  else currentInput = "0";
  updateDisplay();
});
const percentButton = document.getElementById("percent");
percentButton.addEventListener("click", () => {
  if (currentInput === "0") return;
  else {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
  }
});

const functionButtons = document.querySelectorAll(".function");
functionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const func = button.textContent;
    switch (func) {
      case "π":
        currentInput += Math.PI.toFixed(8);
        break;
      case "e":
        currentInput += Math.E.toFixed(8);
        break;
      case "√":
        currentInput = Math.sqrt(parseFloat(currentInput)).toString();
        break;
      case "log":
        currentInput = Math.log10(parseFloat(currentInput)).toString();
        break;
      case "ln":
        currentInput = Math.log(parseFloat(currentInput)).toString();
      case "sin":
      case "sin":
        currentInput = Math.sin(toRadians(currentInput)).toString();
        break;
      case "cos":
        currentInput = Math.cos(toRadians(currentInput)).toString();
        break;
      case "tan":
        currentInput = Math.tan(toRadians(currentInput)).toString();
        break;
      case "^":
        currentInput += "**";
        break;
      case "(":
      case ")":
        currentInput += func;
        break;
    }
  });
});

let isDarkMode = false;
let isDegree = true;

const body = document.body;

const toggleModeBtn = document.getElementById("toggle-mode");
const toggleAngleBtn = document.getElementById("toggle-angle");
const themeLabel = document.getElementById("theme-label");
const angleLabel = document.getElementById("angle-label");

// Theme toggle
toggleModeBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  body.classList.toggle("dark");
  body.classList.toggle("light");

  toggleModeBtn.classList.toggle("active");
  themeLabel.textContent = isDarkMode ? "Dark" : "Light";
});

// Angle toggle
toggleAngleBtn.addEventListener("click", () => {
  isDegree = !isDegree;
  toggleAngleBtn.classList.toggle("active");
  angleLabel.textContent = isDegree ? "Degree" : "Radian";
});
