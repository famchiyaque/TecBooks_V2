# Calculations for CBM

There are 3 sections of data in the Canonical Business Model

This file explains how the 3 sections of the CBM are calculated and used.

Each of the 3 sections harness the 3 core app components (adapters, engine, and model)

1. Inputs and Basic Values (adapter -> model)

- Sold products, financing, payroll, etc.

- These are the ERP-like inputs that come from the user's chosen input method.

- They are read and stored immediately, as the first step and basis of the entire business model.

- The appropriate adapter is always used to read and process the user's input data into the CBM.

2. Derived Values (engine -> model)

- Derived values: projected orders, projected raw mat costs, projected admin expenses, etc.

- Values or arrays of values calculated using the basic inputs and one of various projection methods to map out the given value into the future, effectively forecasting the business's future economic state.

- They are calculated immediately after the storing of all basic inputs and use canonical mathematical functions defined in the derivations.js file. 

- These values may change if the user adjusts the CBM's overarching timeline or the forecasting method used to derive on of the projected values.

3. Final Metrics (engine -> model)

- Final metrics: Future inflows, outflows, 