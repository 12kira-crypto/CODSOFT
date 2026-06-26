/* =========================================================
   Basic Calculator Logic
   Built using plain DOM events, conditional statements,
   and loops — no eval() / Function() string evaluation.
   ========================================================= */

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

// Calculator state
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let displayValue = '0';
let isResultShown = false;

function updateScreen() {
  resultEl.textContent = displayValue;

  if (currentOperator && firstOperand !== null && !isResultShown) {
    expressionEl.textContent = `${firstOperand} ${currentOperator}`;
  } else if (isResultShown && currentOperator) {
    expressionEl.textContent = `${firstOperand} ${currentOperator} ${secondOperand}`;
  } else {
    expressionEl.textContent = '';
  }
}

function inputDigit(digit) {
  // Start fresh if a result was just shown
  if (isResultShown) {
    displayValue = '0';
    firstOperand = null;
    currentOperator = null;
    isResultShown = false;
  }

  if (digit === '.') {
    // Prevent multiple decimal points in the same number
    if (displayValue.includes('.')) {
      return;
    }
    displayValue += '.';
    updateScreen();
    return;
  }

  if (displayValue === '0') {
    displayValue = digit;
  } else {
    displayValue += digit;
  }

  updateScreen();
}

function chooseOperator(action) {
  const symbolMap = {
    add: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷'
  };
  const symbol = symbolMap[action];

  if (!symbol) {
    return;
  }

  // If an operator was already chosen but the user picks a new one
  // before entering the second number, just swap the operator.
  if (firstOperand !== null && currentOperator !== null && !isResultShown) {
    currentOperator = symbol;
    updateScreen();
    return;
  }

  firstOperand = parseFloat(displayValue);
  currentOperator = symbol;
  isResultShown = false;
  displayValue = '0';
  updateScreen();
}

function calculate() {
  if (currentOperator === null || firstOperand === null) {
    return;
  }

  secondOperand = parseFloat(displayValue);
  let outcome = 0;

  // Loop-free, but uses explicit if-else branching per the
  // standard arithmetic operators.
  if (currentOperator === '+') {
    outcome = firstOperand + secondOperand;
  } else if (currentOperator === '−') {
    outcome = firstOperand - secondOperand;
  } else if (currentOperator === '×') {
    outcome = firstOperand * secondOperand;
  } else if (currentOperator === '÷') {
    if (secondOperand === 0) {
      displayValue = 'Error';
      isResultShown = true;
      updateScreen();
      return;
    }
    outcome = firstOperand / secondOperand;
  } else {
    return;
  }

  // Trim long floating point results to a reasonable precision
  outcome = Math.round(outcome * 1e10) / 1e10;

  displayValue = outcome.toString();
  isResultShown = true;
  updateScreen();
}

function clearAll() {
  firstOperand = null;
  secondOperand = null;
  currentOperator = null;
  displayValue = '0';
  isResultShown = false;
  updateScreen();
}

function deleteLastChar() {
  if (isResultShown) {
    clearAll();
    return;
  }

  if (displayValue.length <= 1) {
    displayValue = '0';
  } else {
    displayValue = displayValue.slice(0, -1);
  }
  updateScreen();
}

function applyPercent() {
  const numericValue = parseFloat(displayValue);
  displayValue = (numericValue / 100).toString();
  updateScreen();
}

/* ---------------------------------------------------------
   Wire up event listeners.
   A single loop walks every key on the keypad and routes
   it based on its data-attributes (digit vs action).
   --------------------------------------------------------- */
const allKeys = document.querySelectorAll('.key');

for (const key of allKeys) {
  key.addEventListener('click', () => {
    const digit = key.getAttribute('data-digit');
    const action = key.getAttribute('data-action');

    if (digit !== null) {
      inputDigit(digit);
      return;
    }

    switch (action) {
      case 'clear':
        clearAll();
        break;
      case 'delete':
        deleteLastChar();
        break;
      case 'percent':
        applyPercent();
        break;
      case 'equals':
        calculate();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        chooseOperator(action);
        break;
      default:
        break;
    }
  });
}

/* ---------------------------------------------------------
   Optional: support physical keyboard input too.
   --------------------------------------------------------- */
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key >= '0' && key <= '9') {
    inputDigit(key);
  } else if (key === '.') {
    inputDigit('.');
  } else if (key === '+') {
    chooseOperator('add');
  } else if (key === '-') {
    chooseOperator('subtract');
  } else if (key === '*') {
    chooseOperator('multiply');
  } else if (key === '/') {
    event.preventDefault();
    chooseOperator('divide');
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Backspace') {
    deleteLastChar();
  } else if (key === 'Escape') {
    clearAll();
  }
});

// Initial render
updateScreen();