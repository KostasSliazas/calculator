/* jshint esversion: 8 */
(function (w, d) {
  "use strict";
  // Audio for button sound effect
  const BEEP_AUDIO = new w.Audio("data:audio/mp3;base64,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");

  // Function to play a beep sound and trigger device vibration if available
  const sound = () => {
    BEEP_AUDIO.play();
    if (typeof w.navigator.vibrate === "function") {
      w.navigator.vibrate(30);
    }
  };

  const root = d.documentElement; // Root HTML element for theme changes
  const CALC = d.querySelector(".calculator"); // Calculator container
  const CALC_SCREEN = d.querySelector(".calculator__screen"); // Screen element
  CALC_SCREEN.textContent = 0; // Initialize calculator screen with zero

  // Utility function to generate a random number between min and max
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  // Class name variations for different themes
  const classNameVariables = [0, "a", "b", "c", "d", "e l", "f", "g", "h l", "i n", "j n p", "k o p", "e l q"];

  // Helper object to handle cycling through themes
  const arrayHelper = function () {
    const ob = {};
    ob.value = ob.full = this.length;

    ob.increment = function () {
      this.value = this.value ? --this.value : this.full - 1;
    };

    ob.decrement = function () {
      this.value = this.value < this.full - 1 ? ++this.value : 0;
    };

    return ob;
  };

  // Initialize the theme handler using the classNameVariables
  const THEME_CHANGE = arrayHelper.call(classNameVariables);

  // Function to change the theme by updating the root element's class
  const changerClass = (e) => {
    if (e) root.className = classNameVariables[e];
    else root.removeAttribute("class");
  };

  let currentInput = "0"; // What the user is currently typing/displaying
  let previousValue = null; // Stores the first operand for a calculation
  let operator = null; // Stores the pending operator (+, -, x, ÷)
  let equalsPressed = false; // Flag to indicate if equals was the last action
  let lastOperandForEquals = null; // Stores the second operand for chained equals

  // Define mathematical functions for the calculator
  const add = (n, o) => n + o;
  const sub = (n, o) => n - o;
  const div = (n, o) => n / o;
  const mul = (n, o) => n * o;

  // Map operators to corresponding mathematical functions
  const cals = {
    "÷": div,
    "×": mul,
    "+": add,
    "-": sub,
  };

  // Perform the calculation
  const calculate = (num1, num2, opFunc) => {
    num1 = Number(num1);
    num2 = Number(num2);

    if (opFunc === div && num2 === 0) {
      return "ERROR"; // Handle division by zero
    }

    const result = opFunc(num1, num2);

    // Attempt to handle floating point precision
    const num1DecimalPlaces = (num1.toString().split('.')[1] || '').length;
    const num2DecimalPlaces = (num2.toString().split('.')[1] || '').length;
    const maxDecimalPlaces = Math.max(num1DecimalPlaces, num2DecimalPlaces);

    // Use toFixed only if there are decimal places, otherwise just return the number
    // This avoids unnecessary .000 on integers
    return maxDecimalPlaces > 0 ? parseFloat(result.toFixed(maxDecimalPlaces)) : result;
  };

  // Event handler for button clicks (numbers and operations)
  const btn = (e) => {
    // Ignore clicks on non-button elements or special buttons
    if (!e.target.matches("input") || e.target.id === "esound" || e.target.id === "src") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    CALC_SCREEN.classList.add("calculator__screen--blink");
    if (d.getElementById("esound").checked) sound();

    const buttonValue = e.target.value;

    // --- Handle Number Input ---
    if (!isNaN(parseFloat(buttonValue))) { // It's a digit
      if (currentInput === "0" || equalsPressed || (operator !== null && previousValue !== null && currentInput === previousValue.toString())) {
        // Start a new number if:
        // - current display is just "0"
        // - equals was just pressed
        // - an operator was just pressed and no new number typed yet (currentInput is still the previousValue)
        currentInput = buttonValue;
      } else {
        currentInput += buttonValue;
      }
      equalsPressed = false; // Typing a digit resets equals state
      operator = null; // Typing a digit clears any pending operator
    }
    // --- Handle Decimal Point Input ---
    else if (buttonValue === ",") {
        if (equalsPressed || currentInput === "0") {
            currentInput = "0.";
            equalsPressed = false;
        } else if (!currentInput.includes(".")) {
            currentInput += ".";
        }
    }
    // --- Handle Operator Input (+, -, ×, ÷) ---
    else if (cals.hasOwnProperty(buttonValue)) {
        if (previousValue !== null && operator !== null) { // If there's an ongoing calculation
            if (!equalsPressed) { // If equals was not pressed, means we're chaining operations or changing operator
                if (currentInput !== previousValue.toString()) { // Only calculate if a new number has been entered
                    currentInput = calculate(previousValue, currentInput, cals[operator]).toString();
                }
            } else { // If equals was just pressed, the current result is the new previousValue
                previousValue = Number(currentInput);
            }
        } else { // First operator in a sequence
            previousValue = Number(currentInput); // Store current display as the first operand
        }
        operator = buttonValue; // Set the new pending operator
        equalsPressed = false; // Reset equals flag
    }
    // --- Handle Equals (=) ---
    else if (buttonValue === "=") {
        if (operator !== null) { // Only calculate if there's a pending operator
            let operand2 = equalsPressed ? lastOperandForEquals : Number(currentInput);

            if (previousValue === null) previousValue = Number(currentInput); // Fallback for edge cases where previousValue isn't set

            currentInput = calculate(previousValue, operand2, cals[operator]).toString();
            lastOperandForEquals = operand2; // Store for chained equals
            previousValue = Number(currentInput); // Update previousValue to the result for further chaining
            operator = null; // Clear operator after equals
        } else if (equalsPressed && lastOperandForEquals !== null) {
            // Chained equals with no new operator, re-apply previous operation
            currentInput = calculate(previousValue, lastOperandForEquals, cals[operator]).toString();
            previousValue = Number(currentInput); // Update previousValue to the new result
        }
        equalsPressed = true;
    }
    // --- Handle Clear (C) ---
    else if (buttonValue === "C") {
        currentInput = "0";
        previousValue = null;
        operator = null;
        equalsPressed = false;
        lastOperandForEquals = null; // Ensure this is cleared too
    }
    // --- Handle Backspace (⌫) ---
    else if (buttonValue === "⌫") {
        if (equalsPressed) {
            // If backspace after equals, revert to default clear state
            currentInput = "0";
            previousValue = null;
            operator = null;
            equalsPressed = false;
            lastOperandForEquals = null;
        } else if (currentInput.length > 1 && currentInput !== "0") {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === "" || currentInput === "-") currentInput = "0"; // Handle empty string or just "-"
        } else {
            currentInput = "0"; // If only one digit or "0", revert to "0"
        }
    }

    // --- Display Result ---
    CALC_SCREEN.textContent = currentInput;

    // Remove blink effect after a short delay
    const screenTimeout = setTimeout(() => {
      clearTimeout(screenTimeout);
      CALC_SCREEN.classList.remove("calculator__screen--blink");
    }, 7);
  };

  // Initialize the theme on page load
  function init() {
    THEME_CHANGE.value = parseInt(localStorage.getItem("calculatorThemeNumber"));
    if (isNaN(THEME_CHANGE.value)) changerClass(random(0, THEME_CHANGE.full));
    else changerClass(THEME_CHANGE.value); // Set theme from localStorage or random

    if ("serviceWorker" in navigator) {
      try {
        navigator.serviceWorker
          .register('/project-k/calculator/sw.js?v=1')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            if (error.message.includes("ServiceWorkerContainer.register: Script URL's scheme is not 'http' or 'https'")) {
              return console.warn('Service Worker registration error: Insecure context. Please use HTTPS or localhost.', error);
            }
            console.error('Service Worker registration failed:', error);
          });
      } catch (error) {
        console.error('Unexpected error during Service Worker registration:', error);
      }
    } else {
      console.log('Service Workers are not supported in this browser.');
    }

    // Event listeners for mouse and theme changes
    CALC.addEventListener("mousedown", (e) => btn(e));

    // Increment the theme on screen click
    CALC_SCREEN.addEventListener("click", (e) => {
      e.preventDefault();
      THEME_CHANGE.increment();
      changerClass(THEME_CHANGE.value);
      localStorage.setItem("calculatorThemeNumber", THEME_CHANGE.value);
    });

    // Decrement the theme on right-click (context menu)
    CALC_SCREEN.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      THEME_CHANGE.decrement();
      changerClass(THEME_CHANGE.value);
      localStorage.setItem("calculatorThemeNumber", THEME_CHANGE.value);
    });
  }
  // Initialize theme on DOM load
  d.addEventListener("DOMContentLoaded", init);
})(window, document);
