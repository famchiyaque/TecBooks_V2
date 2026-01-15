import React, { useEffect, useState } from 'react';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { FaRandom, FaFileUpload } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentDataInfo, setDataSouce, setSalesData, setSeriesData } from '../store';
import DataConfigPopover from './DataConfigPopover';
import DataUploadPopover from './DataUploadPopover';
import { setStartDate, setBehavior, setBehaviorCase, setSalesDataBatch } from '../store';
import { BEHAVIOR_OPTIONS, DATA_PATTERNS } from '../configs/options-configs';
import { faker } from '@faker-js/faker';

function DataOptionsHeader() {
    // console.log("rendering DataOptionsHeader");
    const dispatch = useDispatch()

    const currentDataInfo = useSelector(getCurrentDataInfo);
    const [dataAnchorEl, setDataAnchorEl] = useState(null);
    const [uploadAnchorEl, setUploadAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleToggleDataConfigPopover = (event) => {
        if (dataAnchorEl) setDataAnchorEl(null); // close popover
        else setDataAnchorEl(event.currentTarget); // open popover anchored to icon
    };
    const dataOpen = Boolean(dataAnchorEl);

    const handleToggleUploadPopover = (event) => {
        if (uploadAnchorEl) setUploadAnchorEl(null);
        else setUploadAnchorEl(event.currentTarget);
    }
    const uploadOpen = Boolean(uploadAnchorEl);

    const handleRandomize = () => {
        console.log("------randomize called-------");
        const randDayOffset = faker.number.int({ min: -365 * 20, max: -365 });
        const randomStartDate = new Date();
        randomStartDate.setDate(randomStartDate.getDate() + randDayOffset);
        // console.log("randomStartDate was: ", randomStartDate);
        console.log("what's being passed to redux: ", randomStartDate.toISOString());

        const randBehaviorIdx = faker.number.int({ min: 0, max:  BEHAVIOR_OPTIONS.length - 1 });
        const randomBehavior = BEHAVIOR_OPTIONS[randBehaviorIdx].name;
        // console.log("randomBehavior was: ", randomBehavior);

        const randCaseIdx = faker.number.int({ min: 0, max: BEHAVIOR_OPTIONS[randBehaviorIdx].options.length - 1 });
        const randomBehaviorCase = BEHAVIOR_OPTIONS[randBehaviorIdx].options[randCaseIdx];
        // console.log("randomBehaviorCase was: ", randomBehaviorCase);


        dispatch(setDataSouce('random'));
        dispatch(setStartDate(randomStartDate.toISOString()));
        dispatch(setBehavior(randomBehavior));
        dispatch(setBehaviorCase(randomBehaviorCase));

        // dispatch(setSalesData(null));
        // dispatch(setSeriesData(null));
        console.log("handle random startDate: ", randomStartDate);
        console.log("handle random behavior: ", randomBehavior);
        console.log("handle random behavior case: ", randomBehaviorCase);
        dispatch(setSalesDataBatch([
            randomStartDate.toISOString(),
            randomBehavior,
            randomBehaviorCase
        ]));
    }

    // get random data on page load 
    useEffect(() => {
        handleRandomize();
        setIsLoading(false);
    }, [])

  return (
    <div className='flex justify-between mx-6 my-2 items-center border-b-2'>
      <div>
        <div className='flex justify-between mx-6 my-2 items-center'>
            {isLoading ? (
                <p>Loading data...</p>
            ) : (
                <p className='font-semibold text-gray-600'>
                    Showing {currentDataInfo?.label} data since {new Date(currentDataInfo?.startDate).toLocaleDateString()}...
                </p>
            )}
        </div>
      </div>

      <div className="flex justify-between gap-4 items-center">
        <Tooltip title="Data Config" placement='bottom-start'>
            <QueryStatsIcon
                id="data-config-icon"
                className="text-gray-500 w-[25px] h-[25px] cursor-pointer hover:text-blue-700"
                onClick={handleToggleDataConfigPopover}
            />
        </Tooltip>

        <DataConfigPopover
            anchorEl={dataAnchorEl}
            open={dataOpen}
            onClose={() => setDataAnchorEl(null)}
        />

        <Tooltip title="Randomize" placement='bottom'>
            <FaRandom 
                className="text-gray-500 w-[25px] h-[25px] cursor-pointer hover:text-blue-700"
                onClick={handleRandomize}
            />
        </Tooltip>

        <Tooltip title="Upload Data" placement='bottom-end'>
            <FaFileUpload 
                className="text-gray-500 w-[25px] h-[25px] cursor-pointer hover:text-blue-700" 
                onClick={handleToggleUploadPopover}
            />
        </Tooltip>

        <DataUploadPopover
            anchorEl={uploadAnchorEl}
            open={uploadOpen}
            onClose={() => setUploadAnchorEl(null)}
        />
      </div>
    </div>
  );
}

export default DataOptionsHeader;
