import React from 'react'
import Banner from '../components/HomeComponents/Banner/Banner'
import Sales from '../components/HomeComponents/Sales/Sales'
import BlogAdd from '../components/HomeComponents/BlogAdd/BlogAdd'
import ShopStatistic from '../components/HomeComponents/ShopStatistic/ShopStatistic'
import PetsLookingForHome from '../components/HomeComponents/PetsLookingForHome/PetsLookingForHome'

const HomePage = () => {
  return (
    <div>
      <Banner/>
      <Sales/>
      <BlogAdd/>
      <ShopStatistic/>
      <PetsLookingForHome/>
    </div>
  )
}

export default HomePage