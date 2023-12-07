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
    handleAddIssue(priority: number, difficulty: number, name: string, description: string, performerId: string, startDate: Date, endDate: Date): Promise<void>,
    calendarDate: Date
}

const IssueAddModalCalendar: React.FC<IssueAddModalProps> = ({
                                                         issueAddOpen,
                                                         closeIssueAddModal,
                                                         CustomBackdrop,
                                                         projectUsers,
                                                         handleAddIssue,
                                                         calendarDate
                                                     }) => {
    const [priority, setPriority] = useState(1);
    const [difficulty, setDifficulty] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [performerId, setPerformerId] = useState('');
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
                if (projectUser.userId != undefined) {
                    try {
                        const response = await userApi.userGetByIdGet(projectUser.userId, requestConfig);
                        // @ts-ignore
                        emails[projectUser.userId] = response.data.email;
                    } catch (error) {
                        console.error(`Error fetching email for user ${projectUser.userId}:`, error);
                    }
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
                        Add issue
                    </Typography>

                    <TextField sx ={{
                        '& label.Mui-focused': {
                            color: '#857366',
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
                        label="Priority"
                        type="number"
                        required={true}
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value, 10))}
                    />
                    <TextField sx ={{
                        '& label.Mui-focused': {
                            color: '#857366',
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
                        label="Difficulty"
                        type="number"
                        required={true}
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value, 10))}
                    />
                    <TextField sx ={{
                        '& label.Mui-focused': {
                            color: '#857366',
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
                        label="Name"
                        required={true}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField sx ={{
                        '& label.Mui-focused': {
                            color: '#857366',
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
                        label="Description"
                        required={true}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <FormControl sx ={{
                        '& label.Mui-focused': {
                            color: '#857366',
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
                    }}>
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
                        onClick={() => {handleAddIssue(priority, difficulty, name, description, performerId, new Date(Date.now()), calendarDate); closeIssueAddModal()}}
                        variant="contained"
                        color="primary"
                        sx={{marginTop: 2,
                            "&.MuiButtonBase-root": {
                                backgroundColor: '#ded3c5',
                                "&:hover": {backgroundColor: "#857366", color: "#FFFFFF"},
                                color: '#857366',
                            },}}
                    >
                        Submit
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
}
export default IssueAddModalCalendar;