// import React from "react";
// import '../styles/styles.css'

// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';

// export default function NavBar(props) {
//     return (
//         <AppBar position="static" elevation={0}>
//             <Toolbar variant="dense">
//                 <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
//                     <MenuIcon />
//                 </IconButton>
//                 <Typography variant="h6" color="inherit" component="div">
//                     {props.title}
//                 </Typography>
//             </Toolbar>
//         </AppBar>
//     )

// }

import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar(props) {
    return (
        <AppBar position="static" elevation={0}>
            <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                    {props.title}
                </Typography>
                <nav>
                    <ul className="nav-links">
                        <li>
                            <Link to="/inspector" className="nav-link">
                                Étudiants
                            </Link>
                        </li>
                        <li>
                            <Link to="/inspector/upload" className="nav-link">
                                Imports
                            </Link>
                        </li>
                    </ul>
                </nav>
            </Toolbar>
        </AppBar>
    );
}
