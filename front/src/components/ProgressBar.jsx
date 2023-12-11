import React from "react";
import '../styles/styles.css'
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Typography from '@mui/material/Typography';
import { TextField } from "@mui/material";


export default function CustomProgressBar(props){

    return(
        <ProgressBar percent={props.progress}>
            <Step>
                {({ accomplished }) => (
                <div
                    className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                    <Typography style={{marginTop: 50, textAlign: 'center'}}>Département</Typography>
                </div>
                )}
            </Step>
            <Step>
                {({ accomplished }) => (
                <div
                    className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                    <Typography style={{marginTop: 50, textAlign: 'center'}}>Parcours</Typography>
                </div>
                )}
            </Step>
            <Step>
                {({ accomplished }) => (
                <div
                    className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                    <Typography style={{marginTop: 50, textAlign: 'center'}}>Obligatoires</Typography>
                </div>
                )}
            </Step>
            <Step>
                {({ accomplished }) => (
                <div
                    className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                    <Typography style={{marginTop: 50, textAlign: 'center'}}>Électifs</Typography>
                </div>
                )}
            </Step>
        </ProgressBar>
    )

}