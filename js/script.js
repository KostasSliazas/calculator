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

  let n1 = []; // Stores the current input number
  let n2 = 0; // Stores the previous number for operations
  let op = null; // Stores the current operation
  let lastop = null; // Stores the last operation performed
  let result = 0; // Stores the calculation result
  let newNumberStarted = false; // Flag to indicate if a new number should start

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
      const n1Str = num1.toString();
      const n2Str = num2.toString();
      const len1 = (n1Str.includes(".") ? n1Str.split(".")[1].length : 0);
      const len2 = (n2Str.includes(".") ? n2Str.split(".")[1].length : 0);

      if (lastop !== "÷") {
        // Use Math.max for fixed precision to avoid floating point issues
        return parseFloat(calback(Number(num1), Number(num2)).toFixed(Math.max(len1, len2)));
      }

      return calback(Number(num1), Number(num2));
    }
  };

  // Event handler for button clicks (numbers and operations)
  const btn = (e) => {
    // Ignore clicks on non-button elements
    if (!e.target.matches("input") || e.target.id === "esound" || e.target.id === "src") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Add blink effect to the calculator screen
    CALC_SCREEN.classList.add("calculator__screen--blink");

    // Play sound and vibration if sound option is enabled
    if (d.getElementById("esound").checked) sound();

    const buttonValue = e.target.value; // Get the button's value

    // --- Handling Number and Decimal Input ---
    if (!isNaN(parseFloat(buttonValue)) || buttonValue === ",") {
      if (newNumberStarted) {
        n1 = []; // Clear n1 to start a completely new number
        newNumberStarted = false;
        if (buttonValue === ",") { // If starting a new number with a decimal
          n1.push("0", ".");
        }
      }

      if (buttonValue === ",") {
        if (!n1.includes(".")) {
          if (!n1.length) { // If ',' is the first input, make it "0."
            n1.push("0");
          }
          n1.push(".");
        }
      } else { // It's a digit
        if (n1.length === 1 && n1[0] === "0" && buttonValue !== "0" && !n1.includes(".")) {
          n1[0] = buttonValue; // Replace leading zero with the new digit
        } else {
          n1.push(buttonValue);
        }
      }
      result = n1.join(""); // Update result with the current input
      op = null; // Reset the operator if a number is pressed
    } else {
      // --- Handling Operator Input ---
      op = buttonValue; // Assign the operator

      if (Object.keys(cals).includes(op)) {
        if (lastop && n1.length > 0 && !newNumberStarted) {
          // If a previous operation exists and a new number (n1) has been entered
          n2 = cal(Number(n2), Number(n1.join("")), cals[lastop]);
          result = n2;
        } else if (n1.length > 0 && !lastop) {
          // If this is the first operation in a sequence, store current input as n2
          n2 = Number(n1.join(""));
          result = n2;
        } else if (n1.length === 0 && lastop && lastop !== "=") {
          // If operator is pressed immediately after another operator (e.g., 5 + * )
          // We assume user wants to change the operator, don't re-calculate.
          // n2 remains the current result or the previous n2.
          // result remains the current result.
        }
        
        lastop = op; // Set the last operation
        newNumberStarted = true; // Next number input will start a new number
      }
    }

    // --- Special Operator Handling ---
    if (op === "⌫") { // Backspace
      if (newNumberStarted) {
        // If an operator was just pressed and then backspace, clear the operator state
        newNumberStarted = false;
        op = lastop = null;
        n1 = result.toString().split(''); // Revert to the last result for editing
      } else {
        n1.pop(); // Remove the last character from current input
      }
      if (n1.join("").charAt(n1.join("").length - 1) === ".") n1.pop(); // Ensure no trailing decimal after backspace
      if (!n1.length) n1 = ["0"]; // Ensure there's always a number displayed
      result = n1.join("");
    }

    if (op === "C") { // Clear
      op = lastop = null;
      result = n2 = 0;
      n1.length = 0; // Clear n1 on 'C'
      newNumberStarted = false;
    }

    // Update the screen value, show "ERROR" if result is not finite
    CALC_SCREEN.textContent = !isFinite(result) ? "ERROR" : result;

    // --- Equals Operator Handling ---
    if (op === "=") {
      if (lastop && lastop !== "=" && n1.length > 0) {
        // If equals is pressed after an operation and a new number
        result = cal(Number(n2), Number(n1.join("")), cals[lastop]);
        n2 = result; // The result becomes the new n2 for chained equals
        n1.length = 0; // Clear n1 for the next input
        CALC_SCREEN.textContent = !isFinite(result) ? "ERROR" : result;
      } else if (lastop && lastop === "=" && n1.length === 0) {
        // Chained equals: re-apply the last operation with the current result and n2
        result = cal(Number(n2), Number(result), cals[lastop]);
        n2 = result;
        CALC_SCREEN.textContent = !isFinite(result) ? "ERROR" : result;
      }
      op = null; // Clear operator after equals
      lastop = "="; // Mark last operation as equals for chained calculations
      newNumberStarted = true; // Next number input will start a new number
    }
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
