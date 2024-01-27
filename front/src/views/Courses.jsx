import { useEffect, useState, forwardRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import TopBar from "../components/TopBar"
// import NavBar from "../components/NavBar"
import SectionBar from "../components/SectionBar";


import { Grid } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { required_ects } from "../utils/utils";

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

export default function Courses(){

    const [courses, setCourses] = useState([])
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({})
    const [editOpened, setEditOpened] = useState(false)

    const handleClose = () => {
      setOpen(false);
    };

    const updateCourses = () => {
        fetch("/api/course/", {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setCourses(result)
            })
    }

    useEffect(() => {
        updateCourses()
    }, [])

    const updateSearch = (search) => {
        fetch("/api/course/search?search=" + search, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((result) => {
            setCourses(result);
        });
    };

    const fetchCourseData = (id) => {
        fetch("/api/course/" + id, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((result) => {
            setCurrentCourse(result);
            setOpen(true);
        });
    };

    useEffect(() => {
        updateSearch(search)
    }, [search])

    return (
        <div>
            <TopBar title="Gestion My2A" />
            <Grid container style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                <Grid item md={6}>
                    <SectionBar title="Parcourir les cours" />
                    <div style={{ marginBottom: '10px' }}></div>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </Search>
                </Grid>
                <GridBreak />
                <Grid item md={6} xs={11} sm={11}>

                    <List dense sx={{ bgcolor: 'background.paper' }}>
                        {courses.map((value) => {
                            const labelId = `checkbox-list-secondary-label-${value}`;
                            return (
                                <ListItem
                                    key={value.name}
                                    disablePadding
                                    secondaryAction={
                                        <>
                                            <IconButton edge="end" aria-label="removeredeye" onClick={() => {
                                                fetchCourseData(value.id)
                                            }}>
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                            <IconButton aria-label="edit" style={{ marginLeft: '10px' }} onClick={
                                                () => {
                                                    setCurrentCourse(value)
                                                    setEditOpened(true)
                                                }
                                            }>
                                                <EditIcon />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    {/* Rq : mettre dans l'ordre alphabétique */}
                                    <ListItemButton>
                                        <ListItemText id={labelId} primary={`${value.name}`} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{`Modifier les informations de ${currentCourse.name}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <DialogContentText>
                            <strong>Département</strong> : {currentCourse.department}
                        </DialogContentText>
                    </DialogContentText>
                    <DialogContentText>
                    <strong>ECTS</strong> : <span style={{ fontWeight: 'normal', color: 'black' }}>{currentCourse.ects}</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={handleClose}>Fermer</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={editOpened}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => { setEditOpened(false) }}
                aria-describedby="alert-dialog-slide-description"
            >
            </Dialog>
        </div>
    )
}