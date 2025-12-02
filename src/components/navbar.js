"use client";
import * as React from 'react';
import Box from "@mui/material/Box";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckoutIcon from '@mui/icons-material/ShoppingCartOutlined';
import AdminIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

export default function bottomNav() {
    return (    
    
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        boxShadow: "0px -2px 10px rgba(0,0,0,0.15)",
      }}
    >
      <BottomNavigation
        showLabels
        sx={{ backgroundColor: "#FFF8E1" }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} href="/dashboard" />
        <BottomNavigationAction label="Checkout" icon={<CheckoutIcon />} href="/checkout" />
        <BottomNavigationAction label="Admin" icon={<AdminIcon/>} href="/manager"/>
        <BottomNavigationAction label="Account" icon={<AccountIcon />} href="/register" />
      </BottomNavigation>
    </Box>
    );
}
