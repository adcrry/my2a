import React, { useEffect, useState } from "react";
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

export default function Dashboard() {
    
    const [progress, setProgress] = useState(0)
    const [opened, setOpened] = useState('')
    const [departments, setDepartments] = useState([])
    const [departement, setDepartement] = useState('')
    const [parcoursList, setParcoursList] = useState([])
    const [parcours, setParcours] = useState('')
    const [mandatoryCourses, setMandatoryCourses] = useState([])

    const handleChange = (panel) => {
        if(opened != panel) setOpened(panel)
    }

    const getDepartmentItems = () => {
        return departments.map((department) => {
            return (
                <MenuItem value={department.code}>{department.code}</MenuItem>
            )
        })
    }

    const getDepartmentIdByCode = (code) => {
        return departments.find((department) => department.code === code)?.id
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
                <FormControlLabel control={<Checkbox onClick={() => {}}/>} label={course.name + ' (' + course.ects + ' ECTS)'} />
            )
        })
    
    }

    useEffect(() => {
        fetch('http://localhost:8000/api/department/', {
            method: 'GET',
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
    }, [])

    useEffect(() => {
        fetch('http://localhost:8000/api/parcours/?department=' + getDepartmentIdByCode(departement), {
            method: 'GET',
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
    }, [departement])

    useEffect(() => {
        fetch('http://localhost:8000/api/course/?parcours=' + parcours + '&on_list=true' + getDepartmentIdByCode(departement), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result)
            setMandatoryCourses(result)
        },
            (error) => {
              console.log(error);
            })
    }, [parcours]);
    return (
        <>            
            <Topbar title="Accueil" />
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
                                    setDepartement(e.target.value)
                                    setOpened('parcours')
                                    setProgress(34)
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
                                    setParcours(e.target.value)
                                    setOpened('obligatoires')
                                    setProgress(67)
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
                            <FormControlLabel control={<Checkbox onClick={() => {}}/>} label="Cours 1 (3 ECTS)" />
                            <FormControlLabel control={<Checkbox onClick={() => {}}/>} label="Cours 2 (5 ECTS)" />
                            <FormControlLabel control={<Checkbox onClick={() => {}}/>} label="Processus stochastiques et application (4 ECTS)" />
                            <FormControlLabel control={<Checkbox onClick={() => {}}/>} label="Technique de développement logiciel (3 ECTS)" />
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                </Grid>
            </Grid>
            
        </>
    )
}