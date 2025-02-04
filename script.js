const display = document.querySelector(".display");
const numberButtons = Array.from(document.querySelectorAll(".number"));
const operatorButtons = Array.from(document.querySelectorAll(".operator"));
const clearButton = document.querySelector("#clear")
const equalButton = document.querySelector("#equal")
const pointButton = document.querySelector("#point")
const backspaceButton = document.querySelector("#backspace")

let number = null;
let firstNumber = null
let secondNumber = null
let result = null;
let decimal = false;
let digit = 1;
let operator


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
    
    if (clearDisplay == true) {
        newText = a.toString();
    }
    
    else 
    {
        newText += a.toString();
    }

    const maxDigits = 10;
    if (newText.length > maxDigits) {
        newText = newText.slice(0, maxDigits); // Mantém apenas os primeiros 10 caracteres
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

function clearAll() {
    display.textContent = "";
    resetValues()
}

numberButtons.forEach((button) => {
    button.addEventListener("click", function() {
        let n = button.innerText
        
        if (number == null && decimal == false) {
            display.textContent = ""
        }

        if (!decimal) {
            number = number * 10 + Number(n)
        }
        else {
            number = Math.round((number + Number(n) / (10 ** digit)) * 1e10) / 1e10;
            digit ++;
        }
        console.log(number)
        displayNumber(n, false)
        
    })
})

operatorButtons.forEach((button) => {
    button.addEventListener("click", function() {

        decimal = false;
        digit = 1;

        if (firstNumber == null) {
            operator = button.id;
            firstNumber = number;
            number = null;
        }
        else if (firstNumber != null) {
            secondNumber = number;
            result = operate (firstNumber, secondNumber, operator);
            displayNumber(result);
            firstNumber = result;
            number = null;
            operator = button.id;
        }
       
    })
})

equalButton.addEventListener("click", function() {
    
    if (firstNumber != null && number == null) {
        displayNumber(firstNumber)
    }

    else if (firstNumber != null && number != null) {
        secondNumber = number
        result = operate (firstNumber, secondNumber, operator)
        displayNumber(result)
        check()
    }
})

clearButton.addEventListener("click", clearAll)

function check() {
    console.log (`First: ${firstNumber}, Second: ${secondNumber}, Operator: ${operator},Result: ${result}`);
}

pointButton.addEventListener("click", function() {
    
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
})

backspaceButton.addEventListener("click", function() {
    
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
})



