import React, { useEffect, useState, forwardRef } from "react";
import { Button, Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Box, setRef } from "@mui/material";
import TopBar from "../components/TopBar";
import CustomProgressBar from "../components/ProgressBar";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import SendIcon from '@mui/icons-material/Send';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import Cookies from 'js-cookie';
import '../styles/styles.css'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import { required_ects } from "../utils/utils";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function Dashboard() {

    const [progress, setProgress] = useState(0)
    const [opened, setOpened] = useState('')
    const [departments, setDepartments] = useState([])
    const [departement, setDepartement] = useState(-1)
    const [parcoursList, setParcoursList] = useState([])
    const [parcours, setParcours] = useState(-1)
    const [mandatoryCourses, setMandatoryCourses] = useState([])
    const [choosenMandatoryCourses, setChoosenMandatoryCourses] = useState([])
    const [electiveCourses, setElectiveCourses] = useState([])
    const [choosenElectiveCourses, setChoosenElectiveCourses] = useState([])
    const [compatibleCourses, setCompatibleCourses] = useState([])
    const [isLogged, setIsLogged] = useState(false)
    const [editable, setEditable] = useState(false)
    const [confirmationDialogState, setConfirmationDialogState] = useState(false)
    const [student, setStudent] = useState({})

    const handleChange = (panel) => {
        if (opened != panel) setOpened(panel)
    }

    const getDepartmentItems = () => {
        return departments.map((department) => {
            return (
                <MenuItem value={department.id}>{department.code}</MenuItem>
            )
        })
    }

    const getParcoursItems = () => {
        return parcoursList.map((parcours) => {
            return (
                <MenuItem value={parcours.id}>{parcours.name}</MenuItem>
            )
        })
    }

    const isCourseCompitable = (courseName) => {
        for (const index in compatibleCourses) {
            if (compatibleCourses[index].name == courseName) {
                return true
            }
        }
        return false
    }

    const getMandatoryCourses = () => {
        return mandatoryCourses.map((course) => {
            return (
                <FormControlLabel control={<Checkbox defaultChecked={choosenMandatoryCourses.includes(course.name)} onClick={(e) => {
                    changeEnrollment(course.name, e.target.checked, 'mandatory')
                }} />} disabled={!editable || !isCourseCompitable(course.name) && !choosenMandatoryCourses.includes(course.name)} label={course.name + ' (' + course.ects + ' ECTS)'} />
            )
        })

    }

    const getElectiveCourses = () => {
        return electiveCourses.map((course) => {
            return (
                <FormControlLabel control={<Checkbox defaultChecked={choosenElectiveCourses.includes(course.name)} onClick={(e) => {
                    changeEnrollment(course.name, e.target.checked, 'elective')
                }} />} disabled={!editable || !isCourseCompitable(course.name) && !choosenElectiveCourses.includes(course.name)} label={course.name + ' (' + course.ects + ' ECTS)'} />
            )
        })

    }

    const changeDepartment = (code) => {
        setDepartement(code)
        setParcours(-1)
        fetch('http://localhost/api/student/current/department/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({ department: code }),
        })
            .then((res) => res.json())
            .then((result) => {
                setOpened('parcours')
                setProgress(34)
            },
                (error) => {
                    console.log(error)
                })
    }

    const changeParcours = (code) => {
        setParcours(code)
        fetch('http://localhost/api/student/current/parcours/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({ parcours: code }),
        })
            .then((res) => res.json())
            .then((result) => {
                setOpened('obligatoires')
                setProgress(67)
            },
                (error) => {
                    console.log(error)
                })
    }

    const changeEnrollment = (course, is_enrolled, category) => {
        fetch('http://localhost/api/student/current/enroll/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({ course: course, is_enrolled: is_enrolled, category: category }),
        })
            .then((res) => res.json())
            .then((result) => {
                fetch('http://localhost/api/student/current/courses/available', {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((res) => res.json())
                    .then((result_available) => {
                        fetch('http://localhost/api/student/current/courses/available_electives', {
                            method: 'GET',
                            credentials: "include",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((res) => res.json())
                            .then((result) => {
                                setElectiveCourses(result)
                                fetch('http://localhost/api/student/current/id/', {
                                    method: 'GET',
                                    credentials: "include",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })
                                    .then((res) => res.json())
                                    .then((result) => {
                                        setStudent(result)
                                        const tempMandatory = []
                                        for (const index in result.mandatory_courses) {
                                            tempMandatory.push(result.mandatory_courses[index].course.name)
                                        }
                                        setChoosenMandatoryCourses(tempMandatory)

                                        const tempElective = []
                                        for (const index in result.elective_courses) {
                                            tempElective.push(result.elective_courses[index].course.name)
                                        }
                                        setChoosenElectiveCourses(tempElective)
                                        setCompatibleCourses(result_available)
                                    },
                                        (error) => {
                                            console.log(error);
                                        })
                            },
                                (error) => {
                                    console.log(error);
                                })
                    },
                        (error) => {
                            console.log(error);
                        })
            },
                (error) => {
                    console.log(error)
                })
    }

    const validateForm = () => {
        fetch('/api/student/updatestatus/', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json)
            .then((result) => {
                setConfirmationDialogState(false)
                window.location.href = '/dashboard'
            })
    }

    useEffect(() => {
        fetch('http://localhost/api/student/current/', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.detail != null && result.detail == 'Authentication credentials were not provided.') {
                    window.location.href = '/cas/login/'
                } else {
                    setIsLogged(true)
                    fetch('http://localhost/api/department/', {
                        method: 'GET',
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            setDepartments(result)
                        },
                            (error) => {
                                console.log(error);
                            })

                    fetch('http://localhost/api/student/current/id/', {
                        method: 'GET',
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            setStudent(result)
                            setEditable(result.editable)
                            if (result.department != null) {
                                setDepartement(result.department)
                                setOpened('parcours')
                                setProgress(34)
                            }

                            if (result.parcours != null) {
                                setParcours(result.parcours)
                                setOpened('obligatoires')
                                setProgress(67)
                            }

                            const tempMandatory = []
                            for (const index in result.mandatory_courses) {
                                tempMandatory.push(result.mandatory_courses[index].course.name)
                            }
                            setChoosenMandatoryCourses(tempMandatory)

                            const tempElective = []
                            for (const index in result.elective_courses) {
                                tempElective.push(result.elective_courses[index].course.name)
                            }
                            setChoosenElectiveCourses(tempElective)

                        },
                            (error) => {
                                console.log(error);
                            })
                }
            },
                (error) => {
                    console.log(error);
                })
    }, [])

    useEffect(() => {
        if (departement != -1) {
            fetch('http://localhost/api/parcours/?department=' + departement, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((result) => {
                    setParcoursList(result)
                },
                    (error) => {
                        console.log(error);
                    })
        }
    }, [departement])

    useEffect(() => {
        if (parcours != -1) {
            fetch('http://localhost/api/course/?parcours=' + parcours + '&on_list=true', {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((result) => {
                    setMandatoryCourses(result)
                },
                    (error) => {
                        console.log(error);
                    })

            fetch('http://localhost/api/student/current/courses/available', {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((result_available) => {
                    fetch('http://localhost/api/student/current/courses/available_electives', {
                        method: 'GET',
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            setElectiveCourses(result)
                            fetch('http://localhost/api/student/current/id/', {
                                method: 'GET',
                                credentials: "include",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then((res) => res.json())
                                .then((result) => {
                                    setStudent(result)
                                    const tempMandatory = []
                                    for (const index in result.mandatory_courses) {
                                        tempMandatory.push(result.mandatory_courses[index].course.name)
                                    }
                                    setChoosenMandatoryCourses(tempMandatory)

                                    const tempElective = []
                                    for (const index in result.elective_courses) {
                                        tempElective.push(result.elective_courses[index].course.name)
                                    }
                                    setChoosenElectiveCourses(tempElective)
                                    setCompatibleCourses(result_available)
                                    setEditable(result.editable)
                                },
                                    (error) => {
                                        console.log(error);
                                    })
                        },
                            (error) => {
                                console.log(error);
                            })
                },
                    (error) => {
                        console.log(error);
                    })

        }
    }, [parcours]);

    useEffect(() => {
        fetch('http://localhost/api/student/current/courses/available', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setCompatibleCourses(result)
                fetch('http://localhost/api/student/current/courses/available_electives', {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((res) => res.json())
                    .then((result) => {
                        setElectiveCourses(result)
                    },
                        (error) => {
                            console.log(error);
                        })
            },
                (error) => {
                    console.log(error);
                })
    }, [parcours, choosenElectiveCourses, choosenMandatoryCourses])

    return (
        <>
            {isLogged && (
                <div>
                    <TopBar title="Mon parcours" />
                    <Grid container columnGap={10} style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                        <Grid item md={8} xs={11} sm={11}>
                            <CustomProgressBar progress={progress} />
                        </Grid>
                        <Grid md={1}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', marginBottom: 4 }}>
                                <CircularProgress color={student.ects < required_ects ? "warning" : "success"} variant="determinate" value={student.ects > required_ects ? 100 : student.ects / required_ects * 100} size={120} thickness={3} />
                                <Box sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    width: 120,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: 18 }} variant="caption" component="div">{student.ects} / {required_ects} ECTS </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} style={{ marginTop: '10px', justifyContent: "center" }}>
                        <Grid item md={5} xs={11} sm={11}>
                            <Accordion expanded={opened === 'departement'} onChange={(e, expanded) => {
                                if (expanded) handleChange('departement')
                            }}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
                                    <Typography><b>Choix du département</b></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormControl fullWidth>
                                        <InputLabel>Département</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={departement}
                                            label="Département"
                                            onChange={(e) => {
                                                changeDepartment(e.target.value)
                                            }}
                                            placeholder="Département"
                                            disabled={!editable}
                                        >
                                            {getDepartmentItems()}
                                        </Select>
                                    </FormControl>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion disabled={progress < 33} expanded={opened === 'parcours'} onChange={(e, expanded) => {
                                if (expanded) handleChange('parcours')
                            }}>
                                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
                                    <Typography><b>Choix du parcours</b></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormControl fullWidth>
                                        <InputLabel>Parcours</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={parcours}
                                            label="Parcours"
                                            onChange={(e) => {
                                                changeParcours(e.target.value)
                                            }}
                                            placeholder="Parcours"
                                            disabled={!editable}
                                        >
                                            {getParcoursItems()}
                                        </Select>
                                    </FormControl>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion disabled={progress < 66} expanded={opened === 'obligatoires'} onChange={(e, expanded) => {
                                if (expanded) handleChange('obligatoires')
                            }}>
                                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={<ExpandMoreIcon />}>
                                    <Typography><b>Choix des cours obligatoires sur liste</b></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        {getMandatoryCourses()}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion disabled={progress < 66} expanded={opened === 'electifs'} onChange={(e, expanded) => {
                                if (expanded) handleChange('electifs')
                            }}>
                                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={<ExpandMoreIcon />}   >
                                    <Typography><b>Choix des cours électifs</b></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        {getElectiveCourses()}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                            {editable && (
                                <Button disabled={departement == -1 || parcours == -1} variant="contained" disableElevation style={{ marginTop: 10, float: "right" }} onClick={() => {
                                    setConfirmationDialogState(true)
                                }} endIcon={<SendIcon />}>
                                    Confirmer
                                </Button>
                            )}
                        </Grid>
                        <Grid item md={6} xs={11} sm={11}>
                            <div className="pdf-viewer">
                                <iframe key={mandatoryCourses + choosenElectiveCourses + choosenMandatoryCourses} src="http://localhost/api/student/current/timetable/" width="100%" height="500px" />
                            </div>
                        </Grid>
                    </Grid>
                    <Dialog
                        open={confirmationDialogState}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setConfirmationDialogState(false)}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>{"Confirmer mes choix de cours ?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Attention: Cette action est irréversible. Aucun changement ultérieur ne pourra être effectué sauf en cas de demande auprès de l'administration.
                            </DialogContentText>
                            <DialogContentText sx={{ color: "red", fontWeight: "bold" }}>
                                {student.ects < required_ects && "Vous n'avez que " + student.ects + " ECTS sur les " + required_ects + " requis."}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                validateForm()
                            }}>Confirmer</Button>
                            <Button onClick={() => {
                                setConfirmationDialogState(false)
                            }}>Annuler</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </>
    )
}