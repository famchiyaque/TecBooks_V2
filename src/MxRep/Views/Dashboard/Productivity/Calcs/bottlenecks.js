export function getProcessProductivity(period, year, simData) {
    
    const processes = ['Cutting', 'Assembly', 'Body', 'Interior', 'Exterior', 'Paint']
    const prods = [2.8, 3.4, 3.4, 3.2, 3.1, 3.5]
    const colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354']
    
    const seriesData = prods.map((product, index) => ({
        name: processes[index], 
        y: product, 
        color: colors[index % colors.length]  // Assign color from the colors array, cycling through them
    }))

    return seriesData
}
