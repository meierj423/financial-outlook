// Function to retrieve URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        loanAmount: parseFloat(params.get('loanAmount')) || 0,
        interestRate: parseFloat(params.get('interestRate')) || 0,
        loanTermMonths: parseInt(params.get('loanTermMonths')) || 0
    };
}

// Function to calculate amortization
function calculateAmortization() {
    const { loanAmount, interestRate, loanTermMonths } = getUrlParams();

    // Get input values for amortization calculations
    const loanBeginDate = new Date(document.getElementById("loanBeginDate").value);
    const additionalMonthlyPayment = parseFloat(document.getElementById("additionalMonthlyPayment").value) || 0;
    const additionalYearlyPayment = parseFloat(document.getElementById("additionalYearlyPayment").value) || 0;

    // Calculate total number of months
    const totalMonths = loanTermMonths;
    const monthlyInterestRate = interestRate / 100 / 12;
    let balance = loanAmount;
    let totalInterestPaid = 0;
    let totalCostOfLoan = 0;
    let payments = [];
    let payoffDate;

    // Amortization calculations
    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = balance * monthlyInterestRate;
        const principalPayment = (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) /
            (Math.pow(1 + monthlyInterestRate, totalMonths) - 1) - interestPayment;

        balance -= (principalPayment + additionalMonthlyPayment);
        totalInterestPaid += interestPayment;
        totalCostOfLoan += (principalPayment + interestPayment + additionalMonthlyPayment);

        // Add yearly payment
        if (month % 12 === 0) {
            balance -= additionalYearlyPayment;
            totalCostOfLoan += additionalYearlyPayment;
        }

        // Record payment details for each month
        payments.push({
            month: month,
            principalPaid: loanAmount - balance,
            interestPaid: totalInterestPaid,
            remainingBalance: balance
        });

        // Check if the loan is paid off
        if (balance <= 0) {
            payoffDate = new Date(loanBeginDate);
            payoffDate.setMonth(payoffDate.getMonth() + month);
            break;
        }
    }

    // Update results
    document.getElementById("loanAmountResult").textContent = `Loan Amount: $${loanAmount.toFixed(2)}`;
    document.getElementById("totalInterestPaid").textContent = `Total Interest Paid: $${totalInterestPaid.toFixed(2)}`;
    document.getElementById("totalCostOfLoan").textContent = `Total Cost of Loan: $${totalCostOfLoan.toFixed(2)}`;
    document.getElementById("payoffDate").textContent = `Payoff Date: ${payoffDate ? payoffDate.toLocaleDateString() : "N/A"}`;

    // Render amortization chart
    renderAmortizationChart(payments);
}

// Function to render the amortization chart
function renderAmortizationChart(payments) {
    const ctx = document.getElementById('amortizationChart').getContext('2d');
    const labels = payments.map(payment => `Month ${payment.month}`);
    const principalData = payments.map(payment => payment.principalPaid);
    const interestData = payments.map(payment => payment.interestPaid);
    const balanceData = payments.map(payment => payment.remainingBalance);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Principal Paid',
                    data: principalData,
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: 'Interest Paid',
                    data: interestData,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'Remaining Balance',
                    data: balanceData,
                    borderColor: 'red',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: '$'
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `$${tooltipItem.formattedValue}`;
                        }
                    }
                }
            }
        }
    });
}

// Attach event listener to calculate amortization when inputs change
document.querySelectorAll('#loanBeginDate, #loanEndDate, #additionalMonthlyPayment, #additionalYearlyPayment').forEach(input => {
    input.addEventListener('input', calculateAmortization);
});

// Initial calculation when the page loads
window.addEventListener('load', calculateAmortization);

// Optional: If you have an "Amortize" button, add an event listener
document.getElementById("amortizeBtn").addEventListener("click", calculateAmortization);

document.getElementById("backBtn").addEventListener("click", function() {
    // Redirect to the initial page (index.html)
    window.location.href = 'index.html';
});