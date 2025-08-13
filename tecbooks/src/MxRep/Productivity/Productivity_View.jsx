import '../../styles/productivity.css'
import { React, useEffect, useState } from 'react'
// import Typography from '@mui/material/Typography'
import { useSimData } from '../SimDataContext'
import PrimaryKPIs from './KPIS/PrimaryKPIs'
import Capacity from './KPIS/Capacity'
import OEE from './KPIS/OEE'
import Inventory from './Inventory/Inventory'
import Output from './Graphs/Output'
import Bottlenex from './Graphs/Bottlenex'
import { useOutletContext } from 'react-router-dom'
import Loader from '../Novus Components/Loader'
import { useNavigate } from 'react-router-dom'
import ViewTabs from './ViewTabs'

function Productivity_View() {
    const [view, setView] = useState(1)

    const handleView = (value) => {
        console.log(value)
        const newVal = parseInt(value)
        console.log("view changed")
        console.log("new value: ", newVal)
        setView(value)
    }

    const { period, year } = useOutletContext()
    const { simData, isLoading, error } = useSimData()
    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            navigate('/error')
        } else if (!simData && !isLoading) {
            navigate('/novus-dashboard')
        }
    }, [simData, error, isLoading, navigate])

    if (isLoading) return <Loader />

    return (
        <div className='productivity-view'>
            <div className='left'>
                <OEE />
                <Capacity />
            </div>
            
            <div className='right'>
                <PrimaryKPIs period={period} year={year} /> 
                <div className='right-view whitecard'>
                    <div className='right-tabs'>
                        <ViewTabs view={view} handleView={handleView} />
                        {/* <div className='whitecard-label' style={{ maxWidth: '50%' }}>
                            {infos[view - 1]}
                        </div> */}
                    </div>
                    <div className='right-graphs'>
                        {view == 1 ? <Bottlenex period={period} year={year} /> : ''}
                        {view == 2 ? <Output period={period} year={year} /> : ''}
                        {/* {view == 3 ? <OEEAdv period={period} year={year} /> : ''} */}
                    </div>
                </div>
            </div>

            <div className='far-right'>
                <Inventory />
            </div>
        </div>
    )
}

export default Productivity_View