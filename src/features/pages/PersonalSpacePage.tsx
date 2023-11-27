import {
    Backdrop,
    Button,
    Collapse,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {IssueApi, ProjectApi, UserApi} from "../../api";
import {AxiosRequestConfig} from "axios";
import {useNavigate} from "react-router-dom";
import {Invite, IssueRequest, IssueResponse, ProjectResponse, User, ProjectUserResponse} from "../../models";
import FolderIcon from '@mui/icons-material/Folder';
import PersonalSpacePageIssuesCalendar from './PersonalSpacePageIssuesCalendar';
// import image from "../../images/background.jpg";
import ListIcon from '@mui/icons-material/List';
import TaskIcon from '@mui/icons-material/SpaceDashboardSharp';
import CalendarIcon from '@mui/icons-material/Event';
import PersonalSpacePageIssuesList from "./PersonalSpacePageIssuesList";
import {Status} from "../../models";
import MenuItem from "@mui/material/MenuItem";
import PersonalSpacePageIssuesBoard from "./PersonalSpacePageIssuesBoard";
import '../../index.css';
import Menu from "@mui/material/Menu";
import NotificationsIcon from '@mui/icons-material/Notifications';
import * as signalR from "@microsoft/signalr";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import IssueAddModal from "../modals/IssueAddModal";
import UserAddModal from "../modals/UserAddModal";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const projectApi = new ProjectApi();
const issueApi = new IssueApi();
const userApi = new UserApi();


const PersonalSpacePage: React.FC = () => {
    const [projectName, setProjectName] = useState<string>('');
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [issues, setIssues] = useState<IssueResponse[]>([]);
    const navigate = useNavigate();
    const [open, setOpen] = useState(localStorage.getItem('sidebarOpen') === 'true')
    const [openAddProject, setOpenAddProject] = useState(localStorage.getItem('addProjectOpen') === 'false');
    const [selectedProject, setSelectedProject] = useState<string | null>(localStorage.getItem('selectedProject') || null);
    const [selectedMenu, setSelectedMenu] = useState(localStorage.getItem('selectedMenu') || 'list');
    const [issueAddOpen, setIssueAddOpen] = useState(false);
    const [creatorId, setCreatorId] = useState('');
    // const [priority, setPriority] = useState(1);
    // const [difficulty, setDifficulty] = useState(1);
    // const [name, setName] = useState('');
    // const [performerId, setPerformerId] = useState('');
    // const [endDate, setEndDate] = useState('');
    const [projectUsers, setProjectUsers] = useState<ProjectUserResponse[]>([]);
    const [addUserInProjectOpen, setAddUserInProjectOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(null);
    const [performedIssues, setPerformedIssues] = useState<IssueResponse[]>([]);
    const anchorElRef = useRef(null);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [isInvitesOpen, setIsInvitesOpen] = useState(null);
    const [initiatorEmails, setInitiatorEmails] = useState<string[]>([]);
    const [inviteDetails, setInviteDetails] = useState<{ email: string; projectName: string; }[]>([]);
    const token = localStorage.getItem("token");
    // const [connection, setConnection] = useState();
    const [inviteCountUpdated, setInviteCountUpdated] = useState(0);


    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    // const connect = async () => {
    //     try {
    //         const connection = new HubConnectionBuilder()
    //             .withUrl("https://localhost:44382/chat", {
    //                 skipNegotiation: true,
    //                 transport: signalR.HttpTransportType.WebSockets  
    //             })
    //             .configureLogging(LogLevel.Debug)
    //             .build();
    //
    //         connection.on("ReceiveProjectInvite", async (userId, projectId) => {
    //             console.log("Received project invitation for project:", projectId);
    //             const response = await projectApi.projectGetInvitesForInvitedGet(userId, requestConfig);
    //             setInvites(response.data || [])
    //         });
    //
    //         connection.onclose(e => {
    //             setConnection();
    //         });
    //
    //         await connection.start();
    //         setConnection(connection);
    //
    //     }
    //     catch(error) {
    //         console.log(error);
    //     }
    // }
    //


    // useEffect(() => {
    //     const connect = new signalR.HubConnectionBuilder()
    //         .withUrl("http://localhost:5222/projecthub")
    //         .withAutomaticReconnect()
    //         .build();
    //     setConnection(connect);
    // }, []);


    // useEffect(() => {
    //     if(connection) {
    //         connection
    //             .start()
    //             .then(() => {
    //                 connection.on("ReceiveProjectInvite", async (userId, projectId) => {
    //                     console.log("Received project invitation for project:", projectId);
    //                     const response = await projectApi.projectGetInvitesForInvitedGet(userId, requestConfig);
    //                     setInvites(response.data || [])
    //                 });
    //             })
    //             .catch((error) => {
    //                 console.error("SignalR connection error: " + error);
    //             });
    //
    //         console.log(connection)
    //     }
    // }, [connection]);

    //
    // const connect = new signalR.HubConnectionBuilder()
    //     .withUrl("http://localhost:5222/projecthub")
    //     .withAutomaticReconnect()
    //     .build();
    // // setConnection(connect);
    //
    // connect.on("ReceiveProjectInvite", async (userId, projectId) => {
    //     console.log("Received project invitation for project:", projectId);
    //     const response = await projectApi.projectGetInvitesForInvitedGet(userId, requestConfig);
    //     setInvites(response.data || [])
    //     console.log(response.data)
    // });
    //
    // console.log(connect)
    //
    // connect
    //     .start()
    //     .then(() => {
    //         if (connect.connectionId) {
    //             // connect.invoke("ReceiveProjectInvite", connect.connectionId);
    //         }
    //         // connect.on("ReceiveProjectInvite", async (userId, projectId) => {
    //         //     console.log("Received project invitation for project:", projectId);
    //         //     const response = await projectApi.projectGetInvitesForInvitedGet(userId, requestConfig);
    //         //     setInvites(response.data || [])
    //         // });
    //     })
    //     .catch((error) => {
    //         console.error("SignalR connection error: " + error);
    //     });

    // console.log(connect)


    useEffect(() => {
        localStorage.setItem('sidebarOpen', open.toString());
    }, [open]);

    useEffect(() => {
        localStorage.setItem('addProjectOpen', open.toString());
    }, [open]);

    useEffect(() => {
        const fetchPojects = async () => {
            if (token) {
                const response = await projectApi.projectGetAllByUserIdGet(requestConfig);
                const data = response.data;
                setProjects(data.projects || []);
                console.log(data)
            } else {
                navigate('/')
            }
        };
        fetchPojects();
    }, []);


    useEffect(() => {
        const fetchInvites = async () => {
            const userResponse = await userApi.userGetCurrentGet(requestConfig);
            const userData = userResponse.data;
            const response = await projectApi.projectGetInvitesForInvitedGet(userData.id, requestConfig);
            const data = response.data;
            if (data.length > 0) {
                const notAcceptedInvites = data.filter(invite => invite.isAccepted == false);
                setInvites(notAcceptedInvites);
                setInviteCountUpdated(notAcceptedInvites.length);
            } else {
                setInviteCountUpdated(0);
            }

        };
        fetchInvites();
    }, []);

    useEffect(() => {
        const fetchInviteDetails = async () => {
            const details = await Promise.all(
                invites.map(async (invite) => {
                    const emailResponse = await userApi.userGetByIdGet(invite.initiatorUserId!, requestConfig);
                    const email = emailResponse.data.email!;

                    const projectResponse = await projectApi.projectGetByIdGet(invite.projectId!, requestConfig);
                    const projectName = projectResponse.data.name!;

                    return {email, projectName};
                })
            );
            setInviteDetails(details);
        };

        fetchInviteDetails();
    }, [invites]);

    useEffect(() => {
        const fetchInitiatorEmails = async () => {
            const emails = await Promise.all(
                invites.map(async (invite) => {
                    const response = await userApi.userGetByIdGet(invite.initiatorUserId!, requestConfig);
                    return response.data.email;
                })
            );

            // @ts-ignore
            setInitiatorEmails(emails);
        };
        fetchInitiatorEmails();
    }, []);

    const openIssueAddModal = () => {
        setIssueAddOpen(true);
    };

    const closeIssueAddModal = () => {
        setIssueAddOpen(false);
    };

    const openAddUserInProjectModal = () => {
        setAddUserInProjectOpen(true);
    };

    const closeAddUserInProjectModal = () => {
        setAddUserInProjectOpen(false);
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem('selectedProject');
            localStorage.removeItem('issues');
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddProject = async () => {
        try {
            const response = await projectApi.projectAddPost(projectName, requestConfig);
            setProjectName('');
            const updatedResponse = await projectApi.projectGetAllByUserIdGet(requestConfig);
            const updatedData = updatedResponse.data;
            setProjects(updatedData.projects || []);
        } catch (error) {
            console.error('Error while adding project:', error);
        }
    };

    const handleAddIssue = async (priority: number,
                                  difficulty: number,
                                  name: string,
                                  description: string,
                                  performerId: string,
                                  startDate: Date,
                                  endDate: Date
    ) => {
        if (selectedProject) {
            const newIssue: IssueRequest = {
                creatorId: creatorId,
                priority: priority,
                difficulty: difficulty,
                name: name,
                description: description,
                performerId: performerId,
                startDate: startDate,
                endDate: endDate,
                status: Status.NUMBER_1,
                projectId: selectedProject
            }
            await issueApi.issueAddPost(newIssue, requestConfig);
            const response = await issueApi.issueGetAllByProjectIdGet(selectedProject);
            const data = response.data;
            setIssues(data.issues || []);
        }

        closeIssueAddModal();
    };

    const handleDeleteIssue = async (issueId: string) => {
        await issueApi.issueDeleteByIdDelete(issueId, requestConfig);
        if (selectedProject) {
            const response = await issueApi.issueGetAllByProjectIdGet(selectedProject);
            const data = response.data;
            setIssues(data.issues || []);
        }
    }

    const handleAcceptInvite = async (projectId: string, initiatorId: string) => {
        const userResponse = await userApi.userGetCurrentGet(requestConfig);
        const userData = userResponse.data;
        await projectApi.projectAcceptInvitePost(projectId, userData.id, initiatorId, requestConfig)
        await projectApi.projectAddUserPost(projectId, userData.id, initiatorId, requestConfig);
        const response = await projectApi.projectGetAllByUserIdGet(requestConfig);
        const data = response.data;
        setProjects(data.projects || []);
        setInvites((prevInvites) =>
            prevInvites.filter((invite) => invite.projectId !== projectId && invite.initiatorUserId !== initiatorId)
        );
        handleInvitesClose();
    }

    const handleDeclineInvite = async (projectId: string, initiatorId: string) => {
        const userResponse = await userApi.userGetCurrentGet(requestConfig);
        const userData = userResponse.data;
        await projectApi.projectDeclineInvitePost(projectId, userData.id, initiatorId, requestConfig)
        handleInvitesClose();
    }

    // @ts-ignore
    const handleInvitesOpen = (event) => {
        setIsInvitesOpen(event.currentTarget);
    }

    const handleInvitesClose = () => {
        setIsInvitesOpen(null);
    };


    const handleInviteUserInProject = async (email: string) => {
        try {
            const userResponse = await userApi.userGetByEmailGet(email, requestConfig);
            const userData = userResponse.data;
            await projectApi.projectInviteUserPost(selectedProject!, userData.id, requestConfig);

            // if (connect) {
            //     connect.on("ReceiveProjectInvite", async (userId, projectId) => {
            //         console.log("Received project invitation for project:", projectId);
            //         const response = await projectApi.projectGetInvitesForInvitedGet(userId, requestConfig);
            //         setInvites(response.data || [])
            //     });
            // }

        } catch (error) {
            toast.error('You have already sent this user an invitation or user already in project.');
        }
        closeAddUserInProjectModal();
    };

    useEffect(() => {
        const getCreatorId = async () => {
            try {
                console.log(token)
                const response = await userApi.userGetCurrentGet(requestConfig);
                const data = response.data;
                if (data.id) {
                    setCreatorId(data.id);
                }
            } catch (error) {
                console.error('Error while getting user id:', error);
            }
        };

        getCreatorId();
    }, [creatorId]);


    useEffect(() => {
        localStorage.setItem('selectedMenu', selectedMenu);
    }, [selectedMenu]);

    useEffect(() => {
        const storedMenu = localStorage.getItem('selectedMenu');
        if (storedMenu) {
            setSelectedMenu(storedMenu);
        }
    }, []);

    const handleMenuClick = (menu: string) => {
        setSelectedMenu(menu);
    };
    useEffect(() => {
        const loadIssuesForProject = async (projectId: string) => {
            try {
                const response = await issueApi.issueGetAllByProjectIdGet(projectId);
                const data = response.data;
                setIssues(data.issues || []);
                localStorage.setItem('issues', JSON.stringify(data.issues || []));
            } catch (error) {
                console.error('Error while getting issues:', error);
            }
        };
        if (selectedProject) {
            loadIssuesForProject(selectedProject);
        }
    }, [selectedProject]);

    useEffect(() => {
        const savedIssues = localStorage.getItem('issues');
        if (savedIssues) {
            setIssues(JSON.parse(savedIssues));
        }
    }, []);

    useEffect(() => {
        const loadProjectUsers = async (projectId: string) => {
            try {
                const response = await projectApi.projectGetUsersByIdGet(projectId);
                const data = response.data;
                setProjectUsers(data.projectUsers || []);
                console.log("projectUsers");
                console.log(data.projectUsers);
            } catch (error) {
                console.error('Error trying get users in project:', error);
            }
        };
        if (selectedProject) {
            loadProjectUsers(selectedProject);
        }
    }, [selectedProject]);

    useEffect(() => {
        projectUsers.forEach(async (projectUser) => {
            try {
                const response = await userApi.userGetByIdGet(projectUser.userId, requestConfig);
                const data = response.data;
                setUserData((prevData) => ({...prevData, [projectUser.userId as string]: data}));
            } catch (error) {
                console.error("Error trying to get user in project:", error);
            }
        });
    }, [projectUsers]);


    // @ts-ignore
    const handleUserDetailsClick = async (event, userId: string) => {
        const response = await issueApi.issueGetAllByPerformerIdGet(userId, requestConfig);
        const data = response.data;
        const issuesInProject = data.issues?.filter(issue => issue.projectId == selectedProject)
        console.log(issuesInProject)
        setPerformedIssues(issuesInProject || [])
        if (anchorElRef.current) {
            setIsUserDetailsOpen(anchorElRef.current);
        }
    };

    const handleUserDetailsClose = () => {
        setIsUserDetailsOpen(null);
    };

    return (
        <div className="mainPersonalSpaceDiv">
            <div className="subMainPersonalSpaceDiv" style={{
                // backgroundImage: `url(${image})`,
                width: open ? "90vw" : "100vw",
                transform: open ? "translateX(275px)" : "translateX(0)",
            }}>
                <Button className="buttonLeftMenuOpen"
                        sx={{
                            display: open ? 'none' : 'block'
                        }}
                        color="primary"
                        onClick={() => setOpen(!open)}
                        startIcon={open ? <span className="material-icons"
                                                style={{
                                                    transform: 'rotateY(180deg)',
                                                    fontSize: '35px'
                                                }}> double_arrow </span> :
                            <span className="material-icons"
                                  style={{fontSize: '35px', paddingLeft: 10}}> double_arrow </span>}
                >

                </Button>
                <Typography className="personalSpaceHeaders"
                            sx={{
                                borderBottom: selectedMenu === 'list' ? '2px solid white' : '2px solid transparent',
                                '&:hover': {
                                    cursor: 'pointer',
                                    borderBottom: '2px solid white'
                                },
                            }}
                            onClick={() => handleMenuClick('list')}
                >
                    <ListIcon style={{fontSize: 40}}/> List
                </Typography>
                <div
                    style={{
                        borderRight: "1px solid white",
                        marginLeft: 10,
                        marginTop: 18,
                        height: "50%",
                    }}
                ></div>
                <Typography className="personalSpaceHeaders"
                            sx={{
                                borderBottom: selectedMenu === 'board' ? '2px solid white' : '2px solid transparent',
                                '&:hover': {
                                    cursor: 'pointer',
                                    borderBottom: '2px solid white'
                                },
                            }}
                            onClick={() => handleMenuClick('board')}
                >
                    <TaskIcon style={{fontSize: 35}}/> Board
                </Typography>
                <div
                    style={{
                        borderRight: "1px solid white",
                        marginLeft: 10,
                        marginTop: 18,
                        height: "50%",
                    }}
                ></div>
                <Typography className="personalSpaceHeaders"
                            sx={{
                                borderBottom: selectedMenu === 'calendar' ? '2px solid white' : '2px solid transparent',
                                '&:hover': {
                                    cursor: 'pointer',
                                    borderBottom: '2px solid white'
                                },
                            }}
                            onClick={() => handleMenuClick('calendar')}
                >
                    <CalendarIcon style={{fontSize: 35}}/> Calendar
                </Typography>
                <div
                    style={{
                        borderRight: "1px solid white",
                        marginLeft: 10,
                        marginTop: 18,
                        height: "50%",
                    }}
                ></div>
                <div style={{
                    position: 'absolute' as 'absolute',
                    top: '25%',
                    right: '15%',
                    display: 'flex',
                    flexDirection: 'row',
                    cursor: 'pointer'
                }} onClick={(event) => handleInvitesOpen(event)}
                >
                    {inviteCountUpdated > 0 && (
                        <Typography className="invitesCount">
                            {inviteCountUpdated}
                        </Typography>
                    )}
                    <NotificationsIcon sx={{color: 'white', fontSize: 50}}></NotificationsIcon>
                </div>
                <Menu
                    disableScrollLock={true}
                    anchorEl={isInvitesOpen}
                    open={Boolean(isInvitesOpen)}
                    onClose={handleInvitesClose}
                    sx={{
                        mt: "1px",
                        "& .MuiMenu-paper": {
                            backgroundColor: "#acc4e4",
                            border: "1px solid white",
                            boxShadow: 'none',
                            marginRight: 10,
                            borderRadius: "10px",
                            padding: "10px",
                            display: 'flex',
                            flexDirection: "row",
                            alignItems: 'center',
                            zIndex: 10000
                        },
                    }}
                >
                    {invites.length > 0 ? (
                        inviteDetails.map((detail, index) => (
                            <MenuItem
                                sx={{
                                    "& .MuiMenuItem-root": {
                                        cursor: 'none',
                                    },
                                    "& .MuiButtonBase-root": {
                                        backgroundColor: "white",
                                        // backgroundColor: "transparent",
                                        transition: "background-color 0.3s",
                                        marginRight: 4,
                                        "&:hover": {
                                            backgroundColor: "#acc4e4",
                                        },
                                    },
                                    textAlign: 'center',
                                    height: 100,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'default',
                                }}
                                key={invites[index].id}
                            >
                                <Typography
                                    sx={{
                                        alignItems: 'center',
                                        color: 'white',
                                    }}
                                >
                                    {`You were invited by a ${detail.email} to the project ${detail.projectName}`}
                                </Typography>
                                <div>
                                    <Button
                                        onClick={() => handleAcceptInvite(invites[index].projectId!, invites[index].initiatorUserId!)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        onClick={() => handleDeclineInvite(invites[index].projectId!, invites[index].initiatorUserId!)}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem sx={{
                            cursor: 'default',
                            color: 'white'
                        }}>No invites</MenuItem>
                    )}
                </Menu>
                <div style={{
                    position: 'absolute' as 'absolute',
                    top: '40%',
                    right: '5%',
                    backgroundColor: 'white'
                }}><Button onClick={handleLogout}>Logout</Button></div>
            </div>
            <div
                style={{display: "flex", minHeight: '100vh'}}
            >
                <Drawer sx={{zIndex: 1000}}
                        anchor="left"
                        open={open}
                        onClose={() => setOpen(false)}
                        variant="persistent"
                >
                    <List>
                        <Button
                            sx={{marginLeft: 20, backgroundColor: "#b8cce4", color: "#64B5F6" ,"&:hover": {backgroundColor: "#81a4cf"}}}

                            color="primary"
                            onClick={() => setOpen(!open)}
                            startIcon={open ? <span className="material-icons" style={{
                                    transform: 'rotateY(180deg)',
                                    fontSize: '35px',
                                    paddingRight: 10
                                }}> double_arrow </span> :
                                <span className="material-icons" style={{fontSize: '35px'}}> double_arrow </span>}
                        >

                        </Button>
                        <Collapse in={open}>
                            <Typography variant="h4" gutterBottom sx={{
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                textDecoration: 'none',
                            }}>
                                Projects
                            </Typography>
                            {projects.map((project) => (
                                <ListItem key={project.projectId}
                                          onClick={() => {
                                              if (project.projectId) {
                                                  setSelectedProject(project.projectId);
                                                  localStorage.setItem('selectedProject', project.projectId);
                                              }
                                          }}
                                          sx={{
                                              backgroundColor: selectedProject === project.projectId ? '#f2f2f2' : 'transparent',
                                              '&:hover': {
                                                  cursor: 'pointer',
                                                  backgroundColor: '#f2f2f2'
                                              },
                                          }}>
                                    <ListItemIcon>
                                        <FolderIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={project.name} sx={{
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        textDecoration: 'none',
                                    }}/>
                                </ListItem>
                            ))}
                            <Button
                                type="button"
                                onClick={() => setOpenAddProject(!openAddProject)}
                                sx={{
                                    backgroundColor: "#b8cce4",
                                    marginTop: 2,
                                    marginLeft: 0,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    textDecoration: 'none',
                                }}
                            >
                                Add project
                            </Button>
                            <Collapse in={openAddProject}>
                                <div style={{flex: 1}}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="projectName"
                                        label="Project name"
                                        autoComplete="projectName"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddProject}
                                        sx={{
                                            backgroundColor: "#b8cce4",
                                            marginTop: 1.5,
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </Collapse>
                            <Typography variant="h5" gutterBottom sx={{
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                textDecoration: 'none',
                                marginTop: 10
                            }}>
                                Team
                            </Typography>
                            <List component="nav">
                                {projectUsers.map((projectUser) => (
                                    <div key={projectUser.userId}>
                                        {/*@ts-ignore*/}
                                        {userData[projectUser.userId] && (
                                            <Typography
                                                sx={{
                                                    cursor: "pointer"
                                                }}
                                                ref={anchorElRef}
                                                // @ts-ignore
                                                onClick={(event) => handleUserDetailsClick(event, projectUser.userId!)}>{userData[projectUser.userId].email}</Typography>
                                        )}
                                    </div>
                                ))}
                            </List>

                        </Collapse>
                        <Menu
                            disableScrollLock={true}
                            anchorEl={isUserDetailsOpen}
                            open={Boolean(isUserDetailsOpen)}
                            onClose={handleUserDetailsClose}
                            sx={{
                                mt: "1px",
                                "& .MuiMenu-paper": {
                                    backgroundColor: "#acc4e4",
                                    border: "1px solid white",
                                    boxShadow: 'none',
                                    marginLeft: 5,
                                    borderRadius: "10px",
                                    padding: "10px",
                                    display: 'flex',
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    zIndex: 10000
                                },
                            }}
                        >
                            {performedIssues.filter(issue => issue.status == 1).length > 0 ? (
                                performedIssues.map((performedIssue) => (
                                    performedIssue.projectId == selectedProject && performedIssue.status == 1 && (
                                        <MenuItem sx={{
                                            textAlign: 'center',
                                            cursor: 'default'
                                        }} key={performedIssue.issueId}>
                                            <Typography sx={{
                                                alignItems: 'center',
                                                color: 'white'
                                            }}>{performedIssue.name}</Typography>
                                        </MenuItem>
                                    )
                                ))
                            ) : (
                                <MenuItem sx={{
                                    color: 'white',
                                    cursor: 'default'
                                }}>No issues in progress</MenuItem>
                            )}
                        </Menu>
                    </List>

                </Drawer>
                {selectedMenu !== 'board' ? (
                        <div style={{
                            width: open ? "90vw" : "100vw",
                            marginTop: 80,
                            marginLeft: 0,
                            display: "flex",
                            // borderBottom: "1px solid white",
                            transform: open ? "translateX(275px)" : "translateX(0)",
                            transition: "transform 0.3s ease",
                            overflow: "hidden",
                        }}>
                            {selectedMenu === 'list' && (
                                <PersonalSpacePageIssuesList issues={issues} projectUsers={projectUsers} userData={userData}
                                                             deleteIssue={handleDeleteIssue}/>
                            )}
                            {selectedMenu === 'calendar' && (
                                <PersonalSpacePageIssuesCalendar issues={issues} projectUsers={projectUsers}
                                                                 handleAddIssue={handleAddIssue}
                                                                 CustomBackdrop={CustomBackdrop}/>
                            )}
                        </div>) :
                    <div style={{
                        marginTop: 80,
                        width: "100vw",
                        marginLeft: 140,
                        display: "flex",
                        overflow: "hidden",
                    }}>
                        <PersonalSpacePageIssuesBoard issues={issues}/>
                    </div>}
            </div>
            <div style={{
                position: 'fixed',
                bottom: '5%',
                right: '5%',
                backgroundColor: 'white'
            }}>
                <Button onClick={openIssueAddModal}>+ Issue</Button>
            </div>
            <div style={{
                position: 'fixed',
                bottom: '5%',
                right: '10%',
                backgroundColor: 'white'
            }}>
                <Button
                    onClick={openAddUserInProjectModal}
                >+ User</Button>
            </div>
            <IssueAddModal closeIssueAddModal={closeIssueAddModal} issueAddOpen={issueAddOpen}
                           handleAddIssue={handleAddIssue} projectUsers={projectUsers}
                           CustomBackdrop={CustomBackdrop}></IssueAddModal>

            <UserAddModal addUserInProjectOpen={addUserInProjectOpen}
                          closeAddUserInProjectModal={closeAddUserInProjectModal}
                          handleInviteUserInProject={handleInviteUserInProject}
                          CustomBackdrop={CustomBackdrop}></UserAddModal>
        </div>

    );
};

// @ts-ignore
function CustomBackdrop(props) {
    return <Backdrop {...props} sx={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}/>;
}

export default PersonalSpacePage;