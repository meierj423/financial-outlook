function calculate() {
    // Get input values or set defaults
    const earnedIncome = parseFloat(document.getElementById("grossAnnualIncome").value) || 0;
    const vaIncome1 = parseFloat(document.getElementById("vaIncome1").value) || 0;
    const vaIncome2 = parseFloat(document.getElementById("vaIncome2").value) || 0;
    const otherExpenses = parseFloat(document.getElementById("otherExpenses").value) || 0;
    const savings = parseFloat(document.getElementById("savings").value) || 0;
    const homePrice = parseFloat(document.getElementById("homePrice").value) || 0;
    const downPaymentText = document.getElementById("downPayment").value;
    const interestRate = (parseFloat(document.getElementById("interestRate").value) || 0) / 100;
    const loanTermYears = parseInt(document.getElementById("loanTerm").value) || 0;

    const isPercentage = document.querySelector('input[name="dpType"]:checked').value === "percentage";

    // Calculate down payment
    const downPayment = isPercentage
        ? (parseFloat(downPaymentText.replace("%", "").trim()) / 100) * homePrice
        : parseFloat(downPaymentText.replace("$", "").trim());

    // Calculate loan amount
    const loanAmount = homePrice - downPayment;

    // Calculate closing costs (3% of loan amount)
    const closingCosts = loanAmount * 0.03;

    // Calculate monthly mortgage payment
    const loanTermMonths = loanTermYears * 12;
    const monthlyInterestRate = interestRate / 12;
    const monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths))
        / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

    // Calculate monthly property tax and home insurance
    const monthlyPropertyTax = (homePrice * 0.0094) / 12;
    const monthlyHomeInsurance = (homePrice * 0.0033) / 12;

    // Calculate total monthly housing expenses
    const totalMonthlyHousingExpenses = monthlyMortgagePayment + monthlyPropertyTax + monthlyHomeInsurance;

    // Calculate emergency fund needed (6 months of expenses)
    const totalMonthlyExpenses = totalMonthlyHousingExpenses + otherExpenses;
    const emergencyFundNeeded = (totalMonthlyExpenses - vaIncome1 - vaIncome2) * 6;

    // Calculate cash left over
    const cashLeftOver = savings - downPayment - emergencyFundNeeded - closingCosts;

    // Calculate gross and net monthly income
    const hysaInterestPayment = cashLeftOver > 0 ? (cashLeftOver * 0.046) / 12 : 0;
    const grossMonthlyIncome = (earnedIncome / 12) + vaIncome1 + vaIncome2 + hysaInterestPayment;
    const netMonthlyIncome = ((earnedIncome * 0.67313) / 12) + vaIncome1 + vaIncome2 + hysaInterestPayment;

    // Calculate housing-to-income ratio
    const housingToIncomeRatio = totalMonthlyHousingExpenses / grossMonthlyIncome;

    // Calculate monthly surplus
    const monthlySurplus = netMonthlyIncome - totalMonthlyExpenses;

    // Format and update results on the page
    const formatCurrency = (value) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });

    updateResult("grossIncome", `Gross Monthly Income: ${formatCurrency(grossMonthlyIncome)}`);
    updateResult("netIncome", `Net Monthly Income: ${formatCurrency(netMonthlyIncome)}`);
    updateResult("emergencyFund", `Emergency Fund Needed: ${formatCurrency(emergencyFundNeeded)}`);
    updateResult("downPaymentResult", `Down Payment: ${formatCurrency(downPayment)}`, downPayment > savings ? "red" : "green");
    updateResult("closingCosts", `Closing Costs: ${formatCurrency(closingCosts)}`);
    updateResult("cashLeftOver", `Cash Left Over: ${formatCurrency(cashLeftOver)}`, cashLeftOver < 0 ? "red" : "green");
    updateResult("monthlyMortgagePayment", `Monthly Mortgage Payment: ${formatCurrency(monthlyMortgagePayment)}`);
    updateResult("monthlyPropertyTax", `Monthly Property Tax: ${formatCurrency(monthlyPropertyTax)}`);
    updateResult("monthlyHomeInsurance", `Monthly Home Insurance: ${formatCurrency(monthlyHomeInsurance)}`);
    updateResult("totalMonthlyHousingExpenses", `Total Monthly Housing Expenses: ${formatCurrency(totalMonthlyHousingExpenses)}`);

    // Update housing-to-income ratio with color coding
    let ratioColor = housingToIncomeRatio <= 0.28 ? "green" : housingToIncomeRatio <= 0.36 ? "orange" : "red";
    updateResult("housingToIncomeRatio", `Housing-to-Income Ratio: ${housingToIncomeRatio.toFixed(2)}`, ratioColor);

    updateResult("totalMonthlyExpenses", `Total Monthly Expenses: ${formatCurrency(totalMonthlyExpenses)}`);

    // Update monthly surplus with color coding
    let surplusColor = monthlySurplus < 2000 ? "red" : monthlySurplus < 3000 ? "orange" : "green";
    updateResult("monthlySurplus", `Monthly Surplus: ${formatCurrency(monthlySurplus)}`, surplusColor);
}

