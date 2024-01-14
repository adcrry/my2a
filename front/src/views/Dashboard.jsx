import React, { useEffect, useState } from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Topbar from "../components/Topbar";
import CustomProgressBar from "../components/ProgressBar";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import Cookies from 'js-cookie';
import '../styles/styles.css'

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
                }} />} disabled={!editable || !isCourseCompitable(course.name) && !choosenMandatoryCourses.includes(course.name)} label={course.name + ' (' + course.ects / 10 + ' ECTS)'} />
            )
        })

    }

    const getElectiveCourses = () => {
        return electiveCourses.map((course) => {
            return (
                <FormControlLabel control={<Checkbox defaultChecked={choosenElectiveCourses.includes(course.name)} onClick={(e) => {
                    changeEnrollment(course.name, e.target.checked, 'elective')
                }} />} disabled={!editable || !isCourseCompitable(course.name) && !choosenElectiveCourses.includes(course.name)} label={course.name + ' (' + course.ects / 10 + ' ECTS)'} />
            )
        })

    }

    const changeDepartment = (code) => {
        setDepartement(code)
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
                                    console.log('DKSF,SDFS', result.editable)
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
                    <Topbar title="Mon parcours" />
                    <Grid container style={{ marginTop: '30px', alignItems: "center", justifyContent: "center" }}>
                        <Grid item md={10} xs={11} sm={11}>
                            <CustomProgressBar progress={progress} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: '80px', alignItems: "center", justifyContent: "center" }}>
                        <Grid item md={5} xs={11} sm={11}>
                            <Accordion expanded={opened === 'departement'} onChange={(e, expanded) => {
                                if (expanded) handleChange('departement')
                            }}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                    <Typography>Choix du département</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>Choisissez votre département de 2A: </Typography>
                                    <FormControl fullWidth style={{ marginTop: 20 }}>
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
                                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                    <Typography>Choix du parcours</Typography>
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
                                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                    <Typography>Choix des cours obligatoires sur liste</Typography>
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
                                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                    <Typography>Choix des cours électifs</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        {getElectiveCourses()}
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item md={6} xs={11} sm={11}>
                            <div className="pdf-viewer">
                                <iframe key={mandatoryCourses + choosenElectiveCourses + choosenMandatoryCourses} src="http://localhost/api/student/current/timetable/" width="100%" height="500px" />
                            </div>
                        </Grid>

                    </Grid>

                </div>
            )}
        </>
    )
}