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

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    if (value === "×") currentInput += "*";
    else if (value === "÷") currentInput += "/";
    else currentInput += value;
    updateDisplay();
  });
});
// Event Listeners for AC, C, %
const allClearButton = document.getElementById("all-clear");
const clearButton = document.getElementById("clear");
const percentButton = document.getElementById("percent");

clearButton.addEventListener("click", () => {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
  updateDisplay();
});
allClearButton.addEventListener("click", () => {
  currentInput = "0";
  updateDisplay();
});
percentButton.addEventListener("click", () => {
  try {
    const result = parseFloat(currentInput) / 100;
    currentInput = result.toString();
    updateDisplay();
  } catch (error) {
    currentInput = "Error";
    updateDisplay();
  }
});
//Add event listerners for scientific functions
const scientificButtons = document.querySelectorAll(
  ".scientific-buttons .function"
);
scientificButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const op = button.textContent;
    handleScientificOperation(op);
  });
});
// logic to calculate
function extractLastExpression(expr) {
  const match = expr.match(/([0-9.]+)$/); // Extracts last number or decimal
  return match ? match[0] : "";
}

function handleScientificOperation(op) {
  const lastExpr = extractLastExpression(currentInput);
  const before = currentInput.slice(0, currentInput.length - lastExpr.length);

  let wrappedExpr = "";
  switch (op) {
    case "sin":
      wrappedExpr = isDegree
        ? `Math.sin((${lastExpr}) * Math.PI / 180)`
        : `Math.sin(${lastExpr})`;
      break;
    case "cos":
      wrappedExpr = isDegree
        ? `Math.cos((${lastExpr}) * Math.PI / 180)`
        : `Math.cos(${lastExpr})`;
      break;
    case "tan":
      wrappedExpr = isDegree
        ? `Math.tan((${lastExpr}) * Math.PI / 180)`
        : `Math.tan(${lastExpr})`;
      break;
    case "log":
      wrappedExpr = `Math.log10(${lastExpr})`;
      break;
    case "ln":
      wrappedExpr = `Math.log(${lastExpr})`;
      break;
    case "√":
      wrappedExpr = `Math.sqrt(${lastExpr})`;
      break;
    case "!":
      wrappedExpr = `factorial(${lastExpr})`;
      break;
    case "^":
      currentInput += "**";
      updateDisplay();
      return;
    case "π":
      currentInput += Math.PI;
      updateDisplay();
      return;
    case "e":
      currentInput += Math.E;
      updateDisplay();
      return;
    case "(":
    case ")":
      currentInput += op;
      updateDisplay();
      return;
    default:
      return;
  }

  if (lastExpr === "") {
    // If no number exists, insert function with empty parentheses and cursor can fill
    currentInput += wrappedExpr.replace(lastExpr, ""); // e.g., Math.sin()
  } else {
    // Wrap existing number
    currentInput = before + wrappedExpr;
  }

  updateDisplay();
}
function toRadians(angle) {
  if (isDegree) return angle * (Math.PI / 180);
  else return angle;
}
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return "Error";
  let fact = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    fact *= i;
  }
  const factStr = fact.toString();
  if (factStr.length > 12) return Number(factStr).toExponential(6);
}
equalButton.addEventListener("click", () => {
  try {
    let expr = currentInput;

    // Replace 5! with factorial(5)
    expr = expr.replace(/(\d+)!/g, "factorial($1)");

    // Evaluate expression with needed functions in scope
    const result = Function(
      "Math",
      "toRadians",
      "factorial",
      `
      "use strict";
      return (${expr});
    `
    )(Math, toRadians, factorial);

    currentInput = result.toString();
    updateDisplay();
  } catch (error) {
    currentInput = "Error";
    updateDisplay();
  }
});
// function formatResult(value) {
//   if (isNaN(value) || !isFinite(value)) return "Error";
//   let num = Number(value);
//   if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num != 0))
//     return num.toExponential(6);
//   return parseFloat(num.toFixed(6)).toString();
// }

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
