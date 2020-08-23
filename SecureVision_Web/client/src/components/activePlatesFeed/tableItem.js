import React, {Component} from 'react'
import StyledTableRow from '@material-ui/core/TableRow'
import StyledTableCell from '@material-ui/core/TableCell'
import Button from '@material-ui/core/Button'

import ParentModalFlow from './parentsModal'
import HighRiskModalFlow from './highRiskModal'

const primaryColor = '#2D2D2D'
const accentColor = '#1C63CD'

class TableItem extends Component{

    state = {
        name: this.props.name,
        type: this.props.type,
        plateNumber: this.props.plateNumber,
        id: this.props.id,
        showParentEdit: false,
        showParentDeactivate: false,
        showHighRiskEdit: false,
        showHighRiskDeactivate: false
    }

    // edit an item in the active plates table 
    handleEditModal = (e) => {
        console.log("Edit Modal")
        if(this.state.type === 'Parent'){
            this.setState({showParentEdit: true})
        }
        else{
            this.setState({showHighRiskEdit: true})
        }
    }   

    // delete an item in the active plates table (deactivate it)
    handleDeleteModal = (e) => {
        if(this.state.type === 'Parent'){
            this.setState({showParentDeactivate: true})
        }
        else{
            this.setState({showHighRiskDeactivate: true})
        }
    }   

    // user cancels edit or delete action 
    onCancel = () => {
        this.setState({showParentEdit: false, showParentDeactivate: false, showHighRiskEdit: false, showHighRiskDeactivate: false})
    }

    // callback passed to parent or criminal modal 
    // used to tell the higher level table component that data in one of the children components (high risk or parent modal) has been submitted
    onReturn = () => {
        this.setState({showParentEdit: false, showParentDeactivate: false, showHighRiskEdit: false, showHighRiskDeactivate: false})
        this.props.onSubmit()
    }

    render(){

        let rowStyle = {backgroundColor: '#F6F7F8'}
        let cellStyle = {color: primaryColor, fontWeight: 500}
        let btnStyle={color: accentColor, fontWeight: 500}

        return(
            <StyledTableRow key={this.props.i} style={rowStyle}>
              <StyledTableCell style={cellStyle} component="th" scope="row">
                {this.state.name}
              </StyledTableCell>
                <StyledTableCell style={cellStyle} align="left">{this.state.type}</StyledTableCell>
              <StyledTableCell style={cellStyle} align="left">{this.state.plateNumber}</StyledTableCell>
              <StyledTableCell style={cellStyle} align="right">{[<Button style={btnStyle} id="123" onClick={(e) => {this.handleEditModal(e)}}>Edit</Button>,<Button style={btnStyle} onClick={(e)=>{this.handleDeleteModal(e)}}>Delete</Button>]}</StyledTableCell>
              <ParentModalFlow onSubmit={this.onReturn} id={this.state.id} studentName={this.props.studentName} name={this.state.name} plateNumber={this.state.plateNumber} showEditModal={this.state.showParentEdit} onCancel={this.onCancel} showDeactivateModal={this.state.showParentDeactivate}/>
              <HighRiskModalFlow onSubmit={this.onReturn} id={this.state.id} name={this.state.name} type={this.state.type} plateNumber={this.state.plateNumber} showEditModal={this.state.showHighRiskEdit} onCancel={this.onCancel} showDeactivateModal={this.state.showHighRiskDeactivate}/>
            </StyledTableRow>
        )
    }

}

export default TableItem