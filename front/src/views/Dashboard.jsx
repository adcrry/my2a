import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { List, Paper, Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Topbar from "../components/Topbar";
import CustomProgressBar from "../components/ProgressBar";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import Cookies from 'js-cookie';

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

    const handleChange = (panel) => {
        if(opened != panel) setOpened(panel)
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

    const getMandatoryCourses = () => {
        return mandatoryCourses.map((course) => {
            return (
                <FormControlLabel control={<Checkbox defaultChecked={choosenMandatoryCourses.includes(course.name)} onClick={(e) => {
                    changeEnrollment(course.name, e.target.checked, 'mandatory')
                }}/>} label={course.name + ' (' + course.ects + ' ECTS)'} />
            )
        })
    
    }

    const getElectiveCourses = () => {
        return electiveCourses.map((course) => {
            return (
                <FormControlLabel control={<Checkbox onClick={(e) => {
                    changeEnrollment(course.name, e.target.checked, 'elective')
                }}/>} label={course.name + ' (' + course.ects + ' ECTS)'} />
            )
        })
    
    }

    const changeDepartment = (code) => {
        setDepartement(code)
        fetch('http://localhost:8000/api/student/current/department/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({department: code}),
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
        fetch('http://localhost:8000/api/student/current/parcours/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({parcours: code}),
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
        fetch('http://localhost:8000/api/student/current/enroll/', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({course: course, is_enrolled: is_enrolled, category: category}),
        })
        .then((res) => res.json())
        .then((result) => {

        },
        (error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetch('http://localhost:8000/api/department/', {
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
        
        fetch('http://localhost:8000/api/student/current/id/', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((result) => {
            if(result.department != null){
                setDepartement(result.department)
                setOpened('parcours')
                setProgress(34)
            } 

            if(result.parcours != null){
                setParcours(result.parcours)
                setOpened('obligatoires')
                setProgress(67)
            }
             
            const tempMandatory = []
            for(const index in result.mandatory_courses){
                tempMandatory.push(result.mandatory_courses[index].course.name)
            }
            setChoosenMandatoryCourses(tempMandatory)

            const tempElective = []
            for(const index in result.elective_courses){
                tempElective.push(result.elective_courses[index].course.name)
            }
            setChoosenElectiveCourses(tempElective)

        },
        (error) => {
            console.log(error);
        })
    }, [])

    useEffect(() => {
        if(departement != -1) {
            fetch('http://localhost:8000/api/parcours/?department=' + departement, {
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
        if(parcours != -1) {
            fetch('http://localhost:8000/api/course/?parcours=' + parcours + '&on_list=true', {
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
        }
    }, [parcours]);

    return (
        <>            
            <Topbar title="Mon parcours" />
            <Grid container style={{marginTop: '30px',  alignItems:"center", justifyContent:"center"}}>
                <Grid item md={10} xs={12} sm={12}>
                    <CustomProgressBar progress={progress} />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '80px',  alignItems:"center", justifyContent:"center"}}>
            <Grid item md={10} xs={12} sm={12}>

            <Accordion expanded={opened==='departement'} onChange={(e, expanded) => {
                if(expanded) handleChange('departement')
            }}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Choix du département</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Choisissez votre département de 2A: </Typography>
                        <FormControl fullWidth style={{marginTop: 20}}>
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
                                >
                                {getDepartmentItems()}
                            </Select>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Accordion disabled={progress < 33} expanded={opened==='parcours'} onChange={(e, expanded) => {
                    if(expanded) handleChange('parcours')
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
                                onChange={(e) =>{
                                    changeParcours(e.target.value)
                                }}
                                placeholder="Parcours"
                                >
                                {getParcoursItems()}
                            </Select>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Accordion disabled={progress < 66} expanded={opened==='obligatoires'} onChange={(e, expanded) => {
                    if(expanded) handleChange('obligatoires')
                }}>
                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Typography>Choix des cours obligatoires</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {getMandatoryCourses()}                            
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion disabled={progress < 66} expanded={opened==='electifs'} onChange={(e, expanded) => {
                    if(expanded) handleChange('electifs')
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
            </Grid>
            
        </>
    )
}