import React from 'react'
import {NavLink} from 'react-router-dom'

// Navigation item to handle page changes on global sidebar
const NavigationItem = (props) => {
    return(
        <NavLink 
            to={props.link} 
            exact={props.exact} 
            style={
                {textDecoration: 'none', color: props.color}}
        >
            {props.children}
        </NavLink>
    )
}

export default NavigationItem