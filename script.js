// JavaScript for the Calculator Collection

// --- Factorial Function ---
window.factorial = function(n) {
    if (n < 0) return NaN; // Factorial is not defined for negative numbers
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = n; i > 1; i--) {
        result *= i;
    }
    return result;
};

// Helper function to check if a decimal can be appended
function canAppendDecimal(currentValue) {
    const segments = currentValue.split(/(\+|-|\*|\/|\(|\*\*)/);
    const lastSegment = segments.pop();
    if (lastSegment && lastSegment.includes('.')) {
        return false;
    }
    return true;
}


document.addEventListener('DOMContentLoaded', () => {
    let activeCalculatorId = 'simpleCalculator'; // Default active calculator

    // --- Simple Calculator Elements ---
    const simpleDisplay = document.getElementById('simpleDisplay');
    const simpleClearBtn = document.getElementById('simpleClear');
    const simpleEqualsBtn = document.getElementById('simpleEquals');
    const simpleNumberBtns = document.querySelectorAll('#simpleCalculator .number');
    const simpleOperatorBtns = document.querySelectorAll('#simpleCalculator .operator');

    // --- Simple Calculator Logic ---
    if (simpleDisplay) {
        simpleNumberBtns.forEach(button => {
            button.addEventListener('click', () => {
                const buttonText = button.textContent;
                if (buttonText === '.') {
                    if (canAppendDecimal(simpleDisplay.value)) {
                        simpleDisplay.value += buttonText;
                    }
                } else {
                    simpleDisplay.value += buttonText;
                }
            });
        });
        simpleOperatorBtns.forEach(button => {
            button.addEventListener('click', () => {
                simpleDisplay.value += button.textContent;
            });
        });
        if (simpleClearBtn) {
            simpleClearBtn.addEventListener('click', () => {
                simpleDisplay.value = '';
            });
        }
        if (simpleEqualsBtn) {
            simpleEqualsBtn.addEventListener('click', () => {
                try {
                    const result = eval(simpleDisplay.value);
                    if (result === Infinity || result === -Infinity || isNaN(result)) {
                        simpleDisplay.value = 'Error';
                    } else {
                        simpleDisplay.value = result;
                    }
                } catch (error) {
                    simpleDisplay.value = 'Error';
                }
            });
        }
    }

    // --- Scientific Calculator Elements ---
    const scientificDisplay = document.getElementById('scientificDisplay');
    const scientificBtns = document.querySelectorAll('#scientificCalculator .sci-calc-btn');

    // --- Scientific Calculator Logic ---
    if (scientificDisplay) {
        scientificBtns.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.dataset.value;
                const func = button.dataset.func;
                const text = button.textContent;

                if (button.id === 'scientificClear') {
                    scientificDisplay.value = '';
                } else if (button.id === 'scientificEquals') {
                    try {
                        let currentExpression = scientificDisplay.value;
                        
                        // Pre-process N! to factorial(N)
                        const factorialRegex = /(\d+)!/g;
                        currentExpression = currentExpression.replace(factorialRegex, 'factorial($1)');
                        
                        const result = eval(currentExpression);
                        if (result === Infinity || result === -Infinity || isNaN(result)) {
                            scientificDisplay.value = 'Error';
                        } else {
                            scientificDisplay.value = result;
                        }
                    } catch (error) {
                        scientificDisplay.value = 'Error (' + error.message + ')';
                    }
                } else if (func) {
                    scientificDisplay.value += func;
                } else if (value) {
                    scientificDisplay.value += value;
                } else if (button.classList.contains('number') || text === '.') {
                    if (text === '.') {
                        if (canAppendDecimal(scientificDisplay.value)) {
                            scientificDisplay.value += text;
                        }
                    } else {
                        scientificDisplay.value += text;
                    }
                } else if (button.classList.contains('factorial')) {
                     scientificDisplay.value += 'factorial(';
                }
            });
        });
    }

    // --- Tax Calculator Elements ---
    const countrySelect = document.getElementById('countrySelect');
    const incomeInput = document.getElementById('incomeInput');
    const calculateTaxButton = document.getElementById('calculateTaxButton');
    const taxResult = document.getElementById('taxResult');

    const taxRules = {
        USA: { currency: "USD", brackets: [{ threshold: 0, rate: 0.10 }, { threshold: 10000, rate: 0.12 }, { threshold: 40000, rate: 0.22 }, { threshold: 85000, rate: 0.24 }], calculate: function(income) { let applicableRate = 0; for (const bracket of this.brackets.sort((a,b) => b.threshold - a.threshold)) { if (income >= bracket.threshold) { applicableRate = bracket.rate; break; } } let tax = income * applicableRate; return { tax, description: `Tax in ${this.currency}: ${tax.toFixed(2)} (at ${applicableRate*100}% of ${income})`}; } },
        Canada: { currency: "CAD", threshold: 50000, rateBelow: 0.15, rateAbove: 0.25, calculate: function(income) { let tax; let description; if (income <= this.threshold) { tax = income * this.rateBelow; description = `Tax in ${this.currency}: ${tax.toFixed(2)} (at ${this.rateBelow*100}% of ${income})`; } else { tax = (this.threshold * this.rateBelow) + ((income - this.threshold) * this.rateAbove); description = `Tax in ${this.currency}: ${tax.toFixed(2)} (${this.rateBelow*100}% of ${this.threshold} + ${this.rateAbove*100}% of ${income - this.threshold})`; } return { tax, description }; } },
        UK: { currency: "GBP", personalAllowance: 12570, brackets: [ { threshold: 0, rate: 0.20 }, { threshold: 37701, rate: 0.40 }, { threshold: 150000, rate: 0.45 } ], calculate: function(income) { let taxableIncome = Math.max(0, income - this.personalAllowance); let tax = 0; let description = `Income: ${income} ${this.currency}. Personal Allowance: ${this.personalAllowance} ${this.currency}. Taxable Income: ${taxableIncome.toFixed(2)} ${this.currency}.\n`; if (taxableIncome <= 0) { tax = 0; description += `No tax payable.`; } else { let remainingTaxableIncome = taxableIncome; for (let i = 0; i < this.brackets.length; i++) { const bracket = this.brackets[i]; const nextBracketMin = (i + 1 < this.brackets.length) ? this.brackets[i+1].threshold : Infinity; if (remainingTaxableIncome > 0) { const incomeInThisBracket = Math.min(remainingTaxableIncome, nextBracketMin - bracket.threshold); const taxInThisBracket = incomeInThisBracket * bracket.rate; tax += taxInThisBracket; description += `Tax at ${bracket.rate*100}% on ${incomeInThisBracket.toFixed(2)} = ${taxInThisBracket.toFixed(2)} ${this.currency}\n`; remainingTaxableIncome -= incomeInThisBracket; if (remainingTaxableIncome <=0) break; } else break; } } description += `Total Tax: ${tax.toFixed(2)} ${this.currency}`; return { tax, description }; } },
        Germany: { currency: "EUR", rate: 0.30, solidaritySurcharge: 0.055, calculate: function(income) { let taxAmount = income * this.rate; let surcharge = taxAmount * this.solidaritySurcharge; let totalTax = taxAmount + surcharge; let description = `Tax: ${taxAmount.toFixed(2)} ${this.currency}.\nSurcharge: ${surcharge.toFixed(2)}.\nTotal: ${totalTax.toFixed(2)} ${this.currency}`; return { tax: totalTax, description }; } }
    };

    if (calculateTaxButton) {
        calculateTaxButton.addEventListener('click', () => {
            const selectedCountry = countrySelect.value;
            const income = parseFloat(incomeInput.value);
            if (isNaN(income) || income < 0) {
                taxResult.textContent = 'Please enter a valid positive income.';
                return;
            }
            const rule = taxRules[selectedCountry];
            if (!rule) {
                taxResult.textContent = 'Tax rules for selected country are not available.';
                return;
            }
            const result = rule.calculate(income);
            taxResult.innerHTML = result.description.replace(/\n/g, '<br>');
        });
    }

    // --- Unit Converter Elements ---
    const conversionCategory = document.getElementById('conversionCategory');
    const inputValue = document.getElementById('inputValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertButton = document.getElementById('convertButton');
    const conversionResult = document.getElementById('conversionResult');

    const unitDefinitions = {
        Length: { baseUnit: 'meter', units: { meter: 1, kilometer: 1000, mile: 1609.34, foot: 0.3048, inch: 0.0254 }, },
        Weight: { baseUnit: 'kilogram', units: { kilogram: 1, gram: 0.001, pound: 0.453592, ounce: 0.0283495 }, },
        Temperature: { units: ["Celsius", "Fahrenheit", "Kelvin"], convert: function(value, from, to) { if (from === to) return value; if (from === "Celsius") { if (to === "Fahrenheit") return (value * 9/5) + 32; if (to === "Kelvin") return value + 273.15; } else if (from === "Fahrenheit") { if (to === "Celsius") return (value - 32) * 5/9; if (to === "Kelvin") return ((value - 32) * 5/9) + 273.15; } else if (from === "Kelvin") { if (to === "Celsius") return value - 273.15; if (to === "Fahrenheit") return ((value - 273.15) * 9/5) + 32; } return NaN; } }
    };

    function populateUnitSelects(categoryKey) {
        fromUnit.innerHTML = ''; toUnit.innerHTML = '';
        const category = unitDefinitions[categoryKey];
        if (!category) return;
        let unitsSource = category.units;
        if (Array.isArray(unitsSource)) {
            unitsSource.forEach(unitName => { fromUnit.add(new Option(unitName, unitName)); toUnit.add(new Option(unitName, unitName)); });
        } else {
            Object.keys(unitsSource).forEach(unitName => { fromUnit.add(new Option(unitName, unitName)); toUnit.add(new Option(unitName, unitName)); });
        }
    }
    
    if (conversionCategory) {
        conversionCategory.addEventListener('change', () => populateUnitSelects(conversionCategory.value));
        populateUnitSelects(conversionCategory.value); // Initial population
    }

    if (convertButton) {
        convertButton.addEventListener('click', () => {
            const categoryKey = conversionCategory.value;
            const val = parseFloat(inputValue.value);
            const from = fromUnit.value;
            const to = toUnit.value;
            if (isNaN(val)) { conversionResult.textContent = 'Please enter a valid number for value.'; return; }
            if (!from || !to || !categoryKey) { conversionResult.textContent = 'Please select category and units.'; return; }
            const category = unitDefinitions[categoryKey];
            let resultValue;
            if (categoryKey === "Temperature") { resultValue = category.convert(val, from, to); } 
            else { const valueInBase = val * category.units[from]; resultValue = valueInBase / category.units[to]; }
            if (isNaN(resultValue)) { conversionResult.textContent = 'Conversion failed. Check units.'; } 
            else { conversionResult.textContent = `${val.toFixed(2)} ${from} is ${resultValue.toFixed(2)} ${to}`; }
        });
    }

    // --- Navigation Logic (Final Implementation) ---
    const simpleBtn = document.getElementById('simpleBtn');
    const scientificBtn = document.getElementById('scientificBtn');
    const taxBtn = document.getElementById('taxBtn');
    const unitBtn = document.getElementById('unitBtn');

    const simpleCalculatorDiv = document.getElementById('simpleCalculator');
    const scientificCalculatorDiv = document.getElementById('scientificCalculator');
    const taxCalculatorDiv = document.getElementById('taxCalculator');
    const unitConverterDiv = document.getElementById('unitConverter');

    const calculatorDivs = [simpleCalculatorDiv, scientificCalculatorDiv, taxCalculatorDiv, unitConverterDiv];
    const navButtons = [simpleBtn, scientificBtn, taxBtn, unitBtn];

    function showCalculator(divToShow, buttonToActivate) {
        activeCalculatorId = divToShow ? divToShow.id : null; // Update active calculator ID
        calculatorDivs.forEach(div => {
            if (div) { div.style.display = (div === divToShow) ? 'block' : 'none'; }
        });
        navButtons.forEach(btn => {
            if (btn) { btn.classList.remove('active'); }
        });
        if (buttonToActivate && buttonToActivate.classList) {
            buttonToActivate.classList.add('active');
        }
    }

    if (simpleBtn) simpleBtn.addEventListener('click', () => showCalculator(simpleCalculatorDiv, simpleBtn));
    if (scientificBtn) scientificBtn.addEventListener('click', () => showCalculator(scientificCalculatorDiv, scientificBtn));
    if (taxBtn) taxBtn.addEventListener('click', () => showCalculator(taxCalculatorDiv, taxBtn));
    if (unitBtn) unitBtn.addEventListener('click', () => showCalculator(unitConverterDiv, unitBtn));

    if (simpleCalculatorDiv && simpleBtn) {
       showCalculator(simpleCalculatorDiv, simpleBtn); // Show Simple Calculator by default
    } else if (calculatorDivs.length > 0 && calculatorDivs[0] && navButtons[0]) {
       showCalculator(calculatorDivs[0], navButtons[0]);
    }

    // --- Global Keyboard Input Listener ---
    document.addEventListener('keydown', function(event) {
        const targetElement = event.target;
        const isInputFocused = targetElement.tagName === 'INPUT' || targetElement.tagName === 'SELECT';

        // Handle Enter key in specific input fields
        if (event.key === 'Enter') {
            if (targetElement.id === 'incomeInput' && calculateTaxButton) {
                event.preventDefault();
                calculateTaxButton.click();
                return;
            }
            if (targetElement.id === 'inputValue' && convertButton) {
                event.preventDefault();
                convertButton.click();
                return;
            }
        }

        // If an input field is focused, and it's not Enter, allow default behavior for most keys
        if (isInputFocused && event.key !== 'Escape') { 
            // Allow number/operator input in the fields themselves, but block general calc ops
            // This might need refinement if we want some keys (like Escape) to blur inputs
            if (!['incomeInput', 'inputValue'].includes(targetElement.id)) {
                 // Allow default if it's not one of our main number inputs where Enter is special
                 return;
            }
            if (event.key !== 'Enter') return; // Allow default for number inputs unless it's Enter
        }
        
        let keyToFind = event.key;
        if (event.key === 'Enter' || event.key === '=') keyToFind = '='; // Map Enter to equals button
        if (event.key === 'Escape') keyToFind = 'Escape'; // Map Escape to clear
        // For power, the button has data-key="^"
        if (event.key === '^' && activeCalculatorId === 'scientificCalculator') keyToFind = '^'; 
        // For other keys like 'p' for power or 'f' for factorial, they can be mapped here if desired.

        if (activeCalculatorId === 'simpleCalculator' || activeCalculatorId === 'scientificCalculator') {
            const selector = `#${activeCalculatorId} button[data-key="${keyToFind}"]`;
            const button = document.querySelector(selector);

            if (button) {
                event.preventDefault(); // Prevent default browser action for this key
                button.click();
            }
        }
    });
});
