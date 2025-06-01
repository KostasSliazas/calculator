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

  let n1 = []; // Stores the current input number (as array of chars)
  let n2 = 0; // Stores the first operand of the current operation
  let op = null; // Stores the currently selected operator (e.g., '+', '-', etc.)
  let lastop = null; // Stores the operator from the previous calculation for chaining
  let result = 0; // Stores the calculated result
  let newNumberReady = false; // Flag: true if the next digit should start a new number

  // Define mathematical functions for the calculator
  const add = (n, o) => n + o;
  const sub = (n, o) => n - o;
  const div = (n, o) => n / o;
  const mul = (n, o) => n * o;
  const res = (n) => n; // Renamed to 'res' to avoid conflict with 'result' variable

  // Map operators to corresponding mathematical functions
  const cals = {
    "÷": div,
    "×": mul,
    "+": add,
    "-": sub,
    "=": res,
  };

  // Perform the calculation based on num1, num2, and the callback operator
  const cal = (num1, num2, calback) => {
    if (typeof calback === "function") {
      // Ensure num1 and num2 are treated as numbers
      const n1Val = Number(num1);
      const n2Val = Number(num2);

      const n1Str = n1Val.toString();
      const n2Str = n2Val.toString();
      const len1 = (n1Str.includes(".") ? n1Str.split(".")[1].length : 0);
      const len2 = (n2Str.includes(".") ? n2Str.split(".")[1].length : 0);
      const maxDecimals = Math.max(len1, len2);

      // Handle division separately for precision and zero division
      if (calback === div) {
        if (n2Val === 0) return NaN; // Division by zero
        return n1Val / n2Val;
      }
      
      // For other operations, apply toFixed to handle floating point inaccuracies
      // Use a more robust toFixed to avoid issues with very small numbers
      const calculatedResult = calback(n1Val, n2Val);
      return parseFloat(calculatedResult.toFixed(maxDecimals));
    }
    return Number(num2); // If no valid callback, return the second number (e.g., for '=' with no preceding op)
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

    // --- Handle Number and Decimal Input ---
    if (!isNaN(parseFloat(buttonValue)) || buttonValue === ",") {
      // If a new number is expected (after operator or equals)
      if (newNumberReady) {
        n1 = []; // Clear n1 to start fresh
        newNumberReady = false;
      }

      // Handle decimal point input
      if (buttonValue === ",") {
        if (!n1.includes(".")) { // Only add decimal if not already present
          if (!n1.length) { // If ',' is the first input or after an operator, make it "0."
            n1.push("0");
          }
          n1.push(".");
        }
      } else { // It's a digit (0-9)
        if (n1.length === 1 && n1[0] === "0" && buttonValue !== "0" && !n1.includes(".")) {
          // Replace leading "0" with a new digit, unless it's "0" or decimal is present
          n1[0] = buttonValue;
        } else if (!(n1.length === 0 && buttonValue === "0" && !n1.includes("."))) {
          // Prevent multiple leading zeros (e.g., 001) but allow 0.something
          n1.push(buttonValue);
        }
      }
      result = n1.join(""); // Update result with the current number being typed
      op = null; // Clear any pending operator when a number is typed
    }
    // --- Handle Operator Input ---
    else if (Object.keys(cals).includes(buttonValue)) {
      op = buttonValue; // Set the current operator

      if (lastop && lastop !== "=") { // If there was a pending operation (not "=" from last press)
        if (n1.length > 0 && !newNumberReady) {
          // If a new number was entered (second operand)
          n2 = cal(n2, Number(n1.join("")), cals[lastop]);
          result = n2; // Update result and n2 with the calculation
        }
        // If an operator is pressed immediately after another operator (e.g., 5 + *),
        // and no new number was typed, just update lastop without calculating.
      } else if (n1.length > 0) {
        // If this is the very first number and operator, or after "="
        n2 = Number(n1.join("")); // Store n1 as the first operand for the next calculation
        result = n2; // Display this as the "result" for now
      } else {
        // If an operator is pressed before any number, or immediately after an equals
        // but no new number was entered, just keep the current result/n2 as is.
      }

      lastop = op; // The current operator becomes the last operator for the next calculation
      newNumberReady = true; // Signal that the next digit input should start a new number
    }

    // --- Special Operator Handling: Clear (C) and Backspace (⌫) ---
    if (op === "C") {
      n1 = [];
      n2 = 0;
      op = null;
      lastop = null;
      result = 0;
      newNumberReady = false;
    } else if (op === "⌫") {
      if (newNumberReady) {
        // If backspace pressed immediately after an operator,
        // it means the user wants to edit the previous result.
        newNumberReady = false; // Allow editing
        op = null; // Clear operator state
        lastop = null; // Clear last operator state for fresh start
        n1 = result.toString().split(""); // Populate n1 with the last result for editing
        if (n1.length > 0) { // Ensure there's something to pop
          n1.pop(); // Remove the last character
        }
      } else {
        n1.pop(); // Remove the last character from current input
      }

      // Handle trailing decimal point after backspace
      if (n1.length > 0 && n1[n1.length - 1] === ".") {
        n1.pop();
      }

      if (!n1.length) {
        n1 = ["0"]; // If n1 is empty, set it to "0"
      }
      result = n1.join(""); // Update result with the modified n1
    }

    // --- Equals (=) Operator Handling ---
    if (op === "=") {
      let currentInputValue = n1.length > 0 && !newNumberReady ? Number(n1.join("")) : result;

      if (lastop && lastop !== "=") {
        // If equals is pressed after a pending operation (e.g., 5 + 3 =)
        result = cal(n2, currentInputValue, cals[lastop]);
        n2 = currentInputValue; // Store the second operand (current input) for chained equals
      } else if (lastop === "=") {
        // Chained equals (e.g., 5 + 3 = =). Re-applies the previous operation.
        // n2 still holds the *second operand* of the previous calculation.
        result = cal(result, n2, cals[op]); // Use the current result as first operand
                                           // and the stored n2 as the second operand for repetition
      } else {
        // If equals is pressed without a preceding operator or number
        result = Number(n1.join(""));
        n2 = result; // Initialize n2 if it was just a number then equals
      }

      n1 = []; // Clear n1 for the next input
      lastop = "="; // Mark last operation as equals for chained calculations
      newNumberReady = true; // Next digit starts a new number
    }

    // --- Final Screen Update ---
    CALC_SCREEN.textContent = !isFinite(result) ? "ERROR" : result;
  };

  // Initialize the theme on page load
  function init() {
    THEME_CHANGE.value = parseInt(localStorage.getItem("calculatorThemeNumber"));
    if (isNaN(THEME_CHANGE.value)) changerClass(random(0, THEME_CHANGE.full));
    else changerClass(THEME_CHANGE.value); // Set theme from localStorage or random

    if ("serviceWorker" in navigator) {
      try {
        navigator.serviceWorker
          .register("/project-k/calculator/sw.js?v=1")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            if (
              error.message.includes(
                "ServiceWorkerContainer.register: Script URL's scheme is not 'http' or 'https'"
              )
            ) {
              return console.warn(
                "Service Worker registration error: Insecure context. Please use HTTPS or localhost.",
                error
              );
            }
            console.error("Service Worker registration failed:", error);
          });
      } catch (error) {
        console.error("Unexpected error during Service Worker registration:", error);
      }
    } else {
      console.log("Service Workers are not supported in this browser.");
    }

    // Event listeners for mouse and theme changes
    CALC.addEventListener("mousedown", (e) => btn(e));

    // Remove blink effect after button release
    CALC.addEventListener("mouseup", (e) => {
      const screenTimeout = setTimeout(() => {
        clearTimeout(screenTimeout);
        CALC_SCREEN.classList.remove("calculator__screen--blink");
      }, 7);
    });

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
