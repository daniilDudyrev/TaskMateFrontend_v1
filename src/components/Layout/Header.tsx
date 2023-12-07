import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
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
            // backgroundImage: `url(${image})`,
            backgroundColor: '#ad998b',
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
                        backgroundColor: '#ded3c5',
                        "&:hover": {backgroundColor: "#b79a84", color: "#FFFFFF"},
                        color: '#857366',
                        border: "1px solid #ded3c5",
                        borderRadius: "4px",
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        textDecoration: 'none',
                        marginTop: 2,
                        marginRight: 5
                    }}
                    >
                    Sign Up
                </Button>
                <SignUpPopUpPage anchor={anchorSignUp} open={openSignUp} setOpen={setOpenSignUp} setAnchor={setAnchorSignUp} />
                <Button ref={setAnchorSignIn} onClick={() => setOpenSignIn((o) => !o)} type="button"
                        sx={{
                            backgroundColor: '#ded3c5',
                            "&:hover": {backgroundColor: "#b79a84", color: "#FFFFFF"},
                            color: '#857366',
                            border: "1px solid #ded3c5",
                            borderRadius: "4px",
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            textDecoration: 'none',
                            marginTop: 2,
                            marginRight: 5
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