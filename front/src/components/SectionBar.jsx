import React from "react";
import '../styles/styles.css'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import { styled, alpha } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const handleOpenDialog = () => {
    setOpenDialog(true);
};

const handleCloseDialog = () => {
    setOpenDialog(false);
};

const handleClose = () => {
    setOpen(false);
};


export default function SectionBar(props) {
    const info = false;
    const [openDialog, setOpenDialog] = React.useState(false);

    return (
        <AppBar position="static" color={props.color} elevation={0}>
            <Toolbar variant="dense">
                <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                    {props.title}
                </Typography>
                {info && (
                    <div>
                        <IconButton size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenDialog}
                            color="inherit">
                            <InfoIcon />
                        </IconButton>
                        <Dialog open={openDialog} onClose={handleCloseDialog}>
                            <DialogTitle>Explications</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {props.infos}
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}