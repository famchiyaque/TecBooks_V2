import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSimData } from '../../SimDataContext'
import { getProcessProductivity } from '../Calcs/bottlenecks'

const Bottlenex = ({ period, year }) => {
    const { simData } = useSimData()
    const productivityData = simData.productivityData

    const [seriesData, setSeriesData] = useState([])

    useEffect(() => {
        const newData = getProcessProductivity(period, year, productivityData)
        setSeriesData(newData) // Update the seriesData state with new data
    }, [period, year, productivityData])

    const options = {
        chart: {
            type: 'column',
            height: '55%',
        },
        title: {
            text: 'Productivity by Process',
            style: { fontSize: '16px', color: 'gray' }
        },
        // subtitle: {
        //     text: 'Click the columns to view details.',
        // },
        accessibility: {
            announceNewData: {
                enabled: true,
            },
        },
        xAxis: {
            // title: {
            //     text: 'Process'
            // }
            categories: seriesData.map(item => item.name), // Set categories based on the process names
        },
        yAxis: {
            title: {
                text: 'units/hour',
            },
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}',
                },
            },
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> units/hour<br/>',
        },
        series: [
            {
                name: 'Productivity',
                colorByPoint: true,
                data: seriesData, // Pass the correct seriesData to the chart
            },
        ],
    };

    return (
        <div style={{ width: '100%' }}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    )
}

export default Bottlenex
