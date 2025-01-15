document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('result');
    const operationDisplay = document.getElementById('operation-display');
    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;
    let lastResult = null;

    // Format number with commas
    function formatNumber(num) {
        if (num === "Infinity" || num === "-Infinity") return num;
        const parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    // Update both displays
    function updateDisplays() {
        display.value = currentInput ? formatNumber(currentInput) : '0';
        operationDisplay.textContent = previousInput && operation ? 
            `${formatNumber(previousInput)} ${operation}` : '';
    }

    // Handle number input
    function handleNumber(num) {
        if (shouldResetDisplay) {
            currentInput = num;
            shouldResetDisplay = false;
        } else {
            if (currentInput === '0') {
                currentInput = num;
            } else {
                currentInput = currentInput + num;
            }
        }
        updateDisplays();
    }

    // Handle operator input
    function handleOperator(op) {
        if (currentInput === '' && previousInput === '') return;
        
        if (currentInput === '') {
            operation = op;
            updateDisplays();
            return;
        }

        if (previousInput !== '') {
            handleEquals();
        }

        operation = op;
        previousInput = currentInput;
        currentInput = '';
        updateDisplays();
    }

    // Handle equals
    function handleEquals() {
        if (previousInput === '' || currentInput === '') return;

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break;
            default:
                return;
        }

        lastResult = result;
        currentInput = result.toString();
        operation = null;
        previousInput = '';
        shouldResetDisplay = true;
        updateDisplays();
    }

    // Handle special operations
    function handleSpecial(type) {
        if (currentInput === '') return;
        
        switch(type) {
            case '±':
                currentInput = (parseFloat(currentInput) * -1).toString();
                break;
            case '%':
                currentInput = (parseFloat(currentInput) / 100).toString();
                break;
            case 'DEL':
                if (!shouldResetDisplay) {
                    currentInput = currentInput.slice(0, -1);
                    if (currentInput === '') currentInput = '0';
                }
                break;
        }
        updateDisplays();
    }

    // Handle clear
    function handleClear() {
        currentInput = '';
        previousInput = '';
        operation = null;
        lastResult = null;
        updateDisplays();
    }

    // Handle decimal
    function handleDecimal() {
        if (shouldResetDisplay) {
            currentInput = '0.';
            shouldResetDisplay = false;
        } else if (!currentInput.includes('.')) {
            currentInput = currentInput === '' ? '0.' : currentInput + '.';
        }
        updateDisplays();
    }

    // Event delegation for all buttons
    document.querySelector('.buttons').addEventListener('click', (e) => {
        const button = e.target;
        if (!button.matches('button')) return;

        const type = button.dataset.type;
        const value = button.textContent;

        switch(type) {
            case 'number':
                handleNumber(value);
                break;
            case 'operator':
                handleOperator(value);
                break;
            case 'equals':
                handleEquals();
                break;
            case 'clear':
                handleClear();
                break;
            case 'decimal':
                handleDecimal();
                break;
            case 'special':
                handleSpecial(value);
                break;
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key.match(/[0-9]/)) handleNumber(e.key);
        if (e.key === '.') handleDecimal();
        if (e.key === '=' || e.key === 'Enter') handleEquals();
        if (e.key === 'Escape') handleClear();
        if (e.key === '+' || e.key === '-') handleOperator(e.key);
        if (e.key === '*') handleOperator('×');
        if (e.key === '/') {
            e.preventDefault();
            handleOperator('÷');
        }
        if (e.key === 'Backspace') {
            handleSpecial('DEL');
        }
    });
});