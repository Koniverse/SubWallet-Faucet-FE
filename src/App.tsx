import React from 'react';
import './App.css';
import {Outlet} from "react-router";
import BaseWeb from "./components/Layout/BaseWeb";

function App() {
    return (
        <BaseWeb>
            <Outlet/>
        </BaseWeb>
    );
}

export default App;
