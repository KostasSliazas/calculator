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
                // console.warn(`Invalid theme index: ${index}. Falling back to default theme (index 0).`);
                this.currentIndex = 0; // Fallback to the first theme, more predictable
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
            this.n2 = 0; // Previous number for operations
            this.operator = null; // Current selected operation
            this.lastOperator = null; // Last operation performed
            this.result = 0; // Calculation result
            this.isResultDisplayed = false; // Flag to indicate if the current display is a result

            this.screen.textContent = 0; // Initialize screen

            this.themeCycler = new ThemeCycler(THEME_CLASSES);

            // Mathematical functions
            this.operations = {
                "÷": (a, b) => {
                    if (b === 0) return NaN; // Handle division by zero
                    return a / b;
                },
                "×": (a, b) => a * b,
                "+": (a, b) => a + b,
                "-": (a, b) => a - b,
                "=": (a) => a, // For '=' operator, just returns the current value
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
         * @description Performs the arithmetic calculation based on the numbers and operator.
         * @param {number} num1
         * @param {number} num2
         * @param {function} callbackFn - The mathematical function to apply.
         * @returns {number} The result of the calculation.
         */
        _calculate(num1, num2, callbackFn) {
            if (typeof callbackFn !== "function") {
                return num2; // If no valid callback, return the second number (e.g., for '=' without an operator)
            }

            // Implement more robust floating-point precision handling
            switch (this.lastOperator) {
                case "+":
                case "-":
                    const n1DecimalsAddSub = (num1.toString().split(".")[1] || "").length;
                    const n2DecimalsAddSub = (num2.toString().split(".")[1] || "").length;
                    const maxDecimals = Math.max(n1DecimalsAddSub, n2DecimalsAddSub);
                    const factor = Math.pow(10, maxDecimals);
                    // Use Math.round to mitigate tiny floating point errors before division
                    return callbackFn(Math.round(num1 * factor), Math.round(num2 * factor)) / factor;

                case "×":
                    const n1DecimalsMult = (num1.toString().split(".")[1] || "").length;
                    const n2DecimalsMult = (num2.toString().split(".")[1] || "").length;
                    const totalDecimalsMult = n1DecimalsMult + n2DecimalsMult;
                    const multResult = callbackFn(num1, num2);
                    // toFixed works well for multiplication where sum of decimals is relevant
                    return parseFloat(multResult.toFixed(totalDecimalsMult));

                case "÷":
                    // Division often requires careful consideration; for now, let JS handle it,
                    // but guard against division by zero.
                    if (num2 === 0) return NaN;
                    return callbackFn(num1, num2);

                default:
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

            // Ignore clicks on non-button elements or specific IDs
            if (!target.matches("input") || target.id === "esound" || target.id === "src") {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            this.screen.classList.add("calculator__screen--blink");
            this.playSound();

            // Handle numeric input
            if (!isNaN(parseFloat(buttonValue))) {
                if (this.isResultDisplayed || (this.n1.length === 1 && this.n1[0] === "0" && buttonValue !== ".")) {
                    // Start a new number if a result was just displayed or if it's a leading zero without decimal
                    this.n1 = [];
                    this.isResultDisplayed = false;
                }

                if (this.n1.length === 0 && buttonValue === "0") {
                    this.n1.push("0"); // Allow a single leading zero
                } else if (buttonValue === "." && this.n1.includes(".")) {
                    // Do nothing if decimal already exists
                    return;
                } else {
                    this.n1.push(buttonValue);
                }

                this.operator = null; // Clear operator as new number is being input

            } else { // Handle operators and special buttons
                this.isResultDisplayed = false; // An operator means we're not just showing a result anymore

                if (buttonValue === "C") {
                    this.reset();
                    return;
                }

                if (buttonValue === "⌫") {
                    if (this.n1.length > 0) {
                        this.n1.pop();
                        // If after popping, the array is empty, ensure it's not undefined or just a decimal
                        if (this.n1.length === 0 || (this.n1.length === 1 && this.n1[0] === ".")) {
                             this.n1 = ["0"]; // Display '0'
                        }
                    } else if (this.result !== 0) {
                        // If no current input, and a result exists, clear result for new input
                        this.result = 0;
                        this.n1 = ["0"];
                    }
                    this.updateScreen(); // Update screen immediately for backspace
                    return; // Skip further operator processing
                }

                if (buttonValue === "," && !this.n1.includes(".")) {
                    if (this.n1.length === 0 || (this.n1.length === 1 && this.n1[0] === "0" && !this.isResultDisplayed)) {
                        this.n1 = ["0", "."]; // Ensure "0." if nothing or only "0" before decimal
                    } else {
                        this.n1.push("."); // Add decimal point
                    }
                } else if (Object.keys(this.operations).includes(buttonValue)) {
                    const currentInput = parseFloat(this.n1.join(""));

                    if (this.lastOperator && this.lastOperator !== "=" && this.n1.length > 0) {
                        // Chain operations: calculate with previous operator
                        this.result = this._calculate(this.n2, currentInput, this.operations[this.lastOperator]);
                    } else {
                        // First operation or after '=' or when n1 is empty (e.g. 5 + +)
                        this.result = currentInput;
                    }

                    this.lastOperator = buttonValue; // Set the operator for the *next* calculation
                    this.n2 = this.result; // Store current result for next operation
                    this.n1.length = 0; // Clear n1 for next input

                    if (buttonValue === "=") {
                        this.isResultDisplayed = true;
                        this.lastOperator = null; // Clear last operator after equals
                    }
                    this.operator = buttonValue; // Set current operator for display/internal state
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

            if (this.n1.length > 0 && this.n1.join("") !== ".") {
                // If there's ongoing input, display it
                displayValue = this.n1.join("");
            } else if (this.n1.join("") === ".") {
                // Specifically handle just a '.' being input
                displayValue = "0.";
            } else {
                // Otherwise display the result or 0
                displayValue = this.result;
            }

            if (!isFinite(displayValue)) {
                this.screen.textContent = "ERROR";
                this.reset(); // Reset calculator state on error
            } else {
                // Format the number to avoid excessive decimal places in display for results
                // This is a display formatting, not calculation precision.
                if (typeof displayValue === 'number' && displayValue.toString().length > 10) { // Arbitrary limit for display
                    this.screen.textContent = parseFloat(displayValue.toPrecision(10)).toString();
                } else {
                    this.screen.textContent = displayValue.toString();
                }
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
            this.isResultDisplayed = false;
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
                // Fallback to a random theme if nothing is stored, or if stored is invalid.
                // Note: ThemeCycler.setIndex already handles invalid index by setting to 0.
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
                e.preventDefault();
                this.themeCycler.increment();
                this.changeTheme();
            });

            CALC_SCREEN.addEventListener("contextmenu", (e) => {
                e.preventDefault();
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
