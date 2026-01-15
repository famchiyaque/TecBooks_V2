import Box from '@mui/material/Box'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import React from 'react'

function PastTime({ past, pastChange }) {
    return (
        <TabContext value={past}>
            <div className="row-tabs" style={{ justifyContent: 'flex-start'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', height: '30px', padding: 0 }}>
                    <TabList onChange={pastChange} sx={{ minHeight: '30px', padding: 0 }}>
                        <Tab label="This Month" value={1} sx={{ fontSize: '12px', minHeight: '30px', padding: '0 5px', minWidth: '25px', textTransform: 'none' }} />
                        <Tab label="Last 6 M" value={2} sx={{ fontSize: '12px', minHeight: '30px', padding: '0 5px', minWidth: '25px', textTransform: 'none' }} />
                        <Tab label="This Year" value={3} sx={{ fontSize: '12px', minHeight: '30px', padding: '0 5px', minWidth: '25px', textTransform: 'none' }} />
                        <Tab label="All Time" value={4} sx={{ fontSize: '12px', minHeight: '30px', padding: '0 5px', minWidth: '25px', textTransform: 'none' }} />
                    </TabList>
                </Box>
            </div>
        </TabContext>
    )
}

export default PastTime