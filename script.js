const display = document.querySelector(".display");
const numberButtons = Array.from(document.querySelectorAll(".number"));
const operatorButtons = Array.from(document.querySelectorAll(".operator"));
const clearButton = document.querySelector("#clear")
const equalButton = document.querySelector("#equal")
const pointButton = document.querySelector("#point")
const backspaceButton = document.querySelector("#backspace")
const positiveNegativeButton = document.querySelector("#posneg")

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

let number = null;
let firstNumber = null
let secondNumber = null
let result = null;
let decimal = false;
let digit = 1;
let lastClick;
let operator

function blink (item) {
    item.classList.add("blink");
    setTimeout(() => {
        item.classList.remove("blink"); 
    }, 100);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, operator) {
    let result = 0;

    if(operator == "divide" && b == 0) {
        return "LOL"
    }

    switch(operator) {
        
        case "add":
            result = add(a, b);
            break;

        case "subtract":
            result = subtract(a, b);
            break;
        
        case "multiply":
            result = multiply(a, b);
            break;

        default:
            result = divide(a, b);
    }

    return result;
}

function displayNumber(a, clearDisplay = true) {

    let newText = display.innerText;

    if (newText == "0" && a != ".") {
        clearDisplay = true
    }
    
    if (clearDisplay == true) {
        newText = a.toString();
    }
    
    else 
    {
        newText += a.toString();
    }

    const maxDigits = 10;
    if (newText.length > maxDigits) {
        newText = newText.slice(0, maxDigits);
    }

    display.textContent = newText;
}

function resetValues() {
    number = null;
    firstNumber = null;
    secondNumber = null;
    result = null;
    digit = 1;
    decimal = false;
    operator = ""
}

function clearAll(event) {
    if (event.type === "click") {
        blink(event.target)}
    display.textContent = "";
    resetValues()
}

function buttonClick(event) {
    
    let n;

    if (event.type === "click") {
        n = event.target.innerText; 
        blink(event.target);
    } else if (event.type === "keydown") {
        n = event.key;
    }

    if (number == null && decimal == false) {
        display.textContent = "";
    }

    if (!decimal) {
        number = number * 10 + Number(n);
    } else {
        number = Math.round((number + Number(n) / (10 ** digit)) * 1e10) / 1e10;
        digit++;
    }
    lastClick = "digit";
    displayNumber(n, false);
}

function operatorClick(event) {

    decimal = false;
    digit = 1;
    lastClick = "operator";

    
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
        firstNumber = number;
        number = null;
    }
    else if (firstNumber != null) {
        secondNumber = number;
        result = operate (firstNumber, secondNumber, operator);
        displayNumber(result);
        firstNumber = result;
        number = null;
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
    console.log(operator)
}

function equalClick(event) {
    lastClick = "equal";
    if (event.type === "click") {
        blink(event.target)}

    if (firstNumber != null && number == null) {
        displayNumber(firstNumber)
    }

    else if (firstNumber != null && number != null) {
        secondNumber = number
        result = operate (firstNumber, secondNumber, operator)
        displayNumber(result)
    }
}

function pointClick(event) {
    lastClick = "point";

    if (event.type === "click") {
        blink(event.target)}

    if (decimal == false) {
        
        if(number == null) {
            displayNumber("0.");
            decimal = true;
        }

        else {
            displayNumber(".", false);
            decimal = true;
        }

    }
}

function backspaceClick(event) {
    if (event.type === "click") {
        blink(event.target)}

    if(lastClick == "equal" || lastClick == "operator") {
        clearAll ()
    }
    
    else {
        if (number != null) {
            if (decimal == false) {
                number = (number - (number % 10))/10
            }
            else {
                if (digit > 1) {                
                    number = ((number * 10 ** (digit - 1)) - ((number * 10 ** (digit - 1)) % 10)) / 10 ** (digit - 1)
                    digit --;
                    if (digit == 1)
                    {
                        decimal = false;
                    }
                }
                else {
                    decimal = false;
                }
            }
        
            if (number == 0) {
                number = null
                displayNumber("")
            }
            else {
            displayNumber(number)}
        }

        else {
            decimal = false
            displayNumber("")
        }
    }
}

function positiveNegativeClick (event) {
    if (event.type === "click") {
        blink(event.target)}
    number *= -1;
    displayNumber(number)
}

numberButtons.forEach((button) => {button.addEventListener("click", buttonClick);});

operatorButtons.forEach((button) => {button.addEventListener("click", operatorClick);});

equalButton.addEventListener("click", equalClick)

clearButton.addEventListener("click", clearAll)

pointButton.addEventListener("click", pointClick)
    
backspaceButton.addEventListener("click", backspaceClick)

positiveNegativeButton.addEventListener("click", positiveNegativeClick)
    
window.addEventListener("keydown", (event) => {
    
    const buttonId = keyToButtonId[event.key];
    if (buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            blink(button); 
        }
    }
    
    if (event.key >= "0" && event.key <= "9") 
    {
        buttonClick(event)
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
















function check() {
    console.log (`First: ${firstNumber}, Second: ${secondNumber}, Operator: ${operator},Result: ${result}`);
}