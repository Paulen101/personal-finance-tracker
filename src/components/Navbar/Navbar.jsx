import React from "react";
import { NavLink } from "react-router-dom";
import './Navbar.css';

function Navbar() {
    return (
        <div className="navbar">
            <div className="Title">
                Finance <br /> Management <br /> System
            </div>
            <div className="navWrapper">
                <ul className="navList">
                    {/* can prob use map here later */}
                    <li className={`navText`}><NavLink to="/" className={"navText"}>DASHBOARD</NavLink></li>
                    <li className={`navText`}><NavLink to="/expenses" className={"navText"}>EXPENSES</NavLink></li>
                    <li className={`navText`}><NavLink to="/wallets" className={"navText"}>WALLETS</NavLink></li>
                    <li className={`navText`}><NavLink to="/budgets" className={"navText"}>BUDGETS</NavLink></li>
                    <li className={`navText`}><NavLink to="/analytics" className={"navText"}>ANALYTICS</NavLink></li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
