"use client";
import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DashboardIcon from '@mui/icons-material/HomeOutlined';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckoutIcon from '@mui/icons-material/ShoppingCartOutlined';

export default function bottomNav() {
    return (    
    
    <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue);
        }}
    >
  <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
  <BottomNavigationAction label="Checkout" icon={<CheckoutIcon />} />
  <BottomNavigationAction label="Account" icon={<AccountIcon />} />
</BottomNavigation>);
}