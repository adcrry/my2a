import { useEffect, useState, forwardRef } from 'react';

import TopBar from "../components/TopBar"
import NavBar from "../components/NavBar"
import SectionBar from "../components/SectionBar";
// import MySnackBar from '../components/SnackBar';



import InfoIcon from '@mui/icons-material/Info';
import { styled, alpha } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Cookies from 'js-cookie';


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
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
        const file = event.target.files[0];
        const fileType = file.type;
        const validFileTypes = ['text/csv'];

        if (validFileTypes.includes(fileType)) {
            setSelectedFile(file);
            setOpenSnackbar(true);
            setSnackbarMessage("Fichier valide");
            setSnackbarSeverity("success");

            // Fichier valide, continuer le traitement
        } else {
            // Fichier invalide, afficher un message d'erreur
            setOpenSnackbar(true);
            setSnackbarMessage("Le fichier doit être au format CSV.");
            setSnackbarSeverity("error");
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const sendFile = () => {
        const formData = new FormData();
        formData.append("csv_file", selectedFile);

        fetch("/api/upload/course", {
            method: "POST",
            credentials: "include",
            headers: {
                'X-CSRFToken': Cookies.get("csrftoken")
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setOpenSnackbar(true);
                    setSnackbarMessage("Import réussi");
                    setSnackbarSeverity("success");
                    setSelectedFile(null);
                } else {
                    setOpenSnackbar(true);
                    setSnackbarMessage("Erreur lors de l'import");
                    setSnackbarSeverity("error");
                }
            });
    };

    const handleImportClick = () => {
        // <MySnackBar message="Tout est bon" details="C'est good" isError={false} />
        if (selectedFile) {
            sendFile();
        }
    }


    useEffect(() => {
        // updateStudents();
    }, []);

    return (
        <div>
            <TopBar title="Gestion My2A > Imports" />
            <Grid container style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                <Grid item md={6} rowGap={8} spacing={12}>
                    <Box sx={{ backgroundColor: "white", paddingBottom: 2, borderRadius: "0 0 16px 16px" }}>
                        <SectionBar
                            title="Importer des cours"
                            infos="Il faut que le fichier soit au format csv. Vous pouvez télécharger l'exemple ci-dessous pour vous aider."
                            showInfo={true}
                            exampleFile="../public/exempleCours.csv"
                        />
                        {/* <Button variant="outlined" startIcon={<InfoIcon />}></Button> */}
                        <div style={{ marginBottom: '20px' }}></div>
                        <Grid container justifyContent="center" columnGap={4}>
                            <Button component="label" variant="contained" disableElevation color="secondary" startIcon={<CloudUploadIcon />} disabled={selectedFile !== null}>
                                {selectedFile ? selectedFile.name : "Sélectionner un fichier"}
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                            </Button>
                            {selectedFile && (
                                <IconButton color="error" onClick={() => setSelectedFile(null)} style={{ marginLeft: -30 }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            )}
                            <Button variant="contained" color="secondary" endIcon={<SendIcon />} disableElevation disabled={selectedFile === null} onClick={handleImportClick}>
                                Importer
                            </Button>



                        </Grid>
                    </Box>
                </Grid>
                <GridBreak />
                <Grid item md={6} xs={11} sm={11}>
                </Grid>
            </Grid >
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} sx={{ width: '100%' }} severity={snackbarSeverity} variant="filled"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div >
    )
}