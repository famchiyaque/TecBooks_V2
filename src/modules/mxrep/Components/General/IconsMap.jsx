import React from 'react'
import { MdDashboard, MdCandlestickChart, MdAccountCircle } from 'react-icons/md'
import { FaFileInvoiceDollar, FaChartPie, FaRegChartBar  } from 'react-icons/fa'
import { GiTeacher } from "react-icons/gi"
import { BiTrendingUp } from 'react-icons/bi'
import { IoGameController } from "react-icons/io5"
import { FaInbox } from "react-icons/fa6"
import { SiMixpanel } from "react-icons/si"
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
// import { BsBank } from "react-icons/bs"

export const iconMap = {
    1: <MdDashboard className="sidebar-icon" />,
    2: <FaFileInvoiceDollar className="sidebar-icon" />,
    3: <FaRegChartBar className="sidebar-icon" />,
    4: <BiTrendingUp className="sidebar-icon" />,
    5: <PrecisionManufacturingIcon className="sidebar-icon" />,
    6: <FaChartPie className="sidebar-icon" />,
    7: <IoGameController className="sidebar-icon" />,
    8: <GiTeacher className="sidebar-icon" />,
    9: <FaInbox className="sidebar-icon" />,
    10: <MdAccountCircle className="sidebar-icon" />,
    11: <SiMixpanel className="sidebar-icon" />
}