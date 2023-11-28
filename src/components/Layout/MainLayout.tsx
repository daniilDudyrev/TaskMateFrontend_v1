import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Routes, BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import NotfoundPage from "../../features/NotfoundPage";

import MainPage from "../../features/MainPage";
// import image from "../../images/background.jpg";
import PersonalSpacePage from "../../features/pages/PersonalSpacePage";
import {ToastContainer} from "react-toastify";
import IssueDetailsPage from "../../features/pages/IssueDetailsPage";

const theme = createTheme();

export default function MainLayout() {
    return (
        <ThemeProvider theme={theme}>
            <ToastContainer></ToastContainer>
            <CssBaseline />
            <Container style={{padding: 0, display: "flex", maxWidth: "100%"}}>
                {/*<Router basename={import.meta.env.BASE_URL}>*/}
                    <main>
                        <Grid container spacing={5} sx={{ mt: 3 }}>
                        </Grid>
                    </main>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/SignIn"/>
                        <Route path="/SignUp"/>
                        <Route path="/issue/:id" element={<IssueDetailsPage/>}/>
                        <Route path="*" element={<NotfoundPage/>}/>
                        <Route path="/PersonalSpace" element={<PersonalSpacePage/>}/>
                    </Routes>
                {/*</Router>*/}
            </Container>
        </ThemeProvider>
    );
}