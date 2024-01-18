import { useEffect, useState, forwardRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Topbar from "../components/Topbar"
import SectionBar from "../components/SectionBar";
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

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GridBreak = styled('div')(({ theme }) => ({
    width: '100%',
}))

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    marginBottom: 10

}));

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

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function Upload() {
    const [students, setStudents] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

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
            <Topbar title="Gestion My2A > Imports" />
            <Grid container style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                <Grid item md={6} rowGap={8} spacing={12}>
                    <SectionBar title="Importer des cours" />
                    <div style={{ marginBottom: '10px' }}></div>
                    <Grid container justifyContent="center" columnGap={4}>
                        <Button component="label" variant="outlined" color="secondary" startIcon={<CloudUploadIcon />} disabled={selectedFile !== null}>
                            Sélectionner un fichier
                            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                        </Button>
                        <Button variant="contained" color="secondary" endIcon={<SendIcon />} disableElevation disabled={selectedFile === null}>
                            Importer
                        </Button>
                    </Grid>
                </Grid>
                <GridBreak />

                <Grid item md={6} xs={11} sm={11}>
                    {/* ... */}
                </Grid>
            </Grid >
        </div >
    )
}