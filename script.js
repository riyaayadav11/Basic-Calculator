// ----- State: what the calculator is currently remembering -----
let current = "0";      // the number shown on screen (as text)
let previous = null;    // the first number, saved when you press an operator
let operator = null;    // "+", "-", "*" or "/"
let resetNext = false;  // true when the next digit should start a new number

const display = document.getElementById("display");

function updateDisplay() {
  display.textContent = current;
}

// ----- Actions -----
function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  resetNext = false;
}

function inputNumber(digit) {
  if (current === "Error") clearAll();
  if (resetNext) {
    current = digit;
    resetNext = false;
  } else {
    current = current === "0" ? digit : current + digit;
  }
}

function inputDecimal() {
  if (current === "Error") clearAll();
  if (resetNext) {
    current = "0.";
    resetNext = false;
    return;
  }
  if (!current.includes(".")) {
    current += ".";
  }
}

function deleteLast() {
  if (current === "Error" || resetNext) return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function chooseOperator(op) {
  if (current === "Error") return;
  // If we already have "5 +" and a second number, calculate first (chaining)
  if (operator !== null && !resetNext) {
    compute();
  }
  previous = parseFloat(current);
  operator = op;
  resetNext = true;
}

function compute() {
  if (operator === null || previous === null) return;

  const a = previous;
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) {
        current = "Error";
        previous = null;
        operator = null;
        resetNext = true;
        return;
      }
      result = a / b;
      break;
  }

  // toFixed fixes floating-point quirks like 0.1 + 0.2 = 0.30000000000000004
  current = String(parseFloat(result.toFixed(10)));
  previous = null;
  operator = null;
  resetNext = true;
}

// ----- Mouse clicks (one listener for all buttons) -----
document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "number") inputNumber(value);
  else if (action === "decimal") inputDecimal();
  else if (action === "operator") chooseOperator(value);
  else if (action === "equals") compute();
  else if (action === "delete") deleteLast();
  else if (action === "clear") clearAll();

  updateDisplay();
});

// ----- Keyboard support -----
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key >= "0" && key <= "9") inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
  else if (key === "Enter" || key === "=") { event.preventDefault(); compute(); }
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
  else return;

  updateDisplay();
});
