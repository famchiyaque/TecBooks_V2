const feasibilityProjectCurrencyChange = (
    data,
    rate,
) => {
    const result = structuredClone(data);

    // Exposed on the returned model for downstream consumers that can't
    // read cbm fields directly (e.g. computeCurrentActives' mock stocks
    // value) - so they can still stay consistent with the selected currency.
    result.currencyRate = rate;

    // Premisas - only startingMoney is a currency amount; every other
    // Premisas field (inflation/ISR/PTU/admin%/depreciation%/leading rate/
    // demand growth) is a rate or percentage and must NOT be multiplied.
    if (typeof data.premises?.startingMoney === "number") {
        result.premises.startingMoney = data.premises.startingMoney * rate;
    }

    // BOM
    result.bom.salePrice = data.bom.salePrice * rate;

    result.bom.parts = data.bom.parts.map((part) => ({
        ...part,
        cost: part.cost * rate,
    }));

    // Employees
    result.employees = data.employees.map((employee) => ({
        ...employee,
        percepcion: employee.percepcion * rate,
    }));

    // Services
    result.services = data.services.map((service) => ({
        ...service,
        monthlyAmount: service.monthlyAmount * rate,
    }));

    // Assets
    result.assets.byCategory = Object.fromEntries(
        Object.entries(data.assets.byCategory).map(
            ([category, assets]) => [
                category,
                assets.map((asset) => ({
                    ...asset,
                    acquisitionByYear: asset.acquisitionByYear.map(
                        (value) => value * rate,
                    ),
                })),
            ],
        ),
    );

    // Legacy cost calculations still read these fixed category arrays.
    for (const category of ["transport", "buildings", "compute"]) {
        result.assets[category] = (data.assets[category] ?? []).map((asset) => ({
            ...asset,
            acquisitionByYear: asset.acquisitionByYear.map(
                (value) => value * rate,
            ),
        }));
    }

    // Capacity - Machines
    result.capacity.machines = data.capacity.machines.map((machine) => ({
        ...machine,
        acquisitionByYear: machine.acquisitionByYear.map(
            (value) => value * rate,
        ),
    }));

    return result;
};

export default feasibilityProjectCurrencyChange;