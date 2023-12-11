import React from 'react';

import '../components/Topbar'
import Topbar from '../components/Topbar';

export default function HomeView(){

    return (
        <div style={{width: "100%"}}>
            <Topbar title="Accueil" />
        </div>
    )
}