function calculateAffordability() {
  const income = parseFloat(document.getElementById('income').value);
  const debt = parseFloat(document.getElementById('debt').value);
  const downPercent = parseFloat(document.getElementById('downPayment').value);
  const interestRateInput = parseFloat(document.getElementById('interestRate').value);

  const errorBox = document.getElementById('error');
  errorBox.textContent = '';

  if (isNaN(income) || isNaN(debt) || isNaN(downPercent) || isNaN(interestRateInput)) {
    errorBox.textContent = 'Please fill in all fields with valid numbers.';
    return;
  }

  const rate = interestRateInput / 100 / 12;
  const qualifyRate = Math.max(interestRateInput + 2, 5.25) / 100 / 12;

  const gdsLimit = 0.39;
  const tdsLimit = 0.44;
  const amortization = 25 * 12;

  const maxGDS = income * gdsLimit;
  const maxTDS = (income - debt) * tdsLimit;
  const payment = Math.min(maxGDS, maxTDS);

  const mortgage = payment * ((1 - Math.pow(1 + qualifyRate, -amortization)) / qualifyRate);

  let downPayment = 0;
  if (downPercent === 5) {
    if (mortgage <= 500000) {
      downPayment = mortgage * 0.05;
    } else {
      downPayment = 500000 * 0.05 + (mortgage - 500000) * 0.10;
    }
  } else {
    downPayment = mortgage * (downPercent / 100);
  }

  const purchasePrice = mortgage + downPayment;
  let insurance = 0;

  if (downPercent < 20) {
    const ltv = mortgage / purchasePrice;
    let premiumRate = 0.04;
    if (ltv <= 0.95 && ltv > 0.90) premiumRate = 0.031;
    else if (ltv <= 0.90 && ltv > 0.85) premiumRate = 0.028;
    else if (ltv <= 0.85) premiumRate = 0.024;
    insurance = mortgage * premiumRate;
  }

  const totalMortgage = mortgage + insurance;

  const formatCurrency = val =>
    val.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });

  document.getElementById('resultPayment').value = formatCurrency(payment);
  document.getElementById('resultPrice').value = formatCurrency(purchasePrice);
  document.getElementById('resultDown').value = formatCurrency(downPayment);
  document.getElementById('resultInsurance').value = formatCurrency(insurance);
  document.getElementById('resultTotalMortgage').value = formatCurrency(totalMortgage);
}
