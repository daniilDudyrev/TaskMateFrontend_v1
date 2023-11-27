import React, {useEffect, useState} from "react";
import {Box, Button, Fade, FormControl, InputLabel, Modal, Select, TextField, Typography} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {ProjectUserResponse} from "../../models";
import {UserApi} from "../../apis/user-api";
import {AxiosRequestConfig} from "axios";

const userApi = new UserApi();

interface IssueAddModalProps {
    issueAddOpen: boolean,

    closeIssueAddModal(): void,

    CustomBackdrop(props: any): JSX.Element,

    projectUsers: ProjectUserResponse[],

    handleAddIssue(priority: number, difficulty: number, name: string, description: string, performerId: string, startDate: Date, endDate: Date): Promise<void>
}

const IssueAddModal: React.FC<IssueAddModalProps> = ({
                                                         issueAddOpen,
                                                         closeIssueAddModal,
                                                         CustomBackdrop,
                                                         projectUsers,
                                                         handleAddIssue
                                                     }) => {
    const [priority, setPriority] = useState(1);
    const [difficulty, setDifficulty] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [performerId, setPerformerId] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userEmails, setUserEmails] = useState({});
    const token = localStorage.getItem("token");

    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": 'skip-browser-warning'
        },
    }
    useEffect(() => {
        const fetchUserEmails = async () => {
            const emails = {};
            for (const projectUser of projectUsers) {
                try {
                    const response = await userApi.userGetByIdGet(projectUser.userId, requestConfig);
                    // @ts-ignore
                    emails[projectUser.userId] = response.data.email;
                } catch (error) {
                    console.error(`Error fetching email for user ${projectUser.userId}:`, error);
                }
            }

            setUserEmails(emails);
        };

        fetchUserEmails();
    }, [projectUsers]);

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={issueAddOpen}
            onClose={closeIssueAddModal}
            closeAfterTransition
            slots={{backdrop: CustomBackdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={issueAddOpen}>
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
                        Add issue
                    </Typography>

                    <TextField
                        label="Priority"
                        type="number"
                        required={true}
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value, 10))}
                    />

                    <TextField
                        label="Difficulty"
                        type="number"
                        required={true}
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value, 10))}
                    />

                    <TextField
                        label="Name"
                        required={true}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        required={true}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        label="Date"
                        type="date"
                        required={true}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}

                    />
                    <FormControl
                        required={true}>
                        <InputLabel>Performer</InputLabel>
                        <Select
                            value={performerId}
                            onChange={(e) => setPerformerId(e.target.value)}
                        >
                            {projectUsers.map((projectUser) => (
                                <MenuItem key={projectUser.userId} value={projectUser.userId}>
                                    {/*@ts-ignore*/}
                                    {userEmails[projectUser.userId] || projectUser.userId}
                                </MenuItem>
                            ))}


                        </Select>
                    </FormControl>
                    <Button
                        onClick={() => handleAddIssue(priority, difficulty, name, description, performerId, new Date(Date.now()), new Date(endDate))}
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
export default IssueAddModal;