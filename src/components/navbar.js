"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import AdminIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

export default function BottomNav() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [navValue, setNavValue] = useState(0);

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
      value={navValue}
      onChange={(event, newValue) => {
        setNavValue(newValue);

        if (newValue === 1) {
          // Cart tab clicked
          setCartOpen(true);
        }
      }}
      showLabels
      sx={{ backgroundColor: "#FFF8E1" }}
    >
      <BottomNavigationAction value={0} label="Home" icon={<HomeIcon />} href="/dashboard" />
      <BottomNavigationAction value={2} label="Admin" icon={<AdminIcon/>} href="/manager"/>
      <BottomNavigationAction value={3} label="Account" icon={<AccountIcon />} href="/register" />
    </BottomNavigation>
    </Box>
    );
}
