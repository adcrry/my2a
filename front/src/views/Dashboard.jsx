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
    const [departement, setDepartement] = useState('')


    const handleChange = (panel) => {
        if(opened != panel) setOpened(panel)
    }
    useEffect(() => {
        setProgress(80)
    }, [])
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
                                onChange={(e) => setDepartement(e.target.value)}
                                placeholder="Département"
                                >
                                <MenuItem value={'IMI'}>IMI</MenuItem>
                                <MenuItem value={'VET'}>VET</MenuItem>
                                <MenuItem value={'GCC'}>GCC</MenuItem>
                                <MenuItem value={'GMM'}>GMM</MenuItem>
                                <MenuItem value={'SEGF'}>SEGF</MenuItem>
                            </Select>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={opened==='parcours'} onChange={(e, expanded) => {
                    if(expanded) handleChange('parcours')
                }}>
                    <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography>Choix du parcours</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <FormControl fullWidth>
                            <InputLabel>Département</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={departement}
                                label="Département"
                                onChange={(e) => setDepartement(e.target.value)}
                                placeholder="Département"
                                >
                                <MenuItem value={'IMI'}>IMI</MenuItem>
                                <MenuItem value={'VET'}>VET</MenuItem>
                                <MenuItem value={'GCC'}>GCC</MenuItem>
                                <MenuItem value={'GMM'}>GMM</MenuItem>
                                <MenuItem value={'SEGF'}>SEGF</MenuItem>
                            </Select>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={opened==='obligatoires'} onChange={(e, expanded) => {
                    if(expanded) handleChange('obligatoires')
                }}>
                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Typography>Choix des cours obligatoires</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>Choisissez vos cours obligatoires:</Typography>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox onClick={() => {}}/>} label="Deep Learning (3 ECTS)" />
                        <FormControlLabel control={<Checkbox onClick={() => {}}/>} label="Machine Learning (5 ECTS)" />
                        <FormControlLabel control={<Checkbox onClick={() => {}}/>} label="Processus stochastiques et application (4 ECTS)" />
                        <FormControlLabel control={<Checkbox onClick={() => {}}/>} label="Technique de développement logiciel (3 ECTS)" />
                    </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={opened==='electifs'} onChange={(e, expanded) => {
                    if(expanded) handleChange('electifs')
                }}>
                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Typography>Choix des cours électifs</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                </Grid>
            </Grid>
            
        </>
    )
}