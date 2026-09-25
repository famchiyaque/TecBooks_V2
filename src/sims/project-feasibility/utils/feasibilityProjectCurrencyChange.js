const feasibilityProjectCurrencyChange = (
    data,
    rate,
) => {
    const result = structuredClone(data);

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

    return result;
};

export default feasibilityProjectCurrencyChange;