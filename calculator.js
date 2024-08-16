function calculate() {
    const homePrice = parseFloat(document.getElementById('homePrice').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const income = parseFloat(document.getElementById('income').value);

    if (isNaN(homePrice) || isNaN(downPayment) || isNaN(interestRate) || isNaN(loanTerm) || isNaN(savings) || isNaN(income)) {
        alert("Please enter valid numbers.");
        return;
    }

    const loanAmount = homePrice - downPayment;
    const monthlyInterestRate = interestRate / 12;
    const loanTermMonths = loanTerm * 12;
    const monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

    const monthlyPropertyTax = homePrice * 0.0094 / 12;
    const monthlyHomeInsurance = homePrice * 0.0033 / 12;
    const totalMonthlyHousingExpenses = monthlyMortgagePayment + monthlyPropertyTax + monthlyHomeInsurance;

    const housingToIncomeRatio = totalMonthlyHousingExpenses / income;
    const cashLeftOver = savings - downPayment;
    const monthlySurplus = income - totalMonthlyHousingExpenses;

    const results = document.getElementById('results');
    results.innerHTML = '';

    const downPaymentResult = createResultElement(`Down Payment: $${downPayment.toFixed(2)}`, downPayment > savings ? 'red' : 'green');
    const cashLeftOverResult = createResultElement(`Cash Left Over: $${cashLeftOver.toFixed(2)}`, cashLeftOver < 0 ? 'red' : 'green');
    const monthlySurplusResult = createResultElement(`Monthly Surplus: $${monthlySurplus.toFixed(2)}`, monthlySurplus < 2000 ? 'red' : monthlySurplus < 3000 ? 'orange' : 'green');
    const housingToIncomeRatioResult = createResultElement(`Housing-To-Income Ratio: ${housingToIncomeRatio.toFixed(2)}`, housingToIncomeRatio <= 0.28 ? 'green' : 'red');

    results.appendChild(downPaymentResult);
    results.appendChild(cashLeftOverResult);
    results.appendChild(monthlySurplusResult);
    results.appendChild(housingToIncomeRatioResult);
}

function createResultElement(text, colorClass) {
    const resultElement = document.createElement('div');
    resultElement.className = `result ${colorClass}`;
    resultElement.textContent = text;
    return resultElement;
}
