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
                "÷": (a, b) => {
                    if (b === 0) return NaN; // Handle division by zero explicitly
                    return a / b;
                },
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
            if (typeof callbackFn !== "function") {
                return num2; // Should not happen if called correctly, but a safeguard.
            }

            // Apply different precision strategies based on the *last operator* that triggered the calculation
            switch (this.lastOperator) {
                case "+":
                case "-":
                    // For addition and subtraction, find the maximum number of decimal places
                    // to correctly scale and then des-cale to avoid floating point errors.
                    const n1DecimalsAddSub = (num1.toString().split(".")[1] || "").length;
                    const n2DecimalsAddSub = (num2.toString().split(".")[1] || "").length;
                    const maxDecimals = Math.max(n1DecimalsAddSub, n2DecimalsAddSub);
                    const factor = Math.pow(10, maxDecimals);

                    // Perform operation using scaled integers, then divide by the factor
                    // Math.round is crucial here to prevent tiny errors before division (e.g., 0.3 * 10 = 2.9999999999999996)
                    return callbackFn(Math.round(num1 * factor), Math.round(num2 * factor)) / factor;

                case "×":
                    // For multiplication, the total number of decimal places is the sum of decimal places.
                    const n1DecimalsMult = (num1.toString().split(".")[1] || "").length;
                    const n2DecimalsMult = (num2.toString().split(".")[1] || "").length;
                    const totalDecimalsMult = n1DecimalsMult + n2DecimalsMult;
                    const multResult = callbackFn(num1, num2);
                    
                    // .toFixed() is appropriate here, then parse back to number
                    return parseFloat(multResult.toFixed(totalDecimalsMult));

                case "÷":
                    // Division by zero is already handled in the operations object.
                    // Otherwise, direct calculation is usually fine.
                    return callbackFn(num1, num2);

                default:
                    // For '=', or initial state where no previous operator defined complex precision.
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

                // Handle leading zero logic
                if (this.n1.length === 1 && this.n1[0] === "0" && buttonValue !== ".") {
                    this.n1 = [buttonValue]; // Replace '0' with the new digit
                } else if (buttonValue === "." && this.n1.includes(".")) {
                    // Do nothing if a decimal point already exists in the current number
                    return;
                } else {
                    this.n1.push(buttonValue); // Add digit to current number
                }

                this.operator = null; // Clear the displayed operator as new number is being typed

            } else { // Handle operators and special buttons (C, ⌫, +, -, ×, ÷, =)
                
                if (buttonValue === "C") {
                    this.reset();
                    return;
                }

                if (buttonValue === "⌫") {
                    // Backspace should act on the displayed number.
                    // If we're awaiting a new number (meaning an operator was just pressed or '=' was used),
                    // the displayed number is either 'n2' (running total) or 'result' (final result).
                    // We need to move that number into n1 so it can be edited.
                    if (this.awaitingNewNumber) {
                        let valueToEdit = this.result; // After '=', result is primary.
                        if (this.lastOperator && this.lastOperator !== "=" && this.n1.length === 0) {
                            // If an operator was just pressed and no new number typed, n2 is what's displayed.
                            valueToEdit = this.n2;
                        }
                        this.n1 = Array.from(valueToEdit.toString()); // Convert to array of chars for editing
                        this.n2 = 0; // Reset n2 as we're now editing a new n1
                        this.lastOperator = null; // Clear last operator
                        this.result = 0; // Clear result so it doesn't interfere
                        this.operator = null; // Clear displayed operator
                        this.awaitingNewNumber = false; // No longer awaiting a new number, we are editing n1
                    }

                    // Now, n1 reliably holds the number to be backspaced
                    if (this.n1.length > 0) {
                        this.n1.pop(); // Remove the last character

                        if (this.n1.length === 0) {
                            this.n1 = ["0"]; // If all digits removed, display '0'
                        } else if (this.n1.length === 1 && this.n1[0] === "-") {
                            // Special case: if only '-' remains (e.g., after backspacing "-5" to just "-"), display '0'
                            this.n1 = ["0"];
                        }
                    } else {
                        // If n1 was already empty (e.g., initial state or after clear), nothing to backspace
                        this.n1 = ["0"];
                    }

                    this.updateScreen();
                    return; // Stop further processing for backspace
                }

                if (buttonValue === "," || buttonValue === ".") { // Handle decimal point input (assuming "," maps to ".")
                    if (!this.n1.includes(".")) { // Only add if no decimal already exists
                        if (this.n1.length === 0 || this.awaitingNewNumber) {
                            // If starting a new number or no number entered yet, start with "0."
                            this.n1 = ["0", "."];
                            this.awaitingNewNumber = false; // Decimal is part of the current number, not awaiting new.
                        } else {
                            this.n1.push("."); // Add decimal to current number
                        }
                    }
                    this.operator = null; // Keep operator null as it's part of number entry
                } else if (Object.keys(this.operations).includes(buttonValue)) {
                    // This block handles actual arithmetic operators (+, -, ×, ÷, =)
                    // Signal that the next digit will start a new number
                    this.awaitingNewNumber = true;

                    // Determine the current input value for calculation
                    let currentInput;
                    if (this.n1.length > 0 && this.n1.join("") !== "." && !isNaN(parseFloat(this.n1.join("")))) {
                        currentInput = parseFloat(this.n1.join(""));
                    } else {
                        // If n1 is empty or just '.', use n2 (the accumulated result) for chained operations
                        currentInput = this.n2;
                    }

                    if (this.lastOperator && this.lastOperator !== "=") {
                        // If there's a pending operation, calculate with n2 and currentInput
                        this.result = this._calculate(this.n2, currentInput, this.operations[this.lastOperator]);
                    } else {
                        // First operation or after '=', the current input becomes the base
                        this.result = currentInput;
                    }
                    
                    this.lastOperator = buttonValue; // Set the operator for the *next* calculation
                    this.n2 = this.result; // Store current result as the first operand (accumulator) for the next operation
                    this.n1.length = 0; // Clear n1, ready for the next number input

                    if (buttonValue === "=") {
                        this.awaitingNewNumber = true; // After '=', next digit starts a completely new calculation
                        this.lastOperator = null; // Clear last operator after equals for a fresh start
                    }
                    this.operator = buttonValue; // Store the current operator (for display feedback)
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

            // Priority for display:
            // 1. Current number being typed (n1) if not empty or just a decimal point.
            // 2. "0." if n1 is only a decimal point.
            // 3. Running total (n2) if an operator is active and we're awaiting a new number (e.g., "5 +").
            // 4. Final result (this.result) as fallback.
            // 5. Default to '0' if all else fails (e.g., initial state or after 'C').

            if (this.n1.length > 0 && this.n1.join("") !== ".") {
                displayValue = this.n1.join("");
            } else if (this.n1.join("") === ".") {
                displayValue = "0.";
            } else if (this.awaitingNewNumber && this.operator && this.operator !== "=") {
                // If an operator was just pressed and we're awaiting the next number,
                // display the accumulated result (n2).
                displayValue = this.n2;
            } else {
                displayValue = this.result;
            }

            if (!isFinite(displayValue)) {
                this.screen.textContent = "ERROR";
                this.reset(); // Reset calculator state on error to allow recovery
            } else {
                let formattedValue = displayValue.toString();

                if (typeof displayValue === 'number') {
                    // Handle scientific notation for very large or very small numbers
                    // Adjust thresholds as needed
                    if (Math.abs(displayValue) > 9999999999 || (Math.abs(displayValue) < 0.0000000001 && Math.abs(displayValue) !== 0)) {
                         formattedValue = displayValue.toExponential(5); // Example: 5 decimal places in exponent form
                    } else if (formattedValue.length > 10) { // General length check for non-scientific
                        formattedValue = parseFloat(displayValue.toPrecision(10)).toString();
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
