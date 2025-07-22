const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".btn.number");
let currentInput = "0";
function updateDisplay() {
  let displayText = currentInput;

  // Format the display for better readability
  if (displayText.length > 15) {
    // If the result is too long, use scientific notation for numbers
    const num = parseFloat(displayText);
    if (!isNaN(num) && isFinite(num)) {
      displayText = num.toExponential(6);
    } else {
      // Truncate non-numeric long strings
      displayText = displayText.substring(0, 15) + "...";
    }
  }

  display.textContent = displayText;
}
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    if (value == "." && currentInput.includes(".")) {
      // Check if the decimal is in the current number context
      const lastNumberMatch = currentInput.match(/[0-9.]*$/);
      if (lastNumberMatch && lastNumberMatch[0].includes(".")) return;
    }

    if (currentInput == "0" && value != ".") {
      currentInput = value;
    } else if (
      currentInput === "Error" ||
      currentInput === "Infinity" ||
      currentInput === "-Infinity"
    ) {
      // Reset on error states
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

    // Handle multiplication before trigonometric functions
    if (
      (value === "×" || value === "÷" || value === "+" || value === "-") &&
      (currentInput.endsWith("sin(") ||
        currentInput.endsWith("cos(") ||
        currentInput.endsWith("tan(") ||
        currentInput.endsWith("log(") ||
        currentInput.endsWith("ln(") ||
        currentInput.endsWith("√("))
    ) {
      return; // Don't add operators immediately after function names
    }

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
  // Enhanced pattern to match numbers, decimals, and expressions in parentheses
  const match = expr.match(/([0-9.]+|\([^)]+\))$/);
  return match ? match[0] : "";
}

function handleScientificOperation(op) {
  const lastExpr = extractLastExpression(currentInput);
  const before = currentInput.slice(0, currentInput.length - lastExpr.length);

  let wrappedExpr = "";
  let displayExpr = "";

  switch (op) {
    case "sin":
      if (lastExpr === "" || lastExpr === "0") {
        // Show function name when no number is present
        currentInput = currentInput === "0" ? "sin(" : currentInput + "sin(";
        updateDisplay();
        return;
      }
      wrappedExpr = isDegree
        ? `Math.sin((${lastExpr}) * Math.PI / 180)`
        : `Math.sin(${lastExpr})`;
      displayExpr = `sin(${lastExpr})`;
      break;
    case "cos":
      if (lastExpr === "" || lastExpr === "0") {
        currentInput = currentInput === "0" ? "cos(" : currentInput + "cos(";
        updateDisplay();
        return;
      }
      wrappedExpr = isDegree
        ? `Math.cos((${lastExpr}) * Math.PI / 180)`
        : `Math.cos(${lastExpr})`;
      displayExpr = `cos(${lastExpr})`;
      break;
    case "tan":
      if (lastExpr === "" || lastExpr === "0") {
        currentInput = currentInput === "0" ? "tan(" : currentInput + "tan(";
        updateDisplay();
        return;
      }
      if (isDegree) {
        wrappedExpr = `(Math.abs(Math.cos(${lastExpr} * Math.PI / 180)) < 1e-10 ? "Undefined" : Math.tan(${lastExpr} * Math.PI / 180))`;
      } else {
        wrappedExpr = `(Math.abs(Math.cos(${lastExpr})) < 1e-10 ? "Undefined" : Math.tan(${lastExpr}))`;
      }
      displayExpr = `tan(${lastExpr})`;
      break;
    case "log":
      if (lastExpr === "" || lastExpr === "0") {
        currentInput = currentInput === "0" ? "log(" : currentInput + "log(";
        updateDisplay();
        return;
      }
      wrappedExpr = `Math.log10(${lastExpr})`;
      displayExpr = `log(${lastExpr})`;
      break;
    case "ln":
      if (lastExpr === "" || lastExpr === "0") {
        currentInput = currentInput === "0" ? "ln(" : currentInput + "ln(";
        updateDisplay();
        return;
      }
      wrappedExpr = `Math.log(${lastExpr})`;
      displayExpr = `ln(${lastExpr})`;
      break;
    case "√":
      if (lastExpr === "" || lastExpr === "0") {
        currentInput = currentInput === "0" ? "√(" : currentInput + "√(";
        updateDisplay();
        return;
      }
      wrappedExpr = `Math.sqrt(${lastExpr})`;
      displayExpr = `√(${lastExpr})`;
      break;
    case "!":
      if (lastExpr === "") return;
      wrappedExpr = `factorial(${lastExpr})`;
      displayExpr = `${lastExpr}!`;
      break;
    case "^":
      currentInput += "^";
      updateDisplay();
      return;
    case "π":
      if (currentInput === "0") {
        currentInput = Math.PI.toString();
      } else {
        currentInput += "*" + Math.PI.toString();
      }
      updateDisplay();
      return;
    case "e":
      if (currentInput === "0") {
        currentInput = Math.E.toString();
      } else {
        currentInput += "*" + Math.E.toString();
      }
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

  // Replace the last expression with the wrapped expression
  currentInput = before + wrappedExpr;
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
  return factStr;
}
equalButton.addEventListener("click", () => {
  try {
    let expr = currentInput;

    // Replace display functions with JavaScript Math functions
    expr = expr.replace(/sin\(/g, isDegree ? "Math.sin((" : "Math.sin(");
    expr = expr.replace(/cos\(/g, isDegree ? "Math.cos((" : "Math.cos(");
    expr = expr.replace(/tan\(/g, isDegree ? "Math.tan((" : "Math.tan(");
    expr = expr.replace(/log\(/g, "Math.log10(");
    expr = expr.replace(/ln\(/g, "Math.log(");
    expr = expr.replace(/√\(/g, "Math.sqrt(");

    // Handle degree conversion for trig functions
    if (isDegree) {
      expr = expr.replace(/Math\.sin\(\(/g, "Math.sin((");
      expr = expr.replace(/Math\.cos\(\(/g, "Math.cos((");
      expr = expr.replace(/Math\.tan\(\(/g, "Math.tan((");

      // Add degree to radian conversion
      expr = expr.replace(
        /Math\.sin\(\(([^)]+)\)/g,
        "Math.sin(($1) * Math.PI / 180)"
      );
      expr = expr.replace(
        /Math\.cos\(\(([^)]+)\)/g,
        "Math.cos(($1) * Math.PI / 180)"
      );
      expr = expr.replace(
        /Math\.tan\(\(([^)]+)\)/g,
        "Math.tan(($1) * Math.PI / 180)"
      );
    }

    // Handle power operator
    expr = expr.replace(/\^/g, "**");

    // Replace 5! with factorial(5)
    expr = expr.replace(/(\d+\.?\d*)!/g, "factorial($1)");

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

    // Format the result for better display
    if (typeof result === "number") {
      if (isNaN(result)) {
        currentInput = "Error";
      } else if (!isFinite(result)) {
        currentInput = result > 0 ? "Infinity" : "-Infinity";
      } else {
        // Round to avoid floating point precision issues
        const rounded = Math.round(result * 1e12) / 1e12;
        currentInput = rounded.toString();
      }
    } else {
      currentInput = result.toString();
    }

    updateDisplay();
  } catch (error) {
    currentInput = "Error";
    updateDisplay();
  }
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
