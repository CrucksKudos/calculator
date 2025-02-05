//-------------------Defining variables and selecting HTML documents --------------------------------------------------------------------

const display = document.querySelector(".display");
const numberButtons = Array.from(document.querySelectorAll(".number"));
const operatorButtons = Array.from(document.querySelectorAll(".operator"));
const clearButton = document.querySelector("#clear")
const equalButton = document.querySelector("#equal")
const pointButton = document.querySelector("#point")
const backspaceButton = document.querySelector("#backspace")
const positiveNegativeButton = document.querySelector("#posneg")

// Map keyboard keys to the corresponding calculator button IDs,
// enabling the associated button to blink when its key is pressed.
const keyToButtonId = {
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
    ".": "point",
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    "Enter": "equal",
    "=": "equal",
    "Backspace": "backspace",
    "Delete": "clear"
};

let currentInput = null;
let firstNumber = null
let secondNumber = null
let result = null;
let decimal = false;
let digit = 1;
let lastClick;
let operator

//------------------- Defining functions --------------------------------------------------------------------

//Function used to blink the button when it is clicked
function blink (item) {
    item.classList.add("blink");
    setTimeout(() => {item.classList.remove("blink");}, 100);
}

//-------- Math Functions -------------
function add(a, b) { return a + b; }

function subtract(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return a / b; }

function operate(a, b, operator) {

    if(operator == "divide" && b == 0) { return "LOL" } //That is a project's requirement

    switch(operator) {
        
        case "add": return add(a, b);

        case "subtract": return subtract(a, b);

        case "multiply": return multiply(a, b);

        default: return divide(a, b);
    }
}

//------ Calculator Functions -------------------------

// This function updates the display to show the user's input while preserving its exact format.
// It ensures that non-"pure" numeric inputs are displayed as entered. For example, if the user types
// a 0 immediately after a decimal point, the display will show X.0. Without this logic, printing the
// number directly could result in omitting the trailing zeros (e.g., X.000 would simply appear as X).
function displayNumber(a, clearDisplay = true) {

    let newText = display.innerText;

    if (newText == "0" && a != ".") { clearDisplay = true; }
    
    if (clearDisplay == true) { newText = a.toString(); }
    else { newText += a.toString(); } 

    // Limit the displayed number to a maximum of 10 characters so that it fits within the display.
    const maxDigits = 10;
    if (newText.length > maxDigits) { newText = newText.slice(0, maxDigits);}

    display.textContent = newText;
}

function resetValues() {
    currentInput = null;
    firstNumber = null;
    secondNumber = null;
    result = null;
    decimal = false;
    digit = 1;
    lastClick = ""
    operator = ""
}

//----------- Button Functions ----------------------
function clearAll(event) {
    if (event.type === "click") { blink(event.target) }
    display.textContent = "";
    resetValues()
}

function digitClick(event) {
    let n;
    lastClick = "digit";
    
    if (event.type === "click") {
        n = event.target.innerText; 
        blink(event.target);
    } else if (event.type === "keydown") {
        n = event.key;
    }

    // Clear the display when the first digit is input after an operator    
    if (currentInput == null && decimal == false) { display.textContent = ""; }

    if (!decimal) { currentInput = currentInput * 10 + Number(n); } 
    else {
        // Handle decimal input: calculate the fractional part and round to avoid precision issues.
        currentInput = Math.round((currentInput + Number(n) / (10 ** digit)) * 1e10) / 1e10;
        digit++;
    }

    displayNumber(n, false);
}

function operatorClick(event) {

    // Reset the decimal flag and digit counter for a new number entry.
    decimal = false;
    digit = 1;
    
    // Check if the last input was an operator.
    // If true, simply update the operator without altering operands.
    if (lastClick == "operator") {
        if (event.type === "click") {
            operator = event.target.id; 
            blink(event.target)
        } else if (event.type === "keydown") {
            switch(event.key) {
                case "+":
                    operator = "add";
                    break;
                case "-":
                    operator = "subtract";
                    break;
                case "*":
                    operator = "multiply";
                    break;
                default:
                    operator = "divide"
            }
        }
    }
    // Otherwise, process the operator input normally.
    else {
        // If no first number has been stored yet, process the operator input
        // and store the current input as the first operand.
        if (firstNumber == null) {
            if (event.type === "click") {
                operator = event.target.id; 
                blink(event.target)
            } else if (event.type === "keydown") {
                switch(event.key) {
                    case "+":
                        operator = "add";
                        break;
                    case "-":
                        operator = "subtract";
                        break;
                    case "*":
                        operator = "multiply";
                        break;
                    default:
                        operator = "divide"
                }
            }
            firstNumber = currentInput;
            currentInput = null;
        }
        // If a first number already exists, then the current input becomes the second operand.
        // This logic allows the user to perform continuous calculations.
        else if (firstNumber != null) {
            secondNumber = currentInput;
            result = operate (firstNumber, secondNumber, operator);
            displayNumber(result);
            firstNumber = result;
            currentInput = null;

            if (event.type === "click") {
                operator = event.target.id; 
                blink(event.target)
            } else if (event.type === "keydown") {
                switch(event.key) {
                    case "+":
                        operator = "add";
                        break;
                    case "-":
                        operator = "subtract";
                        break;
                    case "*":
                        operator = "multiply";
                        break;
                    default:
                        operator = "divide";
                }
            }}
    }
    // Record that the last input was an operator.
    lastClick = "operator";

}

