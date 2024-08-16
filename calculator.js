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

    // Update results on the page with conditional formatting
    updateResult("grossIncome", `Gross Monthly Income: $${grossMonthlyIncome.toFixed(2)}`);
    updateResult("netIncome", `Net Monthly Income: $${netMonthlyIncome.toFixed(2)}`);
    updateResult("emergencyFund", `Emergency Fund Needed: $${emergencyFundNeeded.toFixed(2)}`);
    updateResult("downPaymentResult", `Down Payment: $${downPayment.toFixed(2)}`, downPayment > savings ? "red" : "green");
    updateResult("closingCosts", `Closing Costs: $${closingCosts.toFixed(2)}`);
    updateResult("cashLeftOver", `Cash Left Over: $${cashLeftOver.toFixed(2)}`, cashLeftOver < 0 ? "red" : "green");
    updateResult("monthlyMortgagePayment", `Monthly Mortgage Payment: $${monthlyMortgagePayment.toFixed(2)}`);
    updateResult("monthlyPropertyTax", `Monthly Property Tax: $${monthlyPropertyTax.toFixed(2)}`);
    updateResult("monthlyHomeInsurance", `Monthly Home Insurance: $${monthlyHomeInsurance.toFixed(2)}`);
    updateResult("totalMonthlyHousingExpenses", `Total Monthly Housing Expenses: $${totalMonthlyHousingExpenses.toFixed(2)}`);

    // Housing-to-Income Ratio: Green < 0.28, Orange 0.28-0.36, Red > 0.36
    let ratioColor = housingToIncomeRatio < 0.28 ? "green" : housingToIncomeRatio <= 0.36 ? "orange" : "red";
    updateResult("housingToIncomeRatio", `Housing-to-Income Ratio: ${housingToIncomeRatio.toFixed(2)}`, ratioColor);

    updateResult("totalMonthlyExpenses", `Total Monthly Expenses: $${totalMonthlyExpenses.toFixed(2)}`);

    // Monthly Surplus: Red < 2000, Orange 2000-3000, Green > 3000
    let surplusColor = monthlySurplus < 2000 ? "red" : monthlySurplus <= 3000 ? "orange" : "green";
    updateResult("monthlySurplus", `Monthly Surplus: $${monthlySurplus.toFixed(2)}`, surplusColor);
}

function updateResult(elementId, text, color) {
    const element = document.getElementById(elementId);
    element.innerHTML = text;
    if (color) {
        element.style.color = color;
    }
}

// Attach event listener
document.getElementById("calculateBtn").addEventListener("click", calculate);
