import {useEffect, useState, forwardRef} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Topbar from "../components/Topbar"
import { Grid } from '@mui/material';
import IconButton from "@mui/material/IconButton";
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

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const GridBreak = styled('div')(({theme}) => ({
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

export default function Inspector(){

    const [students, setStudents] = useState([])
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState([])

    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
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
    }, [])

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

    const fetchStudentData = (id) => {
        fetch("/api/student/" + id, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((result) => {
            setCurrentStudent(result)
            setOpen(true)
        })
    }

    const changeStudentStatus = (id) => {

    }

    useEffect(() => {
        updateSearch(search)
    },  [search])

    return (
        <div>
            <Topbar title="Gestion My2A" />
            <Grid container style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                <Grid item md={6}>
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
                {students.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value}`;
                    return (
                    <ListItem
                        key={value.surname}
                        disablePadding
                        style={{backgroundColor: value.editable ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)'}}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="removeredeye" onClick={() => {
                                    fetchStudentData(value.id)
                                }}>
                                    <RemoveRedEyeIcon />
                                </IconButton>
                                <IconButton aria-label="edit" style={{marginLeft: '10px'}}>
                                    <EditIcon />
                                </IconButton>
                            </>
                          }
                    >
                        <ListItemButton>
                        <ListItemText id={labelId} primary={`${value.surname}`} />
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
                <DialogTitle>{currentStudent.surname}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Cours obligatoires
                    <List dense sx={{ bgcolor: 'background.paper' }}>
                    {currentStudent.mandatory_courses && currentStudent.mandatory_courses.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;
                        return (
                        <ListItem
                            key={value.id}
                            disablePadding
                        >
                            <ListItemText id={labelId} primary={`-  ${value.course.name}`} />
                        </ListItem>
                        );
                    })}
                    </List>
                    Courses électifs
                    <List dense sx={{ bgcolor: 'background.paper' }}>
                    {currentStudent.elective_courses && currentStudent.elective_courses.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;
                        return (
                        <ListItem
                            key={value.id}
                            disablePadding
                        >
                            <ListItemText id={labelId} primary={`- ${value.course.name}`} />
                        </ListItem>
                        );
                    })}
                    </List>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Imprimer</Button>
                <Button onClick={handleClose}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}