(function () {
  const TAX_YEARS = {
    "2024/25": createTaxYearConfig({
      label: "2024/25",
      personalAllowance: 12570,
      personalAllowanceTaperStart: 100000,
      personalAllowanceZero: 125140,
      incomeBands: [
        { name: "Basic", upper: 50270, rate: 0.2 },
        { name: "Higher", upper: 125140, rate: 0.4 },
        { name: "Additional", upper: Infinity, rate: 0.45 }
      ],
      employeeNiThreshold: 12570,
      employeeNiUpper: 50270,
      employeeNiMainRate: 0.08,
      employeeNiUpperRate: 0.02,
      employerNiThreshold: 9100,
      employerNiRate: 0.138,
      dividendAllowance: 500,
      dividendBands: [
        { name: "Basic", rate: 0.0875 },
        { name: "Higher", rate: 0.3375 },
        { name: "Additional", rate: 0.3935 }
      ],
      corpTaxSmallRate: 0.19,
      corpTaxMainRate: 0.25,
      corpTaxLowerThreshold: 50000,
      corpTaxUpperThreshold: 250000,
      pensionAnnualAllowance: 60000,
      evBikRate: 0.02,
      mileageRateFirst: 0.45,
      mileageRateAfter: 0.25
    }),
    "2025/26": createTaxYearConfig({
      label: "2025/26",
      personalAllowance: 12570,
      personalAllowanceTaperStart: 100000,
      personalAllowanceZero: 125140,
      incomeBands: [
        { name: "Basic", upper: 50270, rate: 0.2 },
        { name: "Higher", upper: 125140, rate: 0.4 },
        { name: "Additional", upper: Infinity, rate: 0.45 }
      ],
      employeeNiThreshold: 12570,
      employeeNiUpper: 50270,
      employeeNiMainRate: 0.08,
      employeeNiUpperRate: 0.02,
      employerNiThreshold: 9100,
      employerNiRate: 0.138,
      dividendAllowance: 500,
      dividendBands: [
        { name: "Basic", rate: 0.0875 },
        { name: "Higher", rate: 0.3375 },
        { name: "Additional", rate: 0.3935 }
      ],
      corpTaxSmallRate: 0.19,
      corpTaxMainRate: 0.25,
      corpTaxLowerThreshold: 50000,
      corpTaxUpperThreshold: 250000,
      pensionAnnualAllowance: 60000,
      evBikRate: 0.02,
      mileageRateFirst: 0.45,
      mileageRateAfter: 0.25
    }),
    "2026/27": createTaxYearConfig({
      label: "2026/27",
      personalAllowance: 12570,
      personalAllowanceTaperStart: 100000,
      personalAllowanceZero: 125140,
      incomeBands: [
        { name: "Basic", upper: 50270, rate: 0.2 },
        { name: "Higher", upper: 125140, rate: 0.4 },
        { name: "Additional", upper: Infinity, rate: 0.45 }
      ],
      employeeNiThreshold: 12570,
      employeeNiUpper: 50270,
      employeeNiMainRate: 0.08,
      employeeNiUpperRate: 0.02,
      employerNiThreshold: 9100,
      employerNiRate: 0.138,
      dividendAllowance: 500,
      dividendBands: [
        { name: "Basic", rate: 0.0875 },
        { name: "Higher", rate: 0.3375 },
        { name: "Additional", rate: 0.3935 }
      ],
      corpTaxSmallRate: 0.19,
      corpTaxMainRate: 0.25,
      corpTaxLowerThreshold: 50000,
      corpTaxUpperThreshold: 250000,
      pensionAnnualAllowance: 60000,
      evBikRate: 0.02,
      mileageRateFirst: 0.45,
      mileageRateAfter: 0.25
    })
  };

  const INPUT_SECTIONS = {
    primary: [
      {
        title: "Company",
        fields: [
          rangeField("companyProfit", "Company profit before director payments", 0, 500000, 1000, 120000, "Profit before salary, pension and expenses."),
          rangeField("salary", "Director salary", 0, 200000, 100, 12570, "Gross salary paid to the director."),
          rangeField("dividends", "Dividends", 0, 300000, 100, 40000, "Dividends drawn from post-tax profits.")
        ]
      },
      {
        title: "Pension",
        fields: [
          rangeField("pensionPersonal", "Personal pension contribution", 0, 80000, 100, 0, "Net personal contribution paid from take-home."),
          rangeField("pensionEmployer", "Employer pension contribution", 0, 80000, 100, 0, "Company contribution deductible for corporation tax.")
        ]
      },
      {
        title: "Vehicle",
        fields: [
          rangeField("evListPrice", "EV list price", 0, 120000, 500, 0, "Used to calculate benefit in kind."),
          rangeField("evLeaseCost", "EV annual lease / running cost", 0, 30000, 100, 0, "Company cost for lease or finance."),
          rangeField("evSalarySacrifice", "EV salary sacrifice", 0, 50000, 100, 0, "Reduction in salary exchanged for the EV.")
        ]
      }
    ],
    advanced: [
      {
        title: "Expenses and Other Income",
        fields: [
          rangeField("businessMiles", "Business mileage", 0, 50000, 100, 0, "Mileage reimbursed using a personal vehicle."),
          rangeField("interestIncome", "Interest income", 0, 50000, 100, 0, "Personal savings interest."),
          rangeField("rentalIncome", "Rental / other taxable income", 0, 150000, 100, 0, "Taxable personal income outside salary and dividends."),
          rangeField("otherDeductions", "Business expenses claimed via company", 0, 50000, 100, 0, "Reduces company profits."),
          rangeField("professionalSubscriptions", "Professional subscriptions", 0, 10000, 50, 0, "Deductible company or employment expense."),
          rangeField("giftAid", "Gift aid donations", 0, 25000, 50, 0, "Extends the basic rate band."),
          rangeField("personalAllowanceTransfer", "Marriage allowance transfer received", 0, 1260, 10, 0, "10% of personal allowance from spouse."),
          rangeField("otherIncome", "Other taxable income", 0, 150000, 100, 0, "Catch-all taxable personal income.")
        ]
      }
    ]
  };

  const PRESETS = {
    minSalary: {
      label: "Minimum salary",
      values: { salary: 9100, dividends: 50000, pensionEmployer: 0, pensionPersonal: 0 }
    },
    niThreshold: {
      label: "NI threshold",
      values: { salary: 12570, dividends: 50000, pensionEmployer: 0, pensionPersonal: 0 }
    },
    fiftySalary: {
      label: "£50k salary",
      values: { salary: 50270, dividends: 0, pensionEmployer: 0, pensionPersonal: 0 }
    },
    allDividends: {
      label: "All dividends",
      values: { salary: 0, dividends: 90000, pensionEmployer: 0, pensionPersonal: 0 }
    }
  };

  const DEFAULT_STATE = {
    taxYear: "2025/26",
    comparisonMode: false,
    activeScenario: "A",
    scenarios: {
      A: createDefaultScenario(),
      B: { ...createDefaultScenario(), dividends: 75000, pensionEmployer: 12000 }
    }
  };

  const state = loadState();

  const refs = {
    taxYear: document.getElementById("taxYear"),
    shareScenario: document.getElementById("shareScenario"),
    singleModeButton: document.getElementById("singleModeButton"),
    comparisonModeButton: document.getElementById("comparisonModeButton"),
    singleResults: document.getElementById("singleResults"),
    comparisonResults: document.getElementById("comparisonResults"),
    comparisonResultsA: document.getElementById("comparisonResultsA"),
    comparisonResultsB: document.getElementById("comparisonResultsB"),
    comparisonDelta: document.getElementById("comparisonDelta"),
    presetSelect: document.getElementById("presetSelect"),
    scenarioTabA: document.getElementById("scenarioTabA"),
    scenarioTabB: document.getElementById("scenarioTabB"),
    primaryInputs: document.getElementById("primaryInputs"),
    advancedInputs: document.getElementById("advancedInputs")
  };

  init();

  function init() {
    populateTaxYears();
    populatePresets();
    renderInputSections();
    bindEvents();
    render();
  }

  function populateTaxYears() {
    refs.taxYear.innerHTML = Object.keys(TAX_YEARS)
      .map((year) => `<option value="${year}">${year}</option>`)
      .join("");
    refs.taxYear.value = state.taxYear;
  }

  function populatePresets() {
    refs.presetSelect.innerHTML += Object.entries(PRESETS)
      .map(([key, preset]) => `<option value="${key}">${preset.label}</option>`)
      .join("");
  }

  function renderInputSections() {
    refs.primaryInputs.innerHTML = renderSectionMarkup(INPUT_SECTIONS.primary);
    refs.advancedInputs.innerHTML = renderSectionMarkup(INPUT_SECTIONS.advanced);
    syncInputsFromState();
  }

  function renderSectionMarkup(sections) {
    return sections.map((section) => {
      const fields = section.fields.map(renderFieldMarkup).join("");
      return `
        <section class="section-card">
          <h3>${section.title}</h3>
          <div class="field-grid">${fields}</div>
        </section>
      `;
    }).join("");
  }

  function renderFieldMarkup(field) {
    return `
      <label class="field" for="${field.id}">
        <div class="field-header">
          <span>${field.label}</span>
          <span class="field-note" id="${field.id}Display"></span>
        </div>
        <input
          id="${field.id}"
          name="${field.id}"
          type="number"
          min="${field.min}"
          max="${field.max}"
          step="${field.step}"
          data-field="${field.id}"
        >
        <div class="range-row">
          <input
            id="${field.id}Range"
            type="range"
            min="${field.min}"
            max="${field.max}"
            step="${field.step}"
            data-range="${field.id}"
          >
        </div>
        <p class="field-note">${field.note}</p>
      </label>
    `;
  }

  function bindEvents() {
    document.addEventListener("input", handleInputChange);
    refs.taxYear.addEventListener("change", () => {
      state.taxYear = refs.taxYear.value;
      render();
    });
    refs.shareScenario.addEventListener("click", copyShareableUrl);
    refs.singleModeButton.addEventListener("click", () => setComparisonMode(false));
    refs.comparisonModeButton.addEventListener("click", () => setComparisonMode(true));
    refs.scenarioTabA.addEventListener("click", () => setActiveScenario("A"));
    refs.scenarioTabB.addEventListener("click", () => setActiveScenario("B"));
    refs.presetSelect.addEventListener("change", () => {
      if (!refs.presetSelect.value) return;
      applyPreset(refs.presetSelect.value);
      refs.presetSelect.value = "";
    });
    window.addEventListener("popstate", () => {
      const nextState = loadState();
      Object.assign(state, nextState);
      refs.taxYear.value = state.taxYear;
      syncInputsFromState();
      render();
    });
  }

  function handleInputChange(event) {
    const fieldId = event.target.dataset.field || event.target.dataset.range;
    if (!fieldId) return;
    const numericValue = clampNumber(event.target.value);
    state.scenarios[state.activeScenario][fieldId] = numericValue;
    const numberInput = document.getElementById(fieldId);
    const rangeInput = document.getElementById(`${fieldId}Range`);
    if (numberInput && numberInput !== event.target) numberInput.value = numericValue;
    if (rangeInput && rangeInput !== event.target) rangeInput.value = numericValue;
    updateFieldDisplay(fieldId, numericValue);
    render();
  }

  function applyPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    Object.assign(state.scenarios[state.activeScenario], preset.values);
    syncInputsFromState();
    render();
  }

  function setComparisonMode(enabled) {
    state.comparisonMode = enabled;
    if (enabled) refs.scenarioTabB.classList.remove("hidden");
    render();
  }

  function setActiveScenario(key) {
    state.activeScenario = key;
    syncInputsFromState();
    render();
  }

  function syncInputsFromState() {
    const scenario = state.scenarios[state.activeScenario];
    Object.keys(createDefaultScenario()).forEach((fieldId) => {
      const numberInput = document.getElementById(fieldId);
      const rangeInput = document.getElementById(`${fieldId}Range`);
      if (!numberInput || !rangeInput) return;
      numberInput.value = scenario[fieldId];
      rangeInput.value = scenario[fieldId];
      updateFieldDisplay(fieldId, scenario[fieldId]);
    });
  }

  function updateFieldDisplay(fieldId, value) {
    const display = document.getElementById(`${fieldId}Display`);
    if (!display) return;
    const currencyFields = new Set([
      "companyProfit", "salary", "dividends", "pensionPersonal", "pensionEmployer",
      "evListPrice", "evLeaseCost", "evSalarySacrifice", "interestIncome", "rentalIncome",
      "otherDeductions", "professionalSubscriptions", "giftAid", "otherIncome", "personalAllowanceTransfer"
    ]);
    display.textContent = currencyFields.has(fieldId) ? formatCurrency(value) : formatNumber(value);
  }

  function render() {
    refs.taxYear.value = state.taxYear;
    refs.singleModeButton.classList.toggle("is-active", !state.comparisonMode);
    refs.comparisonModeButton.classList.toggle("is-active", state.comparisonMode);
    refs.scenarioTabA.classList.toggle("is-active", state.activeScenario === "A");
    refs.scenarioTabB.classList.toggle("is-active", state.activeScenario === "B");
    refs.scenarioTabB.classList.toggle("hidden", !state.comparisonMode);
    refs.singleResults.classList.toggle("hidden", state.comparisonMode);
    refs.comparisonResults.classList.toggle("hidden", !state.comparisonMode);

    const scenarioAResult = calculateScenario(state.scenarios.A, TAX_YEARS[state.taxYear]);
    const scenarioBResult = calculateScenario(state.scenarios.B, TAX_YEARS[state.taxYear]);

    refs.singleResults.innerHTML = renderResultMarkup(state.activeScenario, state.activeScenario === "A" ? scenarioAResult : scenarioBResult);
    refs.comparisonResultsA.innerHTML = renderResultMarkup("A", scenarioAResult);
    refs.comparisonResultsB.innerHTML = renderResultMarkup("B", scenarioBResult);
    refs.comparisonDelta.innerHTML = renderComparisonDelta(scenarioAResult, scenarioBResult);

    syncUrl();
  }

  function renderResultMarkup(label, result) {
    const summaryCards = [
      { label: "Net take-home", value: formatCurrency(result.netTakeHome), note: "After income tax, NI, dividend tax and personal pension." },
      { label: "Total tax", value: formatCurrency(result.totalTax), note: "Income tax, dividend tax, employee NI, employer NI and corporation tax." },
      { label: "Effective tax rate", value: formatPercent(result.effectiveTaxRate), note: `Gross income ${formatCurrency(result.grossIncome)}.` },
      { label: "Marginal rate", value: formatPercent(result.marginalRate), note: "Estimated on the next £1 earned." }
    ].map(renderSummaryCard).join("");

    const taxRows = [
      ["Income tax", result.incomeTax.total],
      ["Dividend tax", result.dividendTax.total],
      ["Employee NI", result.employeeNi],
      ["Employer NI", result.employerNi],
      ["Corporation tax", result.corporationTax.tax]
    ].map(([name, amount]) => `<tr><td>${name}</td><td>${formatCurrency(amount)}</td></tr>`).join("");

    const bandRows = [
      ...result.incomeTax.bands.map((band) => `<tr><td>Income tax ${band.name}</td><td>${formatCurrency(band.tax)}</td></tr>`),
      ...result.dividendTax.bands.map((band) => `<tr><td>Dividend tax ${band.name}</td><td>${formatCurrency(band.tax)}</td></tr>`)
    ].join("");

    const suggestions = result.optimisationSuggestions.map((item) => `<li>${item}</li>`).join("");

    return `
      <section class="metrics-section">
        <div>
          <p class="eyebrow">Scenario ${label}</p>
          <div class="summary-grid">${summaryCards}</div>
        </div>
        <table class="breakdown-table">
          <thead><tr><th>Total tax breakdown</th><th>Amount</th></tr></thead>
          <tbody>${taxRows}</tbody>
        </table>
        <table class="breakdown-table">
          <thead><tr><th>By band</th><th>Tax</th></tr></thead>
          <tbody>${bandRows}</tbody>
        </table>
        <table class="breakdown-table">
          <thead><tr><th>Take-home summary</th><th>Amount</th></tr></thead>
          <tbody>
            <tr><td>Gross income</td><td>${formatCurrency(result.grossIncome)}</td></tr>
            <tr><td>Income tax</td><td>${formatCurrency(result.incomeTax.total)}</td></tr>
            <tr><td>Employee NI</td><td>${formatCurrency(result.employeeNi)}</td></tr>
            <tr><td>Dividend tax</td><td>${formatCurrency(result.dividendTax.total)}</td></tr>
            <tr><td>Personal pension</td><td>${formatCurrency(result.inputs.pensionPersonal)}</td></tr>
            <tr><td>Net take-home</td><td>${formatCurrency(result.netTakeHome)}</td></tr>
          </tbody>
        </table>
        <div>
          <p class="eyebrow">Optimisation suggestions</p>
          <ul class="suggestion-list">${suggestions}</ul>
        </div>
      </section>
    `;
  }

  function renderSummaryCard(item) {
    return `
      <article class="summary-card">
        <p class="summary-label">${item.label}</p>
        <p class="summary-value">${item.value}</p>
        <p class="summary-note">${item.note}</p>
      </article>
    `;
  }

  function renderComparisonDelta(a, b) {
    const takeHomeDelta = b.netTakeHome - a.netTakeHome;
    const totalTaxDelta = b.totalTax - a.totalTax;
    const effectiveDelta = b.effectiveTaxRate - a.effectiveTaxRate;
    const betterScenario = takeHomeDelta > 0 ? "B" : takeHomeDelta < 0 ? "A" : "Tie";

    return `
      <p class="eyebrow">Comparison delta</p>
      <p class="metric-value">${betterScenario === "Tie" ? "Scenarios match on take-home" : `Scenario ${betterScenario} wins on take-home`}</p>
      <p class="metric-caption">Net take-home delta: ${formatSignedCurrency(takeHomeDelta)}</p>
      <p class="metric-caption">Total tax delta: ${formatSignedCurrency(totalTaxDelta)}</p>
      <p class="metric-caption">Effective tax rate delta: ${formatSignedPercent(effectiveDelta)}</p>
    `;
  }

  function calculateScenario(inputs, config) {
    const salaryAfterSacrifice = Math.max(0, inputs.salary - inputs.evSalarySacrifice);
    const evBenefit = inputs.evListPrice * config.evBikRate;
    const mileageClaim = calculateMileageClaim(inputs.businessMiles, config);
    const grossTaxableIncome = salaryAfterSacrifice + evBenefit + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
    const adjustedNetIncome = Math.max(0, grossTaxableIncome + inputs.dividends - grossedUpPersonalPension(inputs.pensionPersonal) - inputs.giftAid);
    const personalAllowanceBase = calculatePersonalAllowance(config, adjustedNetIncome) + inputs.personalAllowanceTransfer;
    const personalAllowance = Math.max(0, Math.min(config.personalAllowance, personalAllowanceBase));
    const basicBandExtension = grossedUpPersonalPension(inputs.pensionPersonal) + inputs.giftAid;
    const incomeTax = calculateIncomeTax(
      grossTaxableIncome,
      personalAllowance,
      config,
      basicBandExtension
    );
    const employeeNi = calculateEmployeeNi(salaryAfterSacrifice, config);
    const employerNi = calculateEmployerNi(salaryAfterSacrifice, config);
    const dividendTax = calculateDividendTax(inputs.dividends, grossTaxableIncome, personalAllowance, config, basicBandExtension);

    const deductibleExpenses = inputs.otherDeductions + inputs.professionalSubscriptions + inputs.pensionEmployer + inputs.evLeaseCost + mileageClaim + salaryAfterSacrifice + employerNi;
    const taxableProfit = Math.max(0, inputs.companyProfit - deductibleExpenses);
    const corporationTax = calculateCorporationTax(taxableProfit, config);

    const grossIncome = salaryAfterSacrifice + inputs.dividends + evBenefit + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
    const totalTax = incomeTax.total + dividendTax.total + employeeNi + employerNi + corporationTax.tax;
    const netTakeHome = grossIncome - incomeTax.total - employeeNi - dividendTax.total - inputs.pensionPersonal;
    const effectiveTaxRate = grossIncome > 0 ? totalTax / grossIncome : 0;
    const marginalRate = estimateMarginalRate(inputs, config);
    const optimisationSuggestions = buildSuggestions(inputs, config, {
      salaryAfterSacrifice,
      employeeNi,
      employerNi,
      corporationTax,
      dividendTax,
      grossTaxableIncome,
      netTakeHome,
      taxableProfit,
      totalTax
    });

    return {
      inputs,
      incomeTax,
      dividendTax,
      employeeNi,
      employerNi,
      corporationTax,
      mileageClaim,
      evBenefit,
      grossIncome,
      netTakeHome,
      totalTax,
      effectiveTaxRate,
      marginalRate,
      taxableProfit,
      optimisationSuggestions
    };
  }

  function calculateIncomeTax(income, personalAllowance, config, basicBandExtension) {
    let taxable = Math.max(0, income - personalAllowance);
    let previousUpper = personalAllowance;
    const bands = config.incomeBands.map((band) => {
      const adjustedUpper = Number.isFinite(band.upper) ? band.upper + basicBandExtension : Infinity;
      const bandSize = adjustedUpper - previousUpper;
      const amount = Math.max(0, Math.min(taxable, bandSize));
      const tax = amount * band.rate;
      taxable -= amount;
      previousUpper = adjustedUpper;
      return { name: band.name, amount, tax, rate: band.rate };
    });
    return { total: bands.reduce((sum, band) => sum + band.tax, 0), bands };
  }

  function calculateDividendTax(dividends, nonDividendIncome, personalAllowance, config, basicBandExtension) {
    let remainingAllowance = Math.max(0, personalAllowance - nonDividendIncome);
    let taxableDividends = Math.max(0, dividends - remainingAllowance - config.dividendAllowance);
    const taxableNonDividend = Math.max(0, nonDividendIncome - personalAllowance);
    const basicLimit = config.incomeBands[0].upper - config.personalAllowance + basicBandExtension;
    const higherLimit = config.incomeBands[1].upper - config.personalAllowance + basicBandExtension;
    const basicRemaining = Math.max(0, basicLimit - taxableNonDividend);
    const higherRemaining = Math.max(0, higherLimit - taxableNonDividend - basicRemaining);

    const basicAmount = Math.min(taxableDividends, basicRemaining);
    taxableDividends -= basicAmount;
    const higherAmount = Math.min(taxableDividends, higherRemaining);
    taxableDividends -= higherAmount;
    const additionalAmount = Math.max(0, taxableDividends);

    const bands = [
      { name: "Basic", amount: basicAmount, rate: config.dividendBands[0].rate, tax: basicAmount * config.dividendBands[0].rate },
      { name: "Higher", amount: higherAmount, rate: config.dividendBands[1].rate, tax: higherAmount * config.dividendBands[1].rate },
      { name: "Additional", amount: additionalAmount, rate: config.dividendBands[2].rate, tax: additionalAmount * config.dividendBands[2].rate }
    ];

    return { total: bands.reduce((sum, band) => sum + band.tax, 0), bands };
  }

  function calculateEmployeeNi(salary, config) {
    const mainBand = Math.max(0, Math.min(salary, config.employeeNiUpper) - config.employeeNiThreshold);
    const upperBand = Math.max(0, salary - config.employeeNiUpper);
    return (mainBand * config.employeeNiMainRate) + (upperBand * config.employeeNiUpperRate);
  }

  function calculateEmployerNi(salary, config) {
    return Math.max(0, salary - config.employerNiThreshold) * config.employerNiRate;
  }

  function calculateCorporationTax(profit, config) {
    let rate;
    if (profit <= config.corpTaxLowerThreshold) {
      rate = config.corpTaxSmallRate;
    } else if (profit >= config.corpTaxUpperThreshold) {
      rate = config.corpTaxMainRate;
    } else {
      const marginalFraction = (profit - config.corpTaxLowerThreshold) / (config.corpTaxUpperThreshold - config.corpTaxLowerThreshold);
      rate = config.corpTaxSmallRate + ((config.corpTaxMainRate - config.corpTaxSmallRate) * marginalFraction);
    }
    return { rate, tax: profit * rate };
  }

  function calculateMileageClaim(miles, config) {
    const first = Math.min(miles, 10000) * config.mileageRateFirst;
    const after = Math.max(0, miles - 10000) * config.mileageRateAfter;
    return first + after;
  }

  function calculatePersonalAllowance(config, adjustedNetIncome) {
    if (adjustedNetIncome <= config.personalAllowanceTaperStart) return config.personalAllowance;
    if (adjustedNetIncome >= config.personalAllowanceZero) return 0;
    return Math.max(0, config.personalAllowance - ((adjustedNetIncome - config.personalAllowanceTaperStart) / 2));
  }

  function estimateMarginalRate(inputs, config) {
    const current = calculateScenarioWithGuard(inputs, config);
    const next = calculateScenarioWithGuard({ ...inputs, dividends: inputs.dividends + 1 }, config);
    const taxDelta = next.totalTax - current.totalTax;
    return Math.max(0, Math.min(1, taxDelta));
  }

  function calculateScenarioWithGuard(inputs, config) {
    const result = calculateScenarioCore(inputs, config);
    return result;
  }

  function calculateScenarioCore(inputs, config) {
    const salaryAfterSacrifice = Math.max(0, inputs.salary - inputs.evSalarySacrifice);
    const evBenefit = inputs.evListPrice * config.evBikRate;
    const mileageClaim = calculateMileageClaim(inputs.businessMiles, config);
    const grossTaxableIncome = salaryAfterSacrifice + evBenefit + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
    const adjustedNetIncome = Math.max(0, grossTaxableIncome + inputs.dividends - grossedUpPersonalPension(inputs.pensionPersonal) - inputs.giftAid);
    const personalAllowanceBase = calculatePersonalAllowance(config, adjustedNetIncome) + inputs.personalAllowanceTransfer;
    const personalAllowance = Math.max(0, Math.min(config.personalAllowance, personalAllowanceBase));
    const basicBandExtension = grossedUpPersonalPension(inputs.pensionPersonal) + inputs.giftAid;
    const incomeTax = calculateIncomeTax(grossTaxableIncome, personalAllowance, config, basicBandExtension);
    const employeeNi = calculateEmployeeNi(salaryAfterSacrifice, config);
    const employerNi = calculateEmployerNi(salaryAfterSacrifice, config);
    const dividendTax = calculateDividendTax(inputs.dividends, grossTaxableIncome, personalAllowance, config, basicBandExtension);
    const deductibleExpenses = inputs.otherDeductions + inputs.professionalSubscriptions + inputs.pensionEmployer + inputs.evLeaseCost + mileageClaim + salaryAfterSacrifice + employerNi;
    const taxableProfit = Math.max(0, inputs.companyProfit - deductibleExpenses);
    const corporationTax = calculateCorporationTax(taxableProfit, config);
    const grossIncome = salaryAfterSacrifice + inputs.dividends + evBenefit + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
    const totalTax = incomeTax.total + dividendTax.total + employeeNi + employerNi + corporationTax.tax;
    return { totalTax, grossIncome, taxableProfit, corporationTax, employeeNi, employerNi };
  }

  function buildSuggestions(inputs, config, context) {
    const suggestions = [];
    const niThresholdGap = Math.max(0, config.employeeNiThreshold - context.salaryAfterSacrifice);
    if (niThresholdGap > 0 && niThresholdGap <= 5000) {
      suggestions.push(`Increase salary by ${formatCurrency(niThresholdGap)} to reach the employee NI threshold if you want a higher qualifying salary without employee NI.`);
    }

    const salaryAboveThreshold = Math.max(0, context.salaryAfterSacrifice - config.employeeNiThreshold);
    if (salaryAboveThreshold > 0) {
      const salaryReset = Math.min(salaryAboveThreshold, 5000);
      const niSaving = salaryReset * (config.employeeNiMainRate + config.employerNiRate);
      suggestions.push(`Reducing salary by ${formatCurrency(salaryReset)} and replacing it with dividends could cut NI by about ${formatCurrency(niSaving)} before corporation tax effects.`);
    }

    const pensionRoom = Math.max(0, config.pensionAnnualAllowance - (inputs.pensionEmployer + grossedUpPersonalPension(inputs.pensionPersonal)));
    if (pensionRoom > 0) {
      const suggested = Math.min(5000, pensionRoom, Math.max(0, context.taxableProfit));
      const corpSaving = suggested * context.corporationTax.rate;
      if (suggested > 0) {
        suggestions.push(`Increase employer pension by ${formatCurrency(suggested)} to save about ${formatCurrency(corpSaving)} in corporation tax while moving funds out tax-efficiently.`);
      }
    }

    if (inputs.evListPrice > 0 && inputs.evSalarySacrifice === 0) {
      const salarySacrificeExample = Math.min(6000, Math.max(0, context.salaryAfterSacrifice));
      const saving = salarySacrificeExample * (config.employeeNiMainRate + 0.2);
      suggestions.push(`Consider salary sacrifice for the EV. Sacrificing ${formatCurrency(salarySacrificeExample)} could save roughly ${formatCurrency(saving)} of personal tax and NI before BIK.`);
    }

    if (inputs.businessMiles > 0) {
      suggestions.push(`Business mileage relief worth ${formatCurrency(calculateMileageClaim(inputs.businessMiles, config))} is already reducing company profit. Keep this only for a personal vehicle.`);
    }

    if (inputs.dividends > 0) {
      const altProfit = calculateScenarioCore({ ...inputs, dividends: Math.max(0, inputs.dividends - 1000), salary: inputs.salary + 1000 }, config);
      const current = calculateScenarioCore(inputs, config);
      const delta = altProfit.totalTax - current.totalTax;
      suggestions.push(delta < 0
        ? `Replacing the next ${formatCurrency(1000)} of dividends with salary appears cheaper by about ${formatCurrency(Math.abs(delta))}.`
        : `Keeping the next ${formatCurrency(1000)} as dividends appears cheaper than salary by about ${formatCurrency(Math.abs(delta))}.`);
    }

    return suggestions.slice(0, 5);
  }

  function copyShareableUrl() {
    const url = `${window.location.origin}${window.location.pathname}${buildQueryString()}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        refs.shareScenario.textContent = "Copied";
        window.setTimeout(() => {
          refs.shareScenario.textContent = "Copy shareable URL";
        }, 1200);
      })
      .catch(() => {
        refs.shareScenario.textContent = "Copy failed";
      });
  }

  function syncUrl() {
    window.history.replaceState({}, "", buildQueryString());
  }

  function buildQueryString() {
    const payload = encodeURIComponent(JSON.stringify(state));
    return `?state=${payload}`;
  }

  function loadState() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("state");
    if (!encoded) return structuredClone(DEFAULT_STATE);
    try {
      const parsed = JSON.parse(decodeURIComponent(encoded));
      return {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        scenarios: {
          A: { ...createDefaultScenario(), ...(parsed.scenarios?.A || {}) },
          B: { ...createDefaultScenario(), ...(parsed.scenarios?.B || {}) }
        }
      };
    } catch (error) {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function createTaxYearConfig(config) {
    return config;
  }

  function createDefaultScenario() {
    return {
      companyProfit: 120000,
      salary: 12570,
      dividends: 50000,
      pensionPersonal: 0,
      pensionEmployer: 0,
      evListPrice: 0,
      evLeaseCost: 0,
      evSalarySacrifice: 0,
      businessMiles: 0,
      interestIncome: 0,
      rentalIncome: 0,
      otherDeductions: 0,
      professionalSubscriptions: 0,
      giftAid: 0,
      personalAllowanceTransfer: 0,
      otherIncome: 0
    };
  }

  function rangeField(id, label, min, max, step, initial, note) {
    return { id, label, min, max, step, initial, note };
  }

  function grossedUpPersonalPension(amount) {
    return amount * 1.25;
  }

  function clampNumber(value) {
    return Number.isFinite(Number(value)) ? Number(value) : 0;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  function formatSignedCurrency(value) {
    return `${value >= 0 ? "+" : "-"}${formatCurrency(Math.abs(value))}`;
  }

  function formatPercent(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  function formatSignedPercent(value) {
    return `${value >= 0 ? "+" : "-"}${Math.abs(value * 100).toFixed(1)}%`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value || 0);
  }
})();
