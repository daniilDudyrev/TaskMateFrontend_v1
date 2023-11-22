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
                    backgroundColor: '#b8cce4',
                    border: '2px solid white',
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

                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        onClick={() => handleInviteUserInProject(email)}
                        variant="contained"
                        color="primary"
                        sx={{marginTop: 2}}
                    >
                        Submit
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
}

export default UserAddModal;