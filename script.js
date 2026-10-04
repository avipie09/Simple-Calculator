const display = document.getElementById("inp");
const calculator = document.querySelector(".calculator");

const OPERATORS = "+-*/%";

let expression = "";
let showingResult = false;

const isOperator = (ch) => OPERATORS.includes(ch);
const lastChar = () => expression.slice(-1);


function tokenize(expr) {
    const tokens = [];
    let num = "";

    for (const ch of expr) {
        if (isOperator(ch)) {
            if (num === "" && ch === "-") {
                num = "-";
            } else {
                tokens.push(num, ch);
                num = "";
            }
        } else {
            num += ch;
        }
    }

    tokens.push(num);
    return tokens;
}

function calculate(expr) {
    const tokens = tokenize(expr);

    const numbers = [];
    const ops = [];

    for (let i = 0; i < tokens.length; i++) {
        if (i % 2 === 0) {
            const value = Number(tokens[i]);
            if (tokens[i] === "" || Number.isNaN(value)) return NaN;
            numbers.push(value);
        } else {
            ops.push(tokens[i]);
        }
    }

    for (let i = 0; i < ops.length; i++) {
        if (ops[i] === "*" || ops[i] === "/" || ops[i] === "%") {
            const a = numbers[i];
            const b = numbers[i + 1];

            if ((ops[i] === "/" || ops[i] === "%") && b === 0) return NaN;

            numbers[i] =
                ops[i] === "*" ? a * b :
                ops[i] === "/" ? a / b :
                a % b;

            numbers.splice(i + 1, 1);
            ops.splice(i, 1);
            i--;
        }
    }

    let result = numbers[0];
    for (let i = 0; i < ops.length; i++) {
        result = ops[i] === "+" ? result + numbers[i + 1] : result - numbers[i + 1];
    }

    return result;
}


function render() {
    display.value = expression;
}

function showError() {
    expression = "";
    showingResult = false;
    display.value = "Error";
}


function pressEquals() {
    if (expression === "" || isOperator(lastChar())) return;

    const result = calculate(expression);

    if (!Number.isFinite(result)) {
        showError();
        return;
    }

    expression = String(parseFloat(result.toPrecision(12)));
    showingResult = true;
    render();
}

function pressOperator(op) {
    if (expression === "") {
        if (op === "-") expression = "-";
        render();
        return;
    }

    if (expression === "-") return;

    if (isOperator(lastChar())) {
        
        if (op === "-" && "*/%".includes(lastChar())) {
            expression += op;
        } else {
            while (isOperator(lastChar())) expression = expression.slice(0, -1);
            if (expression === "") return;
            expression += op;
        }
    } else {
        expression += op;
    }

    showingResult = false;
    render();
}

function pressNumber(val) {
    if (showingResult) {
        expression = "";
        showingResult = false;
    }

    if (val === ".") {
        const currentNumber = expression.split(/[+\-*/%]/).pop();
        if (currentNumber.includes(".")) return;
        if (currentNumber === "") val = "0.";
    }

    expression += val;
    render();
}

function handleInput(val) {
    if (val === "=") return pressEquals();

    if (val === "AC") {
        expression = "";
        showingResult = false;
        return render();
    }

    if (val === "DEL") {
        expression = expression.slice(0, -1);
        showingResult = false;
        return render();
    }

    if (isOperator(val)) return pressOperator(val);

    pressNumber(val);
}


calculator.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    handleInput(button.innerText.trim());
});


document.addEventListener("keydown", (e) => {
    if (/^[0-9.]$/.test(e.key) || isOperator(e.key)) {
        handleInput(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleInput("=");
    } else if (e.key === "Backspace") {
        handleInput("DEL");
    } else if (e.key === "Escape") {
        handleInput("AC");
    }
});
