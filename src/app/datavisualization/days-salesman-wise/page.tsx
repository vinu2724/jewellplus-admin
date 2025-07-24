import WeightVsDays from '@/components/Days-Salesman-Wise/WeightVsDays'
import WeightVsSalesman from '@/components/Days-Salesman-Wise/WeightVsSalesman'
import React from 'react'

const page = () => {
  return (
    <>
    <div className="lg:ml-64">
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <WeightVsDays />
      <WeightVsSalesman />
      </div>
      </div>
    </>
  )
}

export default page
