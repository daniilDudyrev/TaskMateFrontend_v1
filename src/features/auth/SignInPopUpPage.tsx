import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Container,
    Grid,
    Link, styled,
    TextField, Theme,
    Typography,
} from "@mui/material";
// import api from "../Api";
import {CSSTransition} from "react-transition-group";
import CloseIcon from "@mui/icons-material/Close";

import {UserApi} from "../../api";
import axios from "axios";

const userApi = new UserApi();


interface SignInForm {
    email: string;
    password: string;
}

interface SignInPopUpPageProps {
    anchor: HTMLButtonElement | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    setAnchor: (anchor: HTMLButtonElement | null) => void;
}


const SignInPopUpPage: React.FC<SignInPopUpPageProps> = ({open, setOpen}) => {
    const {register, handleSubmit} = useForm<SignInForm>();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onSubmit = async (data: SignInForm) => {
        try {
            const response = await userApi.userAuthenticationPost(data);
            localStorage.setItem("token", response.data.token!);
            navigate("/PersonalSpace");
        } catch (error) {
            // @ts-ignore
            setError('No such email or password!');
        }
    };
    return (
        <CSSTransition
            in={open}
            timeout={300}
            classNames="popup"
            unmountOnExit
        >
            <div className="popup-container">
                <div className="popup-content" style={{
                    backgroundColor: '#b79a84', border: "1px solid #ded3c5",
                    borderRadius: "4px",
                    boxShadow: '24px',
                }}>
                    <Button sx={{
                        backgroundColor: '#ded3c5',
                        "&:hover": {backgroundColor: "#857366", color: "#FFFFFF"},
                        color: '#857366',
                        width: 40,
                        height: 40,
                        fontSize: 25,
                        paddingRight: 4,
                        paddingBottom: 5
                    }} className="close-button" onClick={() => setOpen(false)}>X
                        {/*<CloseIcon sx={{ fontSize: 40}}/>*/}
                    </Button>
                    <Container component="main" maxWidth="xs">
                        <Typography component="h1" variant="h5">
                            Sign In
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{
                            mt: 1, backgroundColor: '#b79a84'
                        }}>
                            <TextField sx={{
                                '& label.Mui-focused': {
                                    color: 'white',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: '#857366',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#857366',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#857366',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#857366',
                                    },
                                },
                            }}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                autoComplete="email"
                                autoFocus
                                {...register("email")}
                            />
                            <TextField sx={{
                                '& label.Mui-focused': {
                                    color: 'white',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: '#857366',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#857366',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#857366',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#857366',
                                    },
                                },
                            }}
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                {...register("password")}
                            />
                            {error && (
                                <Typography variant="body2" color="error" gutterBottom>
                                    {error}
                                </Typography>
                            )}
                            <Button type="submit" sx={{
                                mt: 3, mb: 2, backgroundColor: '#ded3c5',
                                "&:hover": {backgroundColor: "#b79a84", color: "#FFFFFF"},
                                color: '#857366',
                                border: "1px solid #ded3c5",
                                borderRadius: "4px",
                            }}>
                                Sign In
                            </Button>
                        </Box>
                    </Container>
                </div>
            </div>
        </CSSTransition>
    );
}

const blue = {
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
};

const Button = styled('button')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${blue[500]};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 150ms ease;
  border: none;

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
  }

  &:focus-visible {
    box-shadow: 0 4px 20px 0 rgb(61 71 82 / 0.1), 0 0 0 5px rgb(0 127 255 / 0.5);
    outline: none;
  }
`;

export default SignInPopUpPage;