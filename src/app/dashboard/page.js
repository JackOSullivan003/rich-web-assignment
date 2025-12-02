
'use client'

import { styled } from '@mui/material/styles';
import { Card, Grid, Box, Paper } from '@mui/material';
import Navbar from "@/components/navbar.js";

const Item = styled(Paper)(({ theme }) => ({

  backgroundColor: '#fff',

  ...theme.typography.body2,

  padding: theme.spacing(1),

  textAlign: 'center',

  color: (theme.vars ?? theme).palette.text.secondary,

  ...theme.applyStyles('dark', {

    backgroundColor: '#1A2027',

  }),

}));


export default function Dashboard() {
  return (
    <Card
        sx={{
          width: "100%",
          borderRadius: 4,
          padding: 3,
          backgroundColor: "#FFF8E1", // McDonald's cream color
          boxShadow: "0px 4px 15px rgba(0,0,0,0.25)",
        }}
      >
    <Box sx={{ flexGrow: 1 }}>
    <div style={{ padding: 40 }}>
      <h1>Welcome to your Dashboard!</h1>
    </div>

      <Grid container spacing={2}>

        <Grid size={8}>

          <Item>size=8</Item>

        </Grid>

        <Grid size={4}>

          <Item>size=4</Item>

        </Grid>

        <Grid size={4}>

          <Item>size=4</Item>

        </Grid>

        <Grid size={8}>

          <Item>size=8</Item>

        </Grid>

      </Grid>

    </Box>
    <Navbar />
    </Card>

  );

}