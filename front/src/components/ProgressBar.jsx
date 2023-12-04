import React from "react";
import '../styles/styles.css'
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Typography from '@mui/material/Typography';

export default function CustomProgressBar(props){

    return(
        <ProgressBar percent={props.progress}>
            <Step>
                {({ accomplished }) => (
                <div
                    className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                    <Typography style={{marginTop: 50}} variant="h6" color="inherit" component="div">Choix du département</Typography>
                </div>
                )}
            </Step>
            <Step>
                {({ accomplished }) => (
                <div
                    className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                    <Typography style={{marginTop: 50}} variant="h6" color="inherit" component="div">Choix du parcours</Typography>
                </div>
                )}
            </Step>
            <Step>
                {({ accomplished }) => (
                <div
                    className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                    <Typography style={{marginTop: 50}} variant="h6" color="inherit" component="div">Choix des cours obligatoires</Typography>
                </div>
                )}
            </Step>
            <Step>
                {({ accomplished }) => (
                <div
                    className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                    <Typography style={{marginTop: 50}} variant="h6" color="inherit" component="div">Choix des cours electifs</Typography>
                </div>
                )}
            </Step>
        </ProgressBar>
    )

}