import { useEffect, useState, forwardRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import TopBar from "../components/TopBar"
// import NavBar from "../components/NavBar"
import SectionBar from "../components/SectionBar";
import TextField from '@mui/material/TextField';
import { Grid, Typography } from '@mui/material';
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
import Cookies from 'js-cookie';

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
    const [currentCourse, setCurrentCourse] = useState(null)
    const [editOpened, setEditOpened] = useState(false)
    const [rebuild, setRebuild] = useState(false)
    const [departments, setDepartments] = useState([])
    
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

        fetch("/api/department/", {
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

    const getDepartmentById = (id) => {
        console.log("eosdk")
        return departments.find(department => department.id === id).name
    }

    const getDepartmentIdByName = (name) => {
        return departments.find(department => department.name === name).id
    }

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

    const saveCourseDetails = (course) => {
        fetch("/api/course/update/?id=" + course.id, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify(course)
        })
            .then((res) => res.json())
            .then((result) => {
                setEditOpened(false)
                updateCourses()
        })
    }

    useEffect(() => {
        updateSearch(search)
    }, [search])

    return (
        <div>
            <TopBar title="Gestion My2A > Cours" />
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
                            onChange={(event) => setSearch(event.target.value)} />
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
                                    secondaryAction={<>
                                        <IconButton edge="end" aria-label="edit" onClick={() => {
                                            setCurrentCourse(JSON.parse(JSON.stringify(value)));
                                            setEditOpened(true);
                                        } }>
                                            <EditIcon />
                                        </IconButton>
                                    </>}
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
            <Dialog open={editOpened}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => { setEditOpened(false); } }
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{`Modifier les informations de ${ currentCourse && currentCourse.name}`}</DialogTitle>
            
    <DialogContent>
            <TextField sx={{marginTop: 2}}
                placeholder="Code"
                value={currentCourse && currentCourse.code}
                onChange={(e) => {
                    let tempCourse = currentCourse
                    tempCourse.code = e.target.value
                    setCurrentCourse(tempCourse)
                    setRebuild(!rebuild)
                }
                }
            />
        <TextField sx={{marginTop: 2}}
            placeholder="Département"
            value={currentCourse && getDepartmentById(currentCourse.department)}
            onChange={(e) => {
                let tempCourse = currentCourse
                tempCourse.department = getDepartmentIdByName(e.target.value)
                setCurrentCourse(tempCourse)
                setRebuild(!rebuild)
            }
            }
        />
        <TextField sx={{marginTop: 2}}
            placeholder="ECTS"
            value={currentCourse && currentCourse.ects}
            onChange={(e) => {
                let tempCourse = currentCourse
                tempCourse.ects = e.target.value
                setCurrentCourse(tempCourse)
                setRebuild(!rebuild)
            }
            }
        />

        <TextField sx={{marginTop: 2}}
            placeholder="Description"
            value={currentCourse && currentCourse.description}
            onChange={(e) => {
                let tempCourse = currentCourse
                tempCourse.description = e.target.value
                setCurrentCourse(tempCourse)
                setRebuild(!rebuild)
            }
            }
        />
        <TextField sx={{marginTop: 2}}
            placeholder="Enseignant"
            value={currentCourse && currentCourse.teacher}
            onChange={(e) => {
                let tempCourse = currentCourse
                tempCourse.teacher = e.target.value
                setCurrentCourse(tempCourse)
                setRebuild(!rebuild)
            }
            }
        />
        <TextField sx={{marginTop: 2}}
            placeholder="Semestre"
            value={currentCourse && currentCourse.semester}
            onChange={(e) => {
                let tempCourse = currentCourse
                tempCourse.semester = e.target.value
                setCurrentCourse(tempCourse)
                setRebuild(!rebuild)
            }
            }
        />
        <TextField sx={{marginTop: 2}}
            placeholder="Jour"
            value={currentCourse && currentCourse.day}
            onChange={(e) => {
                let tempCourse = currentCourse
                tempCourse.day = e.target.value
                setCurrentCourse(tempCourse)
                setRebuild(!rebuild)
            }
            }
        />
        <TextField sx={{marginTop: 2}}
            placeholder="Heure de début"
            value={currentCourse && currentCourse.start_time}
            onChange={(e) => {
                let tempCourse = currentCourse
                tempCourse.start_time = e.target.value
                setCurrentCourse(tempCourse)
                setRebuild(!rebuild)
            }
            }
        />
        <TextField sx={{marginTop: 2}}
            placeholder="Heure de fin"
            value={currentCourse && currentCourse.end_time}
            onChange={(e) => {
                let tempCourse = currentCourse
                tempCourse.end_time = e.target.value
                setCurrentCourse(tempCourse)
                setRebuild(!rebuild)
            }
            }
        />
    </DialogContent>
    <DialogActions>
                    <Button onClick={() => { saveCourseDetails(currentCourse) }}>Enregistrer</Button>
                </DialogActions>
</Dialog>
        </div>
    )
}