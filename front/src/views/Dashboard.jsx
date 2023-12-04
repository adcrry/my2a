import React from "react";
import { List, Paper, Grid } from "@mui/material";
import Topbar from "../components/Topbar";
import CustomProgressBar from "../components/ProgressBar";


export default function Dashboard() {
     
    return (
        <>            
            <Topbar title="Accueil" />
            <Grid container style={{marginTop: '30px'}}>
                <Grid item md={10} xs={12} sm={12}>
                    <CustomProgressBar progress={10} />
                </Grid>
            </Grid>
            <Paper elevation={3} sx={{margin:2, padding:2}}>
                <List>
                    <h1>Dashboard</h1>
                </List>
            </Paper>
        </>
    )
}