import { useEffect, useState, forwardRef } from 'react';

import TopBar from "../components/TopBar"
import NavBar from "../components/NavBar"
import SectionBar from "../components/SectionBar";
// import MySnackBar from '../components/SnackBar';


import { Grid } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


const GridBreak = styled('div')(({ theme }) => ({
    width: '100%',
}))

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function Upload() {
    const [students, setStudents] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    // const [openSB, setOpenSB] = React.useState(false);
    // const [exitedSB, setExitedSB] = React.useState(true);
    // const nodeRef = React.useRef(null);

    // const handleCloseSB = (_, reason) => {
    //     if (reason === 'clickaway') { return; }

    //     setOpenSB(false);
    // };

    // const handleClickSB = () => {
    //     setOpenSB(true);
    // };

    // const handleOnEnterSB = () => {
    //     setExitedSB(false);
    // };

    // const handleOnExitedSB = () => {
    //     setExitedSB(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };

    const updateStudents = () => {
        fetch("/api/student/", {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setStudents(result);
            });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        updateStudents();
    }, []);

    return (
        <div>
            <NavBar title="Gestion My2A > Imports" />
            <Grid container style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                <Grid item md={6} rowGap={8} spacing={12}>
                    <SectionBar title="Importer des cours" />
                    <div style={{ marginBottom: '10px' }}></div>
                    <Grid container justifyContent="center" columnGap={4}>
                        {/* <Button component="label" variant="outlined" color="secondary" startIcon={<CloudUploadIcon />} disabled={selectedFile !== null}>
                            Sélectionner un fichier
                            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                        </Button> */}
                        {/* <Button variant="contained" color="secondary" endIcon={<SendIcon />} disableElevation disabled={selectedFile === null} onClick={handleImportClick}>
                            Importer
                        </Button> */}

                    </Grid>
                </Grid>
                <GridBreak />
                <Grid item md={6} xs={11} sm={11}>
                </Grid>
            </Grid >
        </div >
    )
}

// Checker que c'est bien un csv. sinon message d'erreur 
// Ajouter un i pour avoir un exemple de csv.

{/* <TriggerButton type="button" onClick={handleClickSB}>
                            Open snackbar
                        </TriggerButton> */}
{/* <MySnackBar message="Tout est bon" details="C'est good" isError={false} /> */ }