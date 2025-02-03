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
}

const numberButtons = Array.from(document.querySelectorAll(".number"));
const clearButton = document.querySelector("#clear")
let number = 0;

numberButtons.forEach((button) => {
    button.addEventListener("click", function() {
        let n = button.innerText
        displayDigit(n);
        number += Number(n);
        console.log(number);
    })
})

clearButton.addEventListener("click", clearDisplay)

