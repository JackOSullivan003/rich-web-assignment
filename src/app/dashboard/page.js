
'use client'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


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

  );

}