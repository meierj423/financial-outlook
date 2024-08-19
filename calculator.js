function calculate() {
    const earnedIncome = parseFloat(document.getElementById("grossAnnualIncome").value) || 0;
    const vaIncome1 = parseFloat(document.getElementById("vaIncome1").value) || 0;
    const vaIncome2 = parseFloat(document.getElementById("vaIncome2").value) || 0;
    const otherExpenses = parseFloat(document.getElementById("otherExpenses").value) || 0;
    const savings = parseFloat(document.getElementById("savings").value) || 0;
    const homePrice = parseFloat(document.getElementById("homePrice").value) || 0;
    const downPaymentText = document.getElementById("downPayment").value;
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 100 || 0;
    const loanTermYears = parseInt(document.getElementById("loanTerm").value) || 0;

    const isPercentage = document.querySelector('input[name="dpType"]:checked').value === "percentage";

    // Calculate Down Payment
    const downPayment = isPercentage ? (parseFloat(downPaymentText.replace("%", "").trim()) / 100) * homePrice
        : parseFloat(downPaymentText.replace("$", "").trim());

    // Calculate Loan Amount
    const loanAmount = homePrice - downPayment;

    // Calculate Closing Costs (3% of the loan amount)
    const closingCosts = loanAmount * 0.03;

    // Calculate Monthly Mortgage Payment
    const loanTermMonths = loanTermYears * 12;
    const monthlyInterestRate = interestRate / 12;
    const monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths))
        / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

    // Calculate Monthly Property Tax and Home Insurance
    const monthlyPropertyTax = (homePrice * (0.94 / 100)) / 12;
    const monthlyHomeInsurance = (homePrice * (0.33 / 100)) / 12;

    // Calculate Total Monthly Housing Expenses
    const totalMonthlyHousingExpenses = monthlyMortgagePayment + monthlyPropertyTax + monthlyHomeInsurance;

    // Calculate Emergency Fund Needed
    const totalMonthlyExpenses = totalMonthlyHousingExpenses + otherExpenses;
    const emergencyFundNeeded = (totalMonthlyExpenses - vaIncome1 - vaIncome2) * 6;

    // Calculate Cash Left Over
    const cashLeftOver = savings - downPayment - emergencyFundNeeded - closingCosts;

    // Calculate Gross Monthly Income
    const hysaInterestPayment = (cashLeftOver > 0 ? (cashLeftOver * (4.6 / 100)) / 12 : 0);
    const grossMonthlyIncome = (earnedIncome / 12) + vaIncome1 + vaIncome2 + hysaInterestPayment;

    // Calculate Net Monthly Income
    const netMonthlyIncome = ((earnedIncome * 0.67313) / 12) + vaIncome1 + vaIncome2 + hysaInterestPayment;

    // Calculate Housing-to-Income Ratio
    const housingToIncomeRatio = totalMonthlyHousingExpenses / grossMonthlyIncome;

    // Calculate Monthly Surplus
    const monthlySurplus = netMonthlyIncome - totalMonthlyExpenses;

    // Format numbers with commas
    const formatCurrency = (value) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });

    // Update results on the page with conditional formatting
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

    // Housing-to-Income Ratio: Green <= 0.28, Orange 0.29-0.36, Red > 0.36
    let ratioColor = housingToIncomeRatio <= 0.28 ? "green" : housingToIncomeRatio <= 0.36 ? "orange" : "red";
    updateResult("housingToIncomeRatio", `Housing-to-Income Ratio: ${housingToIncomeRatio.toFixed(2)}`, ratioColor);

    updateResult("totalMonthlyExpenses", `Total Monthly Expenses: ${formatCurrency(totalMonthlyExpenses)}`);

    // Monthly Surplus: Red < 2000, Orange 2000-2999, Green >= 3000
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

// Attach event listeners to all inputs
document.querySelectorAll('#mortgage-form input').forEach(input => {
    input.addEventListener('input', calculate);
});

document.querySelectorAll('input[name="dpType"]').forEach(radio => {
    radio.addEventListener('change', calculate);
});
