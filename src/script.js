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

const functionButtons = document.querySelectorAll(".scientific-buttons button");
functionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleScientificOperation(btn.textContent);
  });
});

function handleScientificOperation(op) {
  const display = document.querySelector(".display");
  let value = parseFloat(display.textContent);
  switch (op) {
    case "sin":
      display.textContent = Math.sin(toRadians(value)).toFixed(6);
      break;
    case "cos":
      display.textContent = Math.cos(toRadians(value)).toFixed(6);
      break;
    case "tan":
      display.textContent = Math.tan(toRadians(value)).toFixed(6);
      break;
    case "log":
      display.textContent = Math.log10(value).toFixed(6);
      break;
    case "ln":
      display.textContent = Math.log(value).toFixed(6);
      break;
    case "√":
      display.textContent = Math.sqrt(value).toFixed(6);
      break;
    case "^":
      display.textContent += "**"; // we'll use eval later
      break;
    case "π":
      display.textContent += Math.PI.toFixed(6);
      break;
    case "e":
      display.textContent += Math.E.toFixed(6);
      break;
    case "(":
    case ")":
      display.textContent += op;
      break;
    case "!":
      display.textContent = factorial(value);
      break;
  }
}
function toRadians(angle) {
  if (isDegree) return angle * (Math.PI / 180);
  else return angle;
}
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return "Error";
  let fact = 1;
  for (let i = 2; i <= n; i++) {
    fact *= i;
  }
  return fact;
}
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
