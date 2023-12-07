import {Box, Button, Fade, Modal, TextField, Typography} from "@mui/material";
import React, {useState} from "react";

interface UserAddModalProps {
    addUserInProjectOpen: boolean;
    closeAddUserInProjectModal(): void;
    CustomBackdrop(     props: any): JSX.Element;
    handleInviteUserInProject(     email: string): Promise<void>;
}

const UserAddModal: React.FC<UserAddModalProps> = ({    addUserInProjectOpen,
                                                        closeAddUserInProjectModal,
                                                        CustomBackdrop,
                                                        handleInviteUserInProject
                                                    }) => {
    const [email, setEmail] = useState('');
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={addUserInProjectOpen}
            onClose={closeAddUserInProjectModal}
            closeAfterTransition
            slots={{backdrop: CustomBackdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={addUserInProjectOpen}>
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: '#b79a84',
                    border: "1px solid #ded3c5",
                    borderRadius: "4px",
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography sx={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 20,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                    }}>
                        Add user
                    </Typography>

                    <TextField sx ={{
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
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button sx={{
                        marginTop: 2,
                        "&.MuiButtonBase-root": {
                            backgroundColor: '#ded3c5',
                            "&:hover": {backgroundColor: "#857366", color: "#FFFFFF"},
                            color: '#857366',
                        },
                    }}
                        onClick={() => handleInviteUserInProject(email)}
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
}

export default UserAddModal;