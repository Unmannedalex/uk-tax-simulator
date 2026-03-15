# UK Personal Tax Simulator

Client-side web app for modelling a UK company director's personal tax position across salary, dividends, pension contributions, electric vehicle benefit in kind, mileage and deductions.

## Files

- `index.html`: single-page UI shell
- `styles.css`: responsive neo-brutalist visual system
- `app.js`: tax engine, state management, comparison mode and URL sharing

## Usage

Open `index.html` in a browser. All calculations run locally in the browser; no backend is required.

## Features

- Real-time calculation as inputs change
- Single scenario and side-by-side comparison mode
- Presets for common salary/dividend setups
- Shareable URL export
- Tax year selector for 2024/25, 2025/26 and 2026/27
- Mobile-responsive layout
- Dividend requests are capped to post-corporation-tax profit capacity and flagged in the UI

## Notes

- The calculator is an optimisation aid, not filed advice.
- 2026/27 currently uses the same published assumptions as 2025/26 where future official rates are not yet locked in.
- Pension tapering for adjusted income above annual allowance thresholds is simplified.
- Dividend availability is capped to estimated post-corporation-tax reserves for the current year only.
- Marriage allowance is simplified to the basic-rate recipient reducer and ignored outside that case.
