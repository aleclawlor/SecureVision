import React, { Component } from 'react'

let style = {
    marginLeft: '25px',
    lineHeight: '300%'
}

const getCurrentDate = () => {

    let today = new Date()

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy
    return today 

}

const primaryColor = '#2D2D2D'

// header component to show school location and name 
export default class schoolHeader extends Component{

    state = {
        currentDate: 'today' 
    }
    
    componentWillMount(){
        let today = getCurrentDate()
        this.setState({currentDate: today})
    }

    render(){
        return(
            <div style={style}>
                <h1 style={{fontSize: '50px'}}>{this.props.school}</h1>
                <div style={{display: 'flex', lineHeight: '5px'}}>
                    <h3 style={{fontSize: '27px', color: primaryColor}}>{this.props.location}</h3>
                    <h3 style={{fontSize: '27px', marginLeft: '5%', color: primaryColor}}>{this.state.currentDate}</h3>
                </div>
            </div>
        )
    }
}