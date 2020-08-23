import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import NavigationItem from '../../navigationItem/navigationItem'
import {MdHome} from "react-icons/md";

const iconColor = '#2D2D2D'
const textColor = '#2D2D2D'

let itemStyle={marginTop: '25px', marginBottom: '25px', fontWeight: 400}

const classes = {
  label: {
    color: textColor,
    fontSize: '15px'
  }
}

// component to hold navigation links on the left sidebar 
export const mainListItems = (
  <div>
    <NavigationItem link='/dashboard' color={textColor}>
      <ListItem button style={itemStyle}>
        <ListItemIcon>
        <span style={{color: iconColor, marginLeft: '8px'}} class="material-icons"><strong style={{fontWeight: 800}}>dashboard</strong></span>
        </ListItemIcon>
        <span style={classes.label}>Home</span>
      </ListItem>
    </NavigationItem>
    <NavigationItem link="/dashboard/activity" fontWeight={800} color={textColor}>
      <ListItem button style={itemStyle}>
        <ListItemIcon>
        <span style={{color: iconColor, marginLeft: '8px'}} class="material-icons">list</span>
        </ListItemIcon>
        <span style={classes.label}>Complete Log</span>
      </ListItem>
    </NavigationItem>
    <NavigationItem link='/dashboard/unrecognized' color={textColor}>
      <ListItem button style={itemStyle}>
        <ListItemIcon>
        <span style={{color: iconColor, marginLeft: '8px'}} class="material-icons">warning</span>
        </ListItemIcon>
        <span style={classes.label}>Unrecognized Activity</span>
      </ListItem>
    </NavigationItem>
    <NavigationItem link='/dashboard/cameras' color={textColor}>
      <ListItem button style={itemStyle}>
        <ListItemIcon>
        <span style={{color: iconColor, marginLeft: '8px'}} class="material-icons">center_focus_weak</span>
        </ListItemIcon>
        <span style={classes.label}>Camera Feed</span>
      </ListItem>
    </NavigationItem>
    <NavigationItem link='/dashboard/registerNewUser' color={textColor}>
      <ListItem button style={itemStyle}>
        <ListItemIcon>
        <span style={{color: iconColor, marginLeft: '8px'}} class="material-icons">person_add</span>
        </ListItemIcon>
        <span style={classes.label}>Register Plates</span>
      </ListItem>
    </NavigationItem>
    <NavigationItem link="/dashboard/plates" color={textColor}>
      <ListItem button style={itemStyle}>
        <ListItemIcon>
        <span style={{color: iconColor, marginLeft: '8px'}} class="material-icons">table_chart</span>
        </ListItemIcon>
        <span style={classes.label}>Active Plates</span>
      </ListItem>
    </NavigationItem>
    <NavigationItem link="/dashboard/configuration" color={textColor}>
      <ListItem button style={itemStyle}>
        <ListItemIcon >
        <span style={{color: iconColor, marginLeft: '8px'}} class="material-icons">tune</span>
        </ListItemIcon>
        <span style={classes.label}>Configuration</span>
      </ListItem>
    </NavigationItem>
  </div>
);
