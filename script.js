const display = document.querySelector(".display");

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

function displayDigit(a) {
    display.textContent += a;
}

function clearDisplay() {
    display.textContent = "";
    number = 0;
    firstNumber = 0;
    secondNumber = 0;
}

const numberButtons = Array.from(document.querySelectorAll(".number"));
const operatorButtons = Array.from(document.querySelectorAll(".operator"));
const clearButton = document.querySelector("#clear")
const equalButton = document.querySelector("#equal")

let number = 0;
let firstNumber = 0
let secondNumber = 0
let operatorClicked = false
let operator


numberButtons.forEach((button) => {
    button.addEventListener("click", function() {
        let n = button.innerText
        if(operatorClicked == true) {
            display.textContent = "";
            operatorClicked = false
        }
        displayDigit(n);
        number = number * 10 + Number(n)
    })
})

operatorButtons.forEach((button) => {
    button.addEventListener("click", function() {
        operatorClicked = true
        digits = 0;
        operator = button.id;
        if (firstNumber == 0) {
            firstNumber = number;
            number = 0;
        }
       
    })
})

clearButton.addEventListener("click", clearDisplay)


equalButton.addEventListener("click", function() {
    secondNumber = number
    const result = operate (firstNumber, secondNumber, operator)
    console.log(firstNumber)
    console.log(secondNumber)
    console.log(operator)
    display.textContent = "";
    displayDigit(result)
})




