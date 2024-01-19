import React from "react";
import '../styles/styles.css'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function TopBar(props) {
    return (
        <AppBar position="static" elevation={0}>
            <Toolbar variant="dense">
                <img src="../light.png" alt="Light Icon" style={{ width: '3%', height: '3%', marginRight: 15 }} />

                {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                </IconButton> */}
                <Typography variant="h6" color="inherit" component="div">
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
    )

}