function equalClick(event) {
    lastClick = "equal";

    if (event.type === "click") { blink(event.target); }

    // Prevents issues when an operator (e.g., "-") is pressed before a valid second operand is entered.
    // In such cases, the display simply shows the first number, keeping the operation unchanged.
    if (firstNumber != null && currentInput == null) { displayNumber(firstNumber); }
    else if (firstNumber != null && currentInput != null) {
        secondNumber = currentInput;
        result = operate (firstNumber, secondNumber, operator);
        displayNumber(result);
    }
}

function pointClick(event) {
    lastClick = "point";

    if (event.type === "click") { blink(event.target); }

 // Allow adding a decimal point only if one hasn't been added yet.    
    if (decimal == false) {
        // Format the number correctly based on whether it already has an integer part.
        if(currentInput == null) { displayNumber("0."); } 
        else { displayNumber(".", false); }
        // Mark that a decimal point has been added.
        decimal = true;
    }
}

function backspaceClick(event) {
    if (event.type === "click") { blink(event.target) }

    // If the last action was "equal" or an operator press, reset the calculator.
    // This ensures that backspacing a result or an already completed operation clears the input.    
    if(lastClick == "equal" || lastClick == "operator") { clearAll () }
    
    else {
        // If there is a current input, attempt to remove the last digit.
        if (currentInput != null) {

            if (decimal == false) { currentInput = (currentInput - (currentInput % 10))/10 }
            else {
                // For numbers with a decimal part:
                if (digit > 1) {    
                    // Remove the last digit after the decimal by:
                    // 1. Scaling the number up by 10^(digit-1)
                    // 2. Removing the least significant digit via modulus arithmetic
                    // 3. Scaling the number back down            
                    currentInput = ((currentInput * 10 ** (digit - 1)) - ((currentInput * 10 ** (digit - 1)) % 10)) / 10 ** (digit - 1)
                    digit --;

                    // If digit equals 1, then all fractional digits have been removed, and the number is now an integer.
                    // Therefore, disable the decimal flag.                    
                    if (digit == 1)
                        {
                            decimal = false;
                        }
                }
                // This handles the case where the user added the decimal point but didn't enter any digits afterward.
                // In this case, disable the decimal flag since no fractional part is present.
                else {
                    decimal = false;
                }
            }
            
            // If the resulting current input becomes 0, reset the input and clear the display.
            if (currentInput == 0) {
                currentInput = null
                displayNumber("")
            } else {
            displayNumber(currentInput)}
        }
        
        else {
            // If there is no current input, reset the decimal flag and clear the display.
            decimal = false
            displayNumber("")
        }
    }
}

function positiveNegativeClick (event) {
    if (event.type === "click") { blink(event.target) }
    currentInput *= -1;
    displayNumber(currentInput)
}




//------------------- Adding Event Listeners --------------------------------------------------------------------

//------- Event Listeners for Buttons ---------------------

numberButtons.forEach((button) => {button.addEventListener("click", digitClick);});

operatorButtons.forEach((button) => {button.addEventListener("click", operatorClick);});

equalButton.addEventListener("click", equalClick)

clearButton.addEventListener("click", clearAll)

pointButton.addEventListener("click", pointClick)
    
backspaceButton.addEventListener("click", backspaceClick)

positiveNegativeButton.addEventListener("click", positiveNegativeClick)

//------- Event Listeners for Keyboard Inputs ---------------------    

window.addEventListener("keydown", (event) => {
    // Retrieve the corresponding button ID from the key-to-button mapping using the pressed key.
    const buttonId = keyToButtonId[event.key];
    if (buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            blink(button); 
        }
    }
    
    if (event.key >= "0" && event.key <= "9") 
    {
        digitClick(event)
    }
    else if (event.key == "+" || event.key == "-" || event.key == "*" || event.key == "/") 
    {
        operatorClick(event)
    }
    else if (event.key == "=" || event.key == "Enter")
    {
        equalClick(event)
    }
    else if (event.key == "Delete")
    {
        clearAll(event)
    }
    else if (event.key == "Backspace")
    {
        backspaceClick(event)
    }
    else if (event.key == ".")
    {
        pointClick(event)
    }
})


