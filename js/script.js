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
                console.warn(`Invalid theme index: ${index}. Falling back to random theme.`);
                this.currentIndex = Math.floor(Math.random() * (this.maxIndex + 1));
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

            this.screen.textContent = 0; // Initialize screen

            this.themeCycler = new ThemeCycler(THEME_CLASSES);

            // Mathematical functions
            this.operations = {
                "÷": (a, b) => a / b,
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

            // Handle floating-point precision for non-division operations
            if (this.lastOperator !== "÷") {
                const n1Decimals = (num1.toString().split(".")[1] || "").length;
                const n2Decimals = (num2.toString().split(".")[1] || "").length;
                const totalDecimals = n1Decimals + n2Decimals;
                return parseFloat(callbackFn(num1, num2).toFixed(totalDecimals));
            }

            return callbackFn(num1, num2);
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
            if ((buttonValue === this.lastOperator || !target.matches("input") || target.id === "esound" || target.id === "src") {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            this.screen.classList.add("calculator__screen--blink");
            this.playSound();
            
            // Handle numeric input
            if (!isNaN(parseFloat(buttonValue))) {
               // this.lastOperator = this.operator;
                this.operator = null; // Clear operator as new number is being input
                if (this.n1[0] === "0" && this.n1[1] !== ".") {
                    this.n1.length = 0; // Remove leading zero unless it's a decimal
                }
                this.n1.push(buttonValue);
                this.result = parseFloat(this.n1.join("")); // Update result immediately with current input
            } else {
                // Handle operators and special buttons
                this.operator = buttonValue;

                if (this.operator === "C") {
                    this.reset();
                    return;
                }

                if (this.operator === "⌫") {
                    if (this.n1.length > 0) {
                        this.n1.pop();
                        // If after popping, the last char is '.', remove it too
                        if (this.n1.join("").charAt(this.n1.join("").length - 1) === ".") {
                            this.n1.pop();
                        }
                    } else if (this.result !== 0) {
                        // If n1 is empty but result exists, operate on result
                        let resultString = this.result.toString();
                        resultString = resultString.substring(0, resultString.length - 1);
                        this.result = parseFloat(resultString || "0");
                        this.n1 = Array.from(resultString); // Update n1 for continuous input
                    }
                }

                if (this.n1.length === 0) {
                    this.n1 = ["0"]; // Ensure there's always a number displayed
                }

                if (this.operator === "," && !this.n1.includes(".")) {
                    this.n1.push("."); // Add decimal point
                }

                // Perform calculation when a valid operator is pressed
                if (Object.keys(this.operations).includes(this.operator) && this.n1.join("") !== ".") {
                    const currentInput = parseFloat(this.n1.join(""));

                    if (this.lastOperator && this.lastOperator !== "=") {
                        this.result = this._calculate(this.n2, currentInput, this.operations[this.lastOperator]);
                    } else {
                        // First operation or after '='
                        this.result = currentInput;
                    }

                    this.lastOperator = this.operator;
                    this.n2 = this.result; // Store current result for next operation
                    this.n1.length = 0; // Clear n1 for next input
                }
            }

            this.updateScreen();
        }

        /**
         * @method updateScreen
         * @description Updates the calculator display screen.
         */
        updateScreen() {
            // Display the current input if available, otherwise the result
            let displayValue = this.n1.length > 0 ? this.n1.join("") : this.result;

            if (!isFinite(displayValue)) {
                this.screen.textContent = "ERROR";
            } else {
                // Ensure display value is not empty or just a decimal point
                if (displayValue === "" || displayValue === ".") {
                    this.screen.textContent = "0";
                } else {
                    this.screen.textContent = displayValue;
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

