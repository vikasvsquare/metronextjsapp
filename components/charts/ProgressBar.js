import React from 'react'

function ProgressBar() {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xxs -mb-4">Agg Assault on Operator</p>
      <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
        <div
          className="flex flex-col justify-center rounded-full overflow-hidden bg-[#0065A8;] text-xs text-white text-center whitespace-nowrap dark:bg-[#0065A8;] transition duration-500"
          style={{ width: '50%' }}
        >
          50%
        </div>
      </div>
      <p className="text-xxs -mb-4">Agg Assault on Operator</p>
      <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
        <div
          className="flex flex-col justify-center rounded-full overflow-hidden bg-[#0490EB] text-xs text-white text-center whitespace-nowrap dark:bg-[#0490EB] transition duration-500"
          style={{ width: '25%' }}
        >
          25%
        </div>
      </div>
      <p className="text-xxs -mb-4">Agg Assault on Operator</p>
      <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
        <div
          className="flex flex-col justify-center rounded-full overflow-hidden bg-[#57B7F5] text-xs text-white text-center whitespace-nowrap dark:bg-[#57B7F5] transition duration-500"
          style={{ width: '20%' }}
        >
          20%
        </div>
      </div>
      <p className="text-xxs -mb-4">Agg Assault on Operator</p>
      <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
        <div
          className="flex flex-col justify-center rounded-full overflow-hidden bg-[#A9DCFD] text-xs text-white text-center whitespace-nowrap dark:bg-[#A9DCFD] transition duration-500"
          style={{ width: '10%' }}
        >
          10%
        </div>
      </div>
    </div>
  )
}

export default ProgressBar