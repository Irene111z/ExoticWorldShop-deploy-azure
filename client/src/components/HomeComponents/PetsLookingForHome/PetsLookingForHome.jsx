import React from 'react'
import './PetsLookingForHome.css'

const PetsLookingForHome = () => {
  return (
    <div className='d-flex align-items-center flex-column text-center pets-slider'>
        <p className="pets-slider-title mb-1">Тварини, що шукають дім</p>
        <p className='pets-slider-text mb-4'>Покинуті та знедолені тварини чекають на вашу турботу.<br/>Вони потребують <span style={{color:'#FFB335', fontWeight:'700'}}>любові</span> та <span style={{color:'#ADFF2F', fontWeight:'700'}}>шансу</span> на щасливе життя.</p>
        <div className="d-flex justify-content-between mb-4">
            <img src='/static/left-arrow-round.svg' alt="" style={{width:'40px'}} className="me-3"/>
            <div className="d-flex">
                <div className="pets-slide mx-3">
                    <img src='/static/pet1.jpg' alt="" style={{borderRadius:'0 50px 0 0'}} />
                    <div className="pets-slide-name" style={{borderRadius:'0 0 0 50px'}}>Дейзі</div>
                </div>
                <div className="pets-slide mx-3">
                    <img src='/static/pet2.jpg' alt="" style={{borderRadius:'0 50px 0 0'}} />
                    <div className="pets-slide-name" style={{borderRadius:'0 0 0 50px'}}>Максік</div>
                </div>
                <div className="pets-slide mx-3">
                    <img src='/static/pet3.jpg' alt="" style={{borderRadius:'0 50px 0 0'}} />
                    <div className="pets-slide-name" style={{borderRadius:'0 0 0 50px'}}>Пиріжечок</div>
                </div>
            </div>
            <img src='/static/right-arrow-round.svg' alt="" style={{width:'40px'}} className="ms-3"/>
        </div>
        <p className='pets-slider-text'>Можливо, <span style={{color:'#ADFF2F', fontWeight:'700'}} className="text-uppercase">саме ви</span> зможете стати їхнім новим домом.</p>
        <a href="">
            <div className="pets-slider-btn-see-all">
                Переглянути усіх тварин
            </div>
        </a>
    </div>
  )
}

export default PetsLookingForHome