document.getElementById("calculateButton").addEventListener("click", function() {
    const earnedIncome = parseFloat(document.getElementById("earnedIncome").value);
    const vaIncome1 = parseFloat(document.getElementById("vaIncome1").value);
    const vaIncome2 = parseFloat(document.getElementById("vaIncome2").value);
    const otherExpenses = parseFloat(document.getElementById("otherExpenses").value);
    const savingsAmount = parseFloat(document.getElementById("savingsAmount").value);
    const homePrice = parseFloat(document.getElementById("homePrice").value);
    const downPaymentText = document.getElementById("downPayment").value;
    const isPercentage = document.getElementById("downPaymentPercentage").checked;
    const interestRate = parseFloat(document.getElementById("interestRate").value);
    const loanTerm = parseInt(document.getElementById("loanTerm").value);

    // Calculation logic
    const downPayment = calculateDownPayment(homePrice, downPaymentText, isPercentage);
    const monthlyMortgagePayment = calculateMonthlyMortgagePayment(homePrice, downPayment, interestRate, loanTerm);
    const monthlyPropertyTax = calculateMonthlyPropertyTax(homePrice);
    const monthlyHomeInsurance = calculateMonthlyHomeInsurance(homePrice);
    const totalMonthlyHousingExpenses = monthlyMortgagePayment + monthlyPropertyTax + monthlyHomeInsurance;
    const totalMonthlyExpenses = calculateTotalMonthlyExpenses(totalMonthlyHousingExpenses, otherExpenses);
    const emergencyFund = calculateEmergencyFund(totalMonthlyExpenses, vaIncome1, vaIncome2);
    const cashLeftOver = savingsAmount - emergencyFund - downPayment;
    const grossMonthlyIncome = calculateGrossMonthlyIncome(earnedIncome, vaIncome1, vaIncome2, cashLeftOver);
    const netMonthlyIncome = calculateNetMonthlyIncome(earnedIncome, vaIncome1, vaIncome2, cashLeftOver);

    // Update the results on the page
    updateResult("monthlyMortgagePaymentResult", monthlyMortgagePayment);
    updateResult("monthlyPropertyTaxResult", monthlyPropertyTax);
    updateResult("monthlyHomeInsuranceResult", monthlyHomeInsurance);
    updateResult("totalMonthlyHousingExpensesResult", totalMonthlyHousingExpenses);
    updateResult("totalMonthlyExpensesResult", totalMonthlyExpenses, netMonthlyIncome);
    updateResult("emergencyFundResult", emergencyFund);
    updateResult("cashLeftOverResult", cashLeftOver);
    updateResult("grossMonthlyIncomeResult", grossMonthlyIncome);
    updateResult("netMonthlyIncomeResult", netMonthlyIncome);
});

function calculateDownPayment(homePrice, downPaymentText, isPercentage) {
    if (isPercentage) {
        return (parseFloat(downPaymentText.replace("%", "").trim()) / 100) * homePrice;
    } else {
        return parseFloat(downPaymentText.replace("$", "").trim());
    }
}

function calculateMonthlyMortgagePayment(homePrice, downPayment, annualInterestRate, loanTermYears) {
    const loanAmount = homePrice - downPayment;
    const loanTermMonths = loanTermYears * 12;
    const monthlyInterestRate = annualInterestRate / 12;
    return loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths))
        / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
}

function calculateMonthlyPropertyTax(homePrice) {
    const propertyTaxRate = 0.94 / 100;
    return (homePrice * propertyTaxRate) / 12;
}

function calculateMonthlyHomeInsurance(homePrice) {
    const annualHomeInsuranceRate = 0.33 / 100;
    return (homePrice * annualHomeInsuranceRate) / 12;
}

function calculateTotalMonthlyExpenses(monthlyHousingExpenses, otherMonthlyExpenses) {
    return monthlyHousingExpenses + otherMonthlyExpenses;
}

function calculateEmergencyFund(totalMonthlyExpenses, vaIncome1, vaIncome2) {
    return (totalMonthlyExpenses - vaIncome1 - vaIncome2) * 6;
}

function calculateGrossMonthlyIncome(earnedAnnualIncome, vaIncomeField1, vaIncomeField2, cashLeftOver) {
    if (cashLeftOver < 0) {
        cashLeftOver = 0;
    }
    const hysaInterestPayment = (cashLeftOver * (4.6 / 100)) / 12;
    return (earnedAnnualIncome / 12) + vaIncomeField1 + vaIncomeField2 + hysaInterestPayment;
}

function calculateNetMonthlyIncome(earnedAnnualIncome, vaIncomeField1, vaIncomeField2, cashLeftOver) {
    if (cashLeftOver < 0) {
        cashLeftOver = 0;
    }
    const hysaInterestPayment = (cashLeftOver * (4.6 / 100)) / 12;
    return ((earnedAnnualIncome * 0.67313) / 12) + vaIncomeField1 + vaIncomeField2 + hysaInterestPayment;
}

function updateResult(elementId, value, netMonthlyIncome = null) {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const element = document.getElementById(elementId);

    element.textContent = `${element.textContent.split(':')[0]}: ${formatter.format(value)}`;

    if (netMonthlyIncome !== null && elementId === "totalMonthlyExpensesResult") {
        element.style.color = value > netMonthlyIncome ? "red" : "green";
    } else if (elementId === "cashLeftOverResult") {
        element.style.color = value < 0 ? "red" : "green";
    } else if (elementId === "totalMonthlyExpensesResult" && value > netMonthlyIncome) {
        element.style.color = "red";
    } else {
        element.style.color = "black";
    }
}
