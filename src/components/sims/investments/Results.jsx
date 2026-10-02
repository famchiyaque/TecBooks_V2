import Button from '@mui/material/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import { useSelector } from 'react-redux'
import { getProjectInfo, getResults } from '@/store/project-evaluation.store'

function Results() {
  const projectInfo = useSelector(getProjectInfo)
  const results = useSelector(getResults)
  const { breakEven, roi, npv, irr, euac } = results
  const accepted = irr > projectInfo.discountRate

  const addResultsToHistory = () => {
    const storedHistory = sessionStorage.getItem("projEvalHistory");
    let history = storedHistory ? JSON.parse(storedHistory) : [];
  
    if (history.length >= 15) {
      // TODO add toast for displaying error messages
      console.log("stored length was too much");
      return;
    }
  
    const newEntry = {
      index: history.length + 1,
      projectInfo,
      results
    };
  
    const newHistory = [...history, newEntry];
    sessionStorage.setItem("projEvalHistory", JSON.stringify(newHistory));

    window.dispatchEvent(new Event("historyUpdated"));
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-3">
      <div className="flex justify-around items-end">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-gray-500">Payback</p>
          <p className="flex items-baseline gap-1">
            <span className="text-3xl">{breakEven == null ? "X" : breakEven}</span>
            <span className="text-sm text-gray-500">years</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-gray-500">ROI</p>
          <p className="flex items-baseline gap-1">
            <span className="text-3xl">{roi == null ? "X" : roi}</span>
            <span className="text-sm text-gray-500">%</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
          <span>NPV</span>
          <span className={npv > 0 ? "text-3xl text-green-600" : "text-3xl text-red-600"}>${npv}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span>EUAC</span>
          <span className="text-3xl">${euac}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span>IRR</span>
          <span className="text-3xl">{irr == 0.0 ? "X" : `${irr}%`}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex w-full max-w-sm justify-around items-center">
          {accepted ? (
            <ThumbUpAltIcon className="!h-12 !w-12 !text-green-600" />
          ) : (
            <ThumbDownAltIcon className="!h-12 !w-12 !text-red-600" />
          )}
          <p className={accepted ? "text-green-600" : "text-red-600"}>
            {accepted ? "The project is accepted" : "The project is not accepted"}
          </p>
        </div>
      </div>

      <Button variant="outlined" size="medium" onClick={addResultsToHistory}>
        Record Project&nbsp;
        <EditNoteIcon />
      </Button>
    </div>
  )
}

export default Results
