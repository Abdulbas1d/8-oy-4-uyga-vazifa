import { FC } from 'react'
import './index.css'
import { NavLink } from 'react-router-dom'
import MoonPicture from "../../assets/images/moon.svg"
import CartPicture from "../../assets/images/cart-shopping.png"

const Header: FC = () => {
    return (
        <div>
            <div className="container-logo">
                <header className="header">
                    <button>C</button>
                    <div className="data">
                        <NavLink className="aHref" to='/'>Home</NavLink>
                        <NavLink className="aHref" to='/about'>About</NavLink>
                        <NavLink className="aHref" to='/products'>Products</NavLink>
                        <NavLink className="aHref" to='/cart'>Carts</NavLink>
                    </div>

                    <div className="images">
                        <img className='moon' src={MoonPicture} alt="" />
                        <img className='shopping' src={CartPicture} alt="" />
                    </div>
                </header>
            </div>
        </div>
    )
}

export default Header
