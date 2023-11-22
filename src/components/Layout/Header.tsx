import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import image from "../../images/background.jpg";
import SignUpPopUpPage from "../../features/auth/SignUpPopUpPage";
import SignInPopUpPage from "../../features/auth/SignInPopUpPage";
import {Button} from "@mui/material";


function ResponsiveAppBar() {
    
    const [anchorSignUp, setAnchorSignUp] = React.useState<HTMLButtonElement | null>(null);
    const [openSignUp, setOpenSignUp] = React.useState(false);
    const [anchorSignIn, setAnchorSignIn] = React.useState<HTMLButtonElement | null>(null);
    const [openSignIn, setOpenSignIn] = React.useState(false);
    
    return (
        <AppBar position="fixed" sx={{
            backgroundImage: `url(${image})`,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: 70
        }}>
            <div style={{paddingLeft: 400, paddingTop: 10}}>
                <Typography sx={{
                    textAlign: "center", fontSize: 30, fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}>TaskMate</Typography>
            </div>
            <div>
                <Button ref={setAnchorSignUp} onClick={() => setOpenSignUp((o) => !o)} type="button"
                    sx={{
                        backgroundColor: "white", marginRight: 3, marginTop: 1.5, fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        textDecoration: 'none'
                    }}
                    >
                    Sign Up
                </Button>
                <SignUpPopUpPage anchor={anchorSignUp} open={openSignUp} setOpen={setOpenSignUp} setAnchor={setAnchorSignUp} />
                <Button ref={setAnchorSignIn} onClick={() => setOpenSignIn((o) => !o)} type="button"
                        sx={{
                            backgroundColor: "white", marginRight: 3, marginTop: 1.5, fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            textDecoration: 'none',
                        }}
                >
                    Sign In
                </Button>
                <SignInPopUpPage anchor={anchorSignIn} open={openSignIn} setOpen={setOpenSignIn} setAnchor={setAnchorSignIn} />
            </div>
        </AppBar>
    );
}

export default ResponsiveAppBar;