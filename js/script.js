/* jshint esversion: 8 */
(function (w, d) {
    "use strict";

    // Constants for audio and theme management
    const BEEP_AUDIO_DATA = "data:audio/mp3;base64,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";
    const BEEP_AUDIO = new w.Audio(BEEP_AUDIO_DATA);

    const THEME_CLASSES = [0, "a", "b", "c", "d", "e l", "f", "g", "h l", "i n", "j n p", "k o p", "e l q"];
    const LOCAL_STORAGE_THEME_KEY = "calculatorThemeNumber";

    /**
     * @class ThemeCycler
     * @description Manages cycling through an array of theme classes.
     */
    class ThemeCycler {
        constructor(themes) {
            this.themes = themes;
            this.currentIndex = 0; // Default to the first theme
            this.maxIndex = themes.length - 1;
        }

        /**
         * @method increment
         * @description Moves to the next theme in the sequence, wrapping around to the beginning.
         */
        increment() {
            this.currentIndex = (this.currentIndex < this.maxIndex) ? this.currentIndex + 1 : 0;
        }

        /**
         * @method decrement
         * @description Moves to the previous theme in the sequence, wrapping around to the end.
         */
        decrement() {
            this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.maxIndex;
        }

        /**
         * @method getCurrentTheme
         * @description Returns the current theme class.
         * @returns {string|number} The current theme class.
         */
        getCurrentTheme() {
            return this.themes[this.currentIndex];
        }

        /**
         * @method setIndex
         * @description Sets the current theme index.
         * @param {number} index - The desired theme index.
         */
        setIndex(index) {
            if (index >= 0 && index <= this.maxIndex) {
                this.currentIndex = index;
            } else {
                // Fallback to the first theme (index 0), more predictable than random
                this.currentIndex = 0;
            }
        }
    }

    /**
     * @class Calculator
     * @description Represents the calculator's state and operations.
     */
    class Calculator {
        constructor(screenElement, rootElement, soundEnabledCheckbox) {
            this.screen = screenElement;
            this.root = rootElement;
            this.soundEnabledCheckbox = soundEnabledCheckbox;

            this.n1 = []; // Current input number as an array of digits/characters
            this.n2 = 0; // Previous number for operations (accumulator)
            this.operator = null; // Currently displayed operator
            this.lastOperator = null; // Last operator used in a calculation
            this.result = 0; // Calculation result
            this.awaitingNewNumber = false; // Flag to indicate if the next digit starts a new number

            this.screen.textContent = 0; // Initialize screen with '0'

            this.themeCycler = new ThemeCycler(THEME_CLASSES);

            // Mathematical functions: These are the core operations.
            this.operations = {
                "÷": (a, b) => a / b,
                "×": (a, b) => a * b,
                "+": (a, b) => a + b,
                "-": (a, b) => a - b,
                "=": (a) => a, // For '=', just returns the current value, as _calculate handles the final result display.
            };
        }

        /**
         * @method playSound
         * @description Plays the button beep sound and triggers vibration if enabled.
         */
        playSound() {
            if (this.soundEnabledCheckbox.checked) {
                BEEP_AUDIO.play();
                if (typeof w.navigator.vibrate === 'function') {
                    w.navigator.vibrate(30);
                }
            }
        }

        /**
         * @method _calculate
         * @description Performs the arithmetic calculation based on the numbers and operator,
         * applying floating-point precision corrections.
         * @param {number} num1 - The first operand (usually this.n2).
         * @param {number} num2 - The second operand (usually current input from this.n1).
         * @param {function} callbackFn - The mathematical function (e.g., this.operations['+']).
         * @returns {number} The result of the calculation.
         */
        _calculate(num1, num2, callbackFn) {
            // If callbackFn is not a function or if the operation is not defined,
            // return num2. This is a robust safeguard.
            if (typeof callbackFn !== "function") {
                return num2;
            }

            // Apply different precision strategies based on the *last operator* that triggered the calculation.
            // The switch should explicitly handle known arithmetic operators.
            switch (this.lastOperator) { // Use this.lastOperator as it reflects the operation that *led* to this calculation.
                case "+":
                case "-": { // Block scope for const declarations
                    // For addition and subtraction, find the maximum number of decimal places
                    const n1Decimals = (num1.toString().split(".")[1] || "").length;
                    const n2Decimals = (num2.toString().split(".")[1] || "").length;
                    const maxDecimals = Math.max(n1Decimals, n2Decimals);
                    const factor = Math.pow(10, maxDecimals);

                    // Perform operation using scaled integers, then divide by the factor.
                    // Math.round is crucial here to prevent tiny errors before division
                    // (e.g., 0.3 * 10 = 2.9999999999999996).
                    // Ensure operands are rounded before scaling to avoid issues with numbers like 0.1 + 0.2
                    return callbackFn(Math.round(num1 * factor), Math.round(num2 * factor)) / factor;
                }
                case "×": { // Block scope
                    // For multiplication, calculate directly and then fix precision.
                    // The total number of decimal places is the sum of decimal places.
                    const n1Decimals = (num1.toString().split(".")[1] || "").length;
                    const n2Decimals = (num2.toString().split(".")[1] || "").length;
                    const totalDecimals = n1Decimals + n2Decimals;
                    const multResult = callbackFn(num1, num2);

                    // .toFixed() is appropriate here, then parse back to a number.
                    return parseFloat(multResult.toFixed(totalDecimals));
                }
                case "÷":
                    // Division by zero is handled in the operations object.
                    // Otherwise, direct calculation is usually fine for precision.
                    return callbackFn(num1, num2);
                default:
                    // If no specific precision handling is defined for the operator,
                    // or if it's a new operation/initial state, calculate directly.
                    return callbackFn(num1, num2);
            }
        }

        /**
         * @method processInput
         * @description Processes a button click event, updating the calculator state.
         * @param {Event} e - The click event object.
         */
        processInput(e) {
            const target = e.target;
            const buttonValue = target.value;

            // Ignore clicks on non-button elements or specific IDs (like sound checkbox, source link)
            if (!target.matches("input") || target.id === "esound" || target.id === "src") {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            this.screen.classList.add("calculator__screen--blink");
            this.playSound();

            // Handle numeric input (digits 0-9)
            if (!isNaN(parseFloat(buttonValue))) {
                if (this.awaitingNewNumber) {
                    this.n1 = []; // Start a fresh number input
                    this.awaitingNewNumber = false;
                }

                // Handle leading zero and decimal point logic
                if (buttonValue === "0" && this.n1.length === 1 && this.n1[0] === "0") {
                    // Do nothing if trying to add another '0' after an initial '0' (e.g., 00)
                    return;
                }
                if (this.n1.length === 0 && buttonValue !== ".") { // If starting a number, replace '0' if it's there
                    this.n1 = [buttonValue];
                } else if (buttonValue === "." && this.n1.includes(".")) {
                    // Do nothing if a decimal point already exists in the current number
                    return;
                } else {
                    this.n1.push(buttonValue); // Add digit to current number
                }

                this.operator = null; // Clear the displayed operator as a new number is being typed

            } else { // Handle operators and special buttons (C, ⌫, +, -, ×, ÷, =)

                if (buttonValue === "C") {
                    this.reset();
                    return;
                }

                if (buttonValue === "⌫") {
                    // Backspace logic: If we just performed a calculation or pressed an operator,
                    // the current display is probably the result or n2.
                    // We need to move that to n1 to allow backspacing.
                    if (this.awaitingNewNumber && this.result !== 0) { // If after an operation, result is displayed
                        this.n1 = Array.from(this.result.toString());
                        this.awaitingNewNumber = false;
                        this.n2 = 0; // Reset n2 as we're now editing n1
                        this.lastOperator = null; // Clear last operator
                        this.result = 0; // Clear result
                        this.operator = null; // Clear displayed operator
                    } else if (this.awaitingNewNumber && this.n2 !== 0 && this.n1.length === 0) {
                         // If an operator was pressed and no new number typed, n2 is displayed.
                         this.n1 = Array.from(this.n2.toString());
                         this.awaitingNewNumber = false;
                         this.n2 = 0;
                         this.lastOperator = null;
                         this.result = 0;
                         this.operator = null;
                    }

                    if (this.n1.length > 0) {
                        this.n1.pop(); // Remove the last character

                        if (this.n1.length === 0 || (this.n1.length === 1 && this.n1[0] === "-")) {
                            // If all digits removed, or only '-' remains, display '0'
                            this.n1 = ["0"];
                        }
                    } else {
                        this.n1 = ["0"]; // If n1 was already empty, ensure it shows '0'
                    }
                    this.updateScreen();
                    return;
                }

                if (buttonValue === "." || buttonValue === ",") { // Handle decimal point input
                    // If awaiting a new number, start with "0."
                    if (this.awaitingNewNumber || this.n1.length === 0) {
                        this.n1 = ["0", "."];
                        this.awaitingNewNumber = false;
                    } else if (!this.n1.includes(".")) { // Only add if no decimal already exists
                        this.n1.push(".");
                    }
                    this.operator = null; // Keep operator null as it's part of number entry
                } else if (Object.keys(this.operations).includes(buttonValue)) {
                    // This block handles actual arithmetic operators (+, -, ×, ÷, =)
                    const currentInput = parseFloat(this.n1.join("") || "0"); // Safely get current input as a number

                    if (this.lastOperator && this.lastOperator !== "=") {
                        // If there's a pending operation, calculate with n2 and currentInput
                        this.result = this._calculate(this.n2, currentInput, this.operations[this.lastOperator]);
                    } else {
                        // First operation, or after '=', the current input becomes the base
                        this.result = currentInput;
                    }

                    this.n2 = this.result; // Store current result as the first operand (accumulator) for the next operation
                    this.n1.length = 0; // Clear n1, ready for the next number input
                    this.operator = buttonValue; // Store the current operator for display feedback
                    this.awaitingNewNumber = true; // Signal that the next digit will start a new number

                    if (buttonValue === "=") {
                        this.lastOperator = null; // Clear last operator after equals for a fresh start
                    } else {
                        this.lastOperator = buttonValue; // Set the operator for the *next* calculation
                    }
                }
            }
            this.updateScreen();
        }

        /**
         * @method updateScreen
         * @description Updates the calculator display screen.
         */
        updateScreen() {
            let displayValue;

            // Determine what to display based on calculator state
            if (this.awaitingNewNumber && this.operator && this.operator !== "=") {
                // If an operator was just pressed and we're awaiting the next number,
                // display the accumulated result (n2).
                displayValue = this.n2;
            } else if (this.n1.length > 0) {
                // If a number is being typed, display it.
                displayValue = this.n1.join("");
            } else if (this.result !== 0 || this.lastOperator === "=") {
                // After an '=' or if there's a result, display the result.
                displayValue = this.result;
            } else {
                // Default to '0' (initial state, after 'C', etc.)
                displayValue = 0;
            }

            // Special handling for ".": display "0."
            if (displayValue === ".") {
                displayValue = "0.";
            }

            if (!isFinite(displayValue) || isNaN(displayValue)) {
                this.screen.textContent = "ERROR";
                //this.reset(); // Reset calculator state on error to allow recovery
            } else {
                let formattedValue = displayValue.toString();

                // Format numbers to prevent excessive length or use scientific notation
                if (typeof displayValue === 'number') {
                    // Use a reasonable precision for display
                    if (formattedValue.length > 15) { // Adjust display length threshold as needed
                         if (Math.abs(displayValue) > 999999999999999 || (Math.abs(displayValue) < 0.000000000000001 && Math.abs(displayValue) !== 0)) {
                             formattedValue = displayValue.toExponential(8); // Example: 8 decimal places in exponent form
                         } else {
                             // Use toPrecision to limit total significant digits for very long numbers
                             formattedValue = parseFloat(displayValue.toPrecision(15)).toString();
                         }
                    }
                }
                this.screen.textContent = formattedValue;
            }
        }


        /**
         * @method reset
         * @description Resets the calculator to its initial state.
         */
        reset() {
            this.n1 = [];
            this.n2 = 0;
            this.operator = null;
            this.lastOperator = null;
            this.result = 0;
            this.awaitingNewNumber = false;
            this.screen.textContent = 0;
        }

        /**
         * @method changeTheme
         * @description Applies the current theme to the root element.
         */
        changeTheme() {
            const themeClass = this.themeCycler.getCurrentTheme();
            if (themeClass) {
                this.root.className = themeClass;
            } else {
                this.root.removeAttribute("class");
            }
            localStorage.setItem(LOCAL_STORAGE_THEME_KEY, this.themeCycler.currentIndex);
        }

        /**
         * @method initTheme
         * @description Initializes the theme based on local storage or a random value.
         */
        initTheme() {
            const storedThemeIndex = parseInt(localStorage.getItem(LOCAL_STORAGE_THEME_KEY));
            if (!isNaN(storedThemeIndex)) {
                this.themeCycler.setIndex(storedThemeIndex);
            } else {
                // Set a random initial theme if none is stored
                this.themeCycler.setIndex(Math.floor(Math.random() * (this.themeCycler.maxIndex + 1)));
            }
            this.changeTheme();
        }

        /**
         * @method setupEventListeners
         * @description Sets up all event listeners for the calculator.
         */
        setupEventListeners() {
            const CALC = d.querySelector(".calculator");
            const CALC_SCREEN = d.querySelector(".calculator__screen");

            CALC.addEventListener("mousedown", (e) => this.processInput(e));
            CALC.addEventListener("mouseup", () => {
                const screenTimeout = setTimeout(() => {
                    clearTimeout(screenTimeout);
                    this.screen.classList.remove("calculator__screen--blink");
                }, 7);
            });

            CALC_SCREEN.addEventListener("click", (e) => {
                e.preventDefault(); // Prevent text selection on quick clicks
                this.themeCycler.increment();
                this.changeTheme();
            });

            CALC_SCREEN.addEventListener("contextmenu", (e) => {
                e.preventDefault(); // Prevent context menu
                this.themeCycler.decrement();
                this.changeTheme();
            });
        }
/**
         * @method registerServiceWorker
         * @description Registers the service worker for offline capabilities.
         */
        registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                try {
                    // IMPORTANT: Adjust the path to sw.js based on your deployment.
                    // If sw.js is in the same directory as this HTML, use './sw.js'.
                    // If it's at the root of your domain, use '/sw.js'.
                    // The current path '/project-k/calculator/sw.js' implies a specific subfolder structure.
                    navigator.serviceWorker.register('/project-k/calculator/sw.js?v=1')
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
        }

        /**
         * @method init
         * @description Initializes the calculator's functionality.
         */
        init() {
            this.initTheme();
            this.registerServiceWorker();
            this.setupEventListeners();
        }
    }

    // Initialize the Calculator when the DOM is ready
    d.addEventListener("DOMContentLoaded", () => {
        const rootElement = d.documentElement;
        const calcScreenElement = d.querySelector(".calculator__screen");
        const soundCheckbox = d.getElementById("esound");

        const calculator = new Calculator(calcScreenElement, rootElement, soundCheckbox);
        calculator.init();
    });

})(window, document);
