import { useEffect, useState, forwardRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TopBar from "../components/TopBar"
import SectionBar from "../components/SectionBar";
import { Grid } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
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
import Cookies from 'js-cookie';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

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

export default function Parcours() {

    const [students, setStudents] = useState([])
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState([])
    const [deleteOpened, setDeleteOpened] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [departments, setDepartments] = useState([])
    const [currentDepartment, setCurrentDepartment] = useState(null)
    const [parcours, setParcours] = useState([])
    const [currentParcours, setCurrentParcours] = useState(null)
    const [currentCourse, setCurrentCourse] = useState(null)

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
                setStudents(result)
            })
    }

    useEffect(() => {
        fetch("/api/student/current", {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.is_admin === false) {
                    window.location = "/"
                } else {
                    setIsAdmin(true)
                }
            })
        fetch("/api/department/",
            {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => res.json())
            .then((result) => {
                setDepartments(result)
            })
    }, [])

    useEffect(() => {
        if (currentDepartment != null) {
            fetch("/api/parcours/?department=" + currentDepartment,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((res) => res.json())
                .then((result) => {
                    setParcours(result)
                    setCurrentParcours(null)
                })
        }
    }, [currentDepartment])

    const deleteCourseFromParcours = (id) => {
        console.log(currentDepartment, currentParcours, currentCourse)
        fetch("/api/parcours/remove_mandatory/",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                    body: JSON.stringify({ department: currentDepartment, parcours: currentParcours, course: currentCourse})
                })
                .then((res) => res.json())
                .then((result) => {
                    let tempParcours = parcours
                    for (let i = 0; i < tempParcours.length; i++) {
                        if (tempParcours[i].id === currentParcours) {
                            tempParcours[i].courses_mandatory = result
                        }
                    }
                    setParcours(tempParcours)
                    setDeleteOpened(false)
                })
    }

    const updateSearch = (search) => {
        fetch("/api/student/search?search=" + search, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setStudents(result)
            })
    }

    const getDepartmentItems = () => {
        return departments.map((department) => {
            return (
                <MenuItem value={department.id}>{department.code}</MenuItem>
            )
        })
    }

    const getParcoursItems = () => {
        return parcours.map((p) => {
            return (
                <MenuItem value={p.id}>{p.name}</MenuItem>
            )
        })
    }

    useEffect(() => {
        updateSearch(search)
    }, [search])

    useEffect(() => {
        if(currentParcours){
            fetch("/api/parcours/?department=" + currentDepartment + "&parcours=" + currentParcours,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => res.json())
            .then((result) => {
                setParcours(result)
            })
        }
    }, [currentParcours])

    return (
        <div>

            {isAdmin && (
                <div>
                    <TopBar title="Gestion My2A" />
                    <Grid container style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                        <Grid item md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Département</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentDepartment}
                                    label="Département"
                                    onChange={(e) => {
                                        setCurrentDepartment(e.target.value)
                                    }}
                                >
                                    {getDepartmentItems()}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ marginTop: 3, marginBottom: 3 }}>
                                <InputLabel>Parcours</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentParcours}
                                    label="Parcours"
                                    onChange={(e) => {
                                        setCurrentParcours(e.target.value)
                                    }}
                                    placeholder="Parcours"
                                >
                                    {getParcoursItems()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <GridBreak />
                        <Grid item md={6}>
                        </Grid>
                        <GridBreak />

                        <Grid item md={6} xs={11} sm={11}>
                            <SectionBar title="Parcourir les cours obligatoires" />
                            <Button sx={{ marginBottom: 2, marginTop: 2 }} variant="outlined" onClick={() => { window.location = "/api/students/export" }} startIcon={<DownloadIcon />} >Ajouter un cours obligatoire</Button>
                            <List dense sx={{ bgcolor: 'background.paper', marginBottom: 3}}>
                                {currentParcours && parcours.find(p => p.id === currentParcours).courses_mandatory.map((value) => {
                                    const labelId = `checkbox-list-secondary-label-${value}`;
                                    return (
                                        <ListItem
                                            key={value.code}
                                            disablePadding
                                            secondaryAction={
                                                <>
                                                    <IconButton aria-label="edit" style={{ marginLeft: '10px' }} onClick={
                                                        () => {
                                                            setCurrentCourse(value.id)
                                                            setDeleteOpened(true)
                                                        }
                                                    }>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            }
                                        >
                                            {/* Rq : mettre dans l'ordre alphabétique */}
                                            <ListItemButton>
                                                <ListItemText id={labelId} primary={"[" + value.code + "] " + value.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                            <SectionBar title="Parcourir les cours obligatoires sur liste"/>
                            <Button sx={{ marginBottom: 2, marginTop: 2 }} variant="outlined" onClick={() => { window.location = "/api/students/export" }} startIcon={<DownloadIcon />} >Ajouter un cours obligatoire sur liste</Button>
                            <List dense sx={{ bgcolor: 'background.paper'}}>
                                {currentParcours && parcours.find(p => p.id === currentParcours).courses_on_list.map((value) => {
                                    const labelId = `checkbox-list-secondary-label-${value}`;
                                    return (
                                        <ListItem
                                            key={value.code}
                                            disablePadding
                                            secondaryAction={
                                                <>
                                                    <IconButton aria-label="edit" style={{ marginLeft: '10px' }} onClick={
                                                        () => {
                                                            setCurrentCourse(value.id)
                                                            setDeleteOpened(true)
                                                        }
                                                    }>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            }
                                        >
                                            {/* Rq : mettre dans l'ordre alphabétique */}
                                            <ListItemButton>
                                                <ListItemText id={labelId} primary={"[" + value.code + "] " + value.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                    </Grid>
                    <Dialog
                        open={deleteOpened}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => { setDeleteOpened(false) }}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>Rendre le profil de {currentStudent.name} {currentStudent.surname} modifiable ?</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Attention: {currentStudent.name} pourra à nouveau modifier ses choix de cours.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { deleteCourseFromParcours(currentCourse) }}>Confirmer</Button>
                            <Button onClick={() => { setDeleteOpened(false) }}>Annuler</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </div>
    )
}