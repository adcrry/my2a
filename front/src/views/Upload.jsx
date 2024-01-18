import { useEffect, useState, forwardRef } from 'react';

import TopBar from "../components/TopBar"
import NavBar from "../components/NavBar"
import SectionBar from "../components/SectionBar";
// import MySnackBar from '../components/SnackBar';


import { Grid } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { styled, alpha } from '@mui/material/styles';
import { IconButton } from '@mui/material';
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
    const [openDialog, setOpenDialog] = useState(false);

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
        // Checker que c'est un csv
    };

    const handleImportClick = () => {

        // <MySnackBar message="Tout est bon" details="C'est good" isError={false} />
        // const formData = new FormData();
        // formData.append("file", selectedFile);

        // fetch("/api/student/import", {
        //     method: "POST",
        //     credentials: "include",
        //     body: formData,
        // })
        //     .then((res) => res.json())
        //     .then((result) => {
        //         // console.log(result);
        //         // handleClickSB();
        //         updateStudents();
        //     });
    }


    useEffect(() => {
        updateStudents();
    }, []);

    return (
        <div>
            <TopBar title="Gestion My2A > Imports" />
            <Grid container style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                <Grid item md={6} rowGap={8} spacing={12}>
                    <SectionBar
                        title="Importer des cours"
                        infos="blabla"
                    />
                    {/* <Button variant="outlined" startIcon={<InfoIcon />}></Button> */}
                    <div style={{ marginBottom: '20px' }}></div>
                    <Grid container justifyContent="center" columnGap={4}>
                        <Button component="label" variant="outlined" color="secondary" startIcon={<CloudUploadIcon />} disabled={selectedFile !== null}>
                            Sélectionner un fichier
                            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                        </Button>
                        <Button variant="contained" color="secondary" endIcon={<SendIcon />} disableElevation disabled={selectedFile === null} onClick={handleImportClick}>
                            Importer
                        </Button>

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


{/* <MySnackBar message="Tout est bon" details="C'est good" isError={false} /> */ }