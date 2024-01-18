import React from "react";
import '../styles/styles.css'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function SectionBar(props) {
    return (
        <AppBar position="static" color={props.color} elevation={0}>
            <Toolbar variant="dense">
                <Typography variant="h6" color="inherit" component="div">
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}