function updateResult(elementId, text, color) {
    const element = document.getElementById(elementId);
    element.innerHTML = text;
    if (color) {
        element.style.color = color;
    }
}

// Attach event listeners to inputs for real-time calculations
document.querySelectorAll('#mortgage-form input').forEach(input => {
    input.addEventListener('input', calculate);
});

document.querySelectorAll('input[name="dpType"]').forEach(radio => {
    radio.addEventListener('change', calculate);
});

document.getElementById("calculateBtn").addEventListener("click", function() {
    calculate();

    // Gather data for URL parameters
    const homePrice = parseFloat(document.getElementById("homePrice").value) || 0;
    const downPaymentText = document.getElementById("downPayment").value;
    const isPercentage = document.querySelector('input[name="dpType"]:checked').value === "percentage";

    const downPayment = isPercentage
        ? (parseFloat(downPaymentText.replace("%", "").trim()) / 100) * homePrice
        : parseFloat(downPaymentText.replace("$", "").trim());

    const loanAmount = homePrice - downPayment;
    const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
    const loanTermYears = parseInt(document.getElementById("loanTerm").value) || 0;
    const loanTermMonths = loanTermYears * 12;

    // Create URL parameters and redirect to amortization page
    const params = new URLSearchParams({
        loanAmount: loanAmount.toFixed(2),
        interestRate: interestRate.toFixed(2),
        loanTermMonths: loanTermMonths
    });

    window.location.href = `amortization.html?${params.toString()}`;
});

// Function to save form data to localStorage
function saveFormData() {
    const loanAmount = document.getElementById("loanAmount").value;
    const interestRate = document.getElementById("interestRate").value;
    const loanTerm = document.getElementById("loanTerm").value;

    localStorage.setItem('loanAmount', loanAmount);
    localStorage.setItem('interestRate', interestRate);
    localStorage.setItem('loanTerm', loanTerm);
}

// Event listener to save data on form change
document.querySelectorAll('#loanAmount, #interestRate, #loanTerm').forEach(input => {
    input.addEventListener('input', saveFormData);
});

// Function to load form data from localStorage
function loadFormData() {
    const loanAmount = localStorage.getItem('loanAmount');
    const interestRate = localStorage.getItem('interestRate');
    const loanTerm = localStorage.getItem('loanTerm');

    if (loanAmount) document.getElementById("loanAmount").value = loanAmount;
    if (interestRate) document.getElementById("interestRate").value = interestRate;
    if (loanTerm) document.getElementById("loanTerm").value = loanTerm;
}

// Load form data when the page loads
window.addEventListener('load', loadFormData);
