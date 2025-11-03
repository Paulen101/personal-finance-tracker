import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
    return (
        <div className="navbar">
            <div className="Title">
                Finance <br /> Management <br /> System
            </div>
            <div className="navWrapper">
                <ul className="navList">
                    <li className="navText"><Link to="/">DASHBOARD</Link></li>
                    <li className="navText"><Link to="/">EXPENSES</Link></li>
                    <li className="navText"><Link to="/">WALLETS</Link></li>
                    <li className="navText"><Link to="/">BUDGETS</Link></li>
                    <li className="navText"><Link to="/">ANALYTICS</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
