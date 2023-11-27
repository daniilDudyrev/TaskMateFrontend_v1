import React, {useEffect, useState} from "react";
import {IssueRequest, IssueResponse, ProjectUserResponse} from "../../models";
import List from '@mui/material/List';
import {IssueApi, UserApi} from "../../api";
import {AxiosRequestConfig} from "axios";
import {Button, Link, Select, TextareaAutosize, TextField, Typography} from "@mui/material";
import FlagIcon from '@mui/icons-material/Flag';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface PersonalSpacePageIssuesProps {
    issues: IssueResponse[];
    projectUsers: ProjectUserResponse[];
    userData: {};

    deleteIssue(issueId: string): Promise<void>
}

const issueApi = new IssueApi();
const userApi = new UserApi();


const groupByOptions = [
    {label: 'Status', value: 'status'},
    {label: 'Difficulty', value: 'difficulty'},
    {label: 'Priority', value: 'priority'},
    {label: 'Performer', value: 'performerId'},
    {label: 'End Date', value: 'endDate'},
];

const PersonalSpacePageIssuesList: React.FC<PersonalSpacePageIssuesProps> = ({
                                                                                 issues,
                                                                                 projectUsers,
                                                                                 userData,
                                                                                 deleteIssue
                                                                             }) => {
    const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
    const [groupBy, setGroupBy] = useState('status');
    const [isMenuOpen, setIsMenuOpen] = useState(null);
    const [parameters, setParameters] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string>('');
    const [newIssueName, setNewIssueName] = useState('');
    const [newIssueDescription, setNewIssueDescription] = useState('');
    const [userEmails, setUserEmails] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    
    const token = localStorage.getItem("token");
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": 'skip-browser-warning'
        },
    }

    useEffect(() => {
        fetchUserEmails();
    }, [issues]);


    // @ts-ignore
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleGoToIssue = () => {
        handleClose();
    };

    const fetchUserEmails = async () => {
        const emails = {};
        for (const issue of issues) {
            try {
                const response = await userApi.userGetByIdGet(issue.performerId, requestConfig);
                // @ts-ignore
                emails[issue.performerId] = response.data.email;
            } catch (error) {
                console.error(`Error fetching email for user ${issue.performerId}:`, error);
            }
        }

        setUserEmails(emails);
    };

    const groupIssues = (issues: IssueResponse[], groupBy: keyof IssueResponse) => {
        const groupedIssues: { [key: string]: IssueResponse[] } = {};

        issues.forEach((issue) => {
            const key = issue[groupBy] as string;

            if (key !== undefined) {
                if (!groupedIssues[key]) {
                    groupedIssues[key] = [];
                }

                groupedIssues[key].push(issue);
            }
        });

        return groupedIssues;
    };


    const groupedIssues = groupIssues(issues, groupBy as keyof IssueResponse);

    function getPriorityIcon(priority: number | undefined) {
        switch (priority) {
            case 1:
                return <FlagIcon style={{color: '#8BC34A'}}/>;
            case 2:
                return <FlagIcon style={{color: '#64B5F6'}}/>;
            case 3:
                return <FlagIcon style={{color: '#E57373'}}/>;
            default:
                return <FlagIcon style={{color: 'grey'}}/>;
        }
    }

    function getDifficultyIcon(difficulty: number | undefined) {
        const style = {
            marginBottom: "-18px",
            marginLeft: "18px"
        };

        switch (difficulty) {
            case 1:
                return <KeyboardArrowUpIcon/>;
            case 2:
                return (
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <KeyboardArrowUpIcon style={style}/>
                        <KeyboardArrowUpIcon style={style}/>
                    </div>
                );
            case 3:
                return (
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <KeyboardArrowUpIcon style={style}/>
                        <KeyboardArrowUpIcon style={style}/>
                        <KeyboardArrowUpIcon style={style}/>
                    </div>
                );
            default:
                return <KeyboardArrowUpIcon/>;
        }
    }

    const priorityMap: { [key: string]: number } = {
        'low': 1,
        'normal': 2,
        'high': 3,
    };

    const difficultyMap: { [key: string]: number } = {
        'easy': 1,
        'medium': 2,
        'hard': 3,
    };

    const statusMap: { [key: string]: number } = {
        'Done': 0,
        'In Progress': 1,
        'Closed': 2,
        'Paused': 3
    };

    // @ts-ignore
    const handleMenuClick = (event, issue: IssueResponse, key: string) => {
        setSelectedIssue(issue);
        setSelectedKey(key);
        if (key == 'priority') {
            const priorityParameters = Object.keys(priorityMap)
            const valueToRemove = priorityParameters[issue.priority! - 1]
            const filteredPriorities = priorityParameters.filter(item => item != valueToRemove)
            setParameters(filteredPriorities)
        }
        if (key == 'difficulty') {
            const difficultyParameters = Object.keys(difficultyMap)
            const valueToRemove = difficultyParameters[issue.difficulty! - 1]
            const filteredDifficulties = difficultyParameters.filter(item => item != valueToRemove)
            setParameters(filteredDifficulties)
        }
        if (key == 'status') {
            const statusParameters = Object.keys(statusMap)
            const valueToRemove = statusParameters[issue.status!]
            const filteredStatuses = statusParameters.filter(item => item != valueToRemove)
            setParameters(filteredStatuses)
        }
        if (key == 'performer') {
            const users = [] as unknown as string[];
            projectUsers.map((projectUser) => {
                // @ts-ignore
                users.push(userData[projectUser.userId].email)
            })
            setParameters(users)
        }
        if (key == 'description') {
            setNewIssueDescription(issue.description!);
        }
        setIsMenuOpen(event.currentTarget);
    };


    const handleMenuClose = () => {
        setIsMenuOpen(null);
    };

    const handleParameterChange = async (parameter: string) => {
        if (selectedKey == 'priority') {
            selectedIssue.priority = priorityMap[parameter];
        }
        if (selectedKey == 'difficulty') {
            selectedIssue.difficulty = difficultyMap[parameter];
        }
        if (selectedKey == 'status') {
            selectedIssue.status = statusMap[parameter];
        }
        if (selectedKey == 'performer') {
            const selectedUserId = Object.keys(userData).find(
                // @ts-ignore
                (userId) => userData[userId].email === parameter
            );
            if (selectedUserId) {
                selectedIssue.performerId = selectedUserId;
            }
        }
        if (selectedKey === 'name') {
            selectedIssue.name = newIssueName;
        }
        if (selectedKey === 'description') {
            selectedIssue.description = newIssueDescription;
        }

        const updatedIssue: IssueRequest = {...selectedIssue}
        await issueApi.issueUpdatePut(updatedIssue, selectedIssue.issueId, requestConfig);
        fetchUserEmails()
        setIsMenuOpen(null);
    }

    function getDaysLeft(date: Date, status: number) {
        const now = new Date();
        const endDate = new Date(date);

        const timeDiff = endDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (status == 0) {
            return <Typography style={{color: 'white'}}>
                Issue completed
            </Typography>
        }
        if (status == 2) {
            return <Typography style={{color: 'white'}}>
                Issue closed
            </Typography>
        }
        if (status == 3) {
            return <Typography style={{color: 'white'}}>
                Issue paused
            </Typography>
        }
        if (daysDiff < 0) {
            return <Typography style={{color: 'white'}}>
                {Math.abs(daysDiff)} days overdue!
            </Typography>
        } else {
            return <Typography style={{color: '#64B5F6'}}>
                {daysDiff} days left
            </Typography>
        }
    }
    
    return (
        <div style={{
            width: "100%",
            marginLeft: 0,
            marginTop: 10
        }}>
            <div style={{
                borderBottom: "1px solid white",
                height: 80
            }}>
                <Typography sx={{
                    right: 115, position: 'absolute', fontWeight: 700,
                    letterSpacing: '.1rem',
                    textDecoration: 'none',
                    color: 'white'
                }}>
                    Group by
                </Typography>
                <Select
                    MenuProps={{
                        disableScrollLock: true
                    }}
                    sx={{
                        right: 75, position: 'absolute', width: 140, fontWeight: 550,
                        letterSpacing: '.1rem',
                        textDecoration: 'none',
                        color: 'white',
                        '& > fieldset': {borderColor: "#F0F0F0"}

                    }} value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}>
                    {groupByOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            {Object.keys(groupedIssues).map((groupKey) => (
                <div key={groupKey}>
                    <List component="nav">
                        {groupedIssues[groupKey].map((issue) => (
                            <div key={issue.issueId} style={{
                                display: "flex",
                                flexDirection: "column",
                                borderBottom: "1px solid white",
                                height: 110
                            }}
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: "column",
                                    alignItems: 'flex-start',
                                    width: "90%"
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: "row",
                                        alignItems: 'center',
                                        justifyContent: "space-between",
                                        width: "100%"
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: "row",
                                            alignItems: 'center',
                                            width: 300
                                        }}
                                        >
                                            <Typography
                                                style={{
                                                    backgroundColor: (() => {
                                                        switch (issue.status) {
                                                            case 0:
                                                                return '#8BC34A';
                                                            case 1:
                                                                return '#64B5F6';
                                                            case 2:
                                                                return '#E57373';
                                                            case 3:
                                                                return 'gray';
                                                            default:
                                                                return 'gray';
                                                        }

                                                    })(),
                                                    color: 'white',
                                                    padding: '8px',
                                                    margin: '4px',
                                                    width: 110,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={(event) => handleMenuClick(event, issue, 'status')}
                                            >
                                                {(() => {
                                                    switch (issue.status) {
                                                        case 0:
                                                            return 'Done';
                                                        case 1:
                                                            return 'In Progress';
                                                        case 2:
                                                            return 'Closed';
                                                        case 3:
                                                            return 'Paused';
                                                        default:
                                                            return 'Unknown';
                                                    }
                                                })()}
                                            </Typography>
                                            <Typography
                                                style={{
                                                    color: 'white',
                                                    padding: '8px',
                                                    margin: '4px',
                                                    width: 200,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={(event) => handleMenuClick(event, issue, 'name')}
                                            >
                                                {issue.name}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography
                                                style={{
                                                    color: 'white',
                                                    width: 200,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={(event) => handleMenuClick(event, issue, 'description')}
                                            >
                                                Show description
                                            </Typography>
                                        </div>

                                        <div style={{display: "flex", justifyContent: "space-between", width: 200}}>
                                            {getDaysLeft(issue.endDate!, issue.status!)}
                                        </div>

                                        <div style={{display: "flex", justifyContent: "space-between", width: 200}}>
                                            <Typography style={{
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}
                                                        onClick={(event) => {
                                                            handleMenuClick(event, issue, 'performer');
                                                        }}>
                                                <PersonAddAltIcon/>
                                                {/*@ts-ignore*/}
                                                {userEmails[issue.performerId]}
                                            </Typography>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: 200,
                                            cursor: 'pointer'
                                        }}>
                                            <div onClick={(event) => handleMenuClick(event, issue, 'priority')}>
                                                <Typography style={{
                                                    color: 'white'
                                                }}>Priority</Typography>
                                                {getPriorityIcon(issue.priority)}
                                            </div>
                                            <div style={{cursor: 'pointer'}}
                                                 onClick={(event) => handleMenuClick(event, issue, 'difficulty')}>
                                                <Typography style={{
                                                    color: 'white'
                                                }}>Difficulty</Typography>
                                                {getDifficultyIcon(issue.difficulty)}
                                            </div>
                                        </div>
                                        <div>
                                            <Link
                                                href={`/issue/${issue.issueId}`}
                                                onClick={handleClick}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    handleClick(e);
                                                }}
                                            >
                                                <MoreVertIcon sx={{
                                                    color: 'white'
                                                }}></MoreVertIcon>
                                            </Link>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                            >
                                                <MenuItem onClick={handleGoToIssue}>Go to issue page</MenuItem>
                                            </Menu>
                                        </div>
                                        <div
                                            onClick={() => deleteIssue(issue.issueId!)}>
                                            <DeleteIcon sx={{
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}></DeleteIcon>
                                        </div>
                                        <Menu
                                            disableScrollLock={true}
                                            anchorEl={isMenuOpen}
                                            open={Boolean(isMenuOpen)}
                                            onClose={handleMenuClose}
                                            sx={{
                                                mt: "1px",
                                                "& .MuiMenu-paper": {
                                                    backgroundColor: "#acc4e4",
                                                    border: "1px solid white",
                                                    marginBottom: 5,
                                                    boxShadow: 'none',
                                                    borderRadius: "10px",
                                                    padding: "10px",
                                                    display: 'flex',
                                                    flexDirection: "row",
                                                    alignItems: 'center',
                                                },
                                            }}
                                        >
                                            {selectedKey === 'name' ? (
                                                <MenuItem>
                                                    <TextField
                                                        label="New Name"
                                                        value={newIssueName}
                                                        onChange={(e) => setNewIssueName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleParameterChange(newIssueName);
                                                            }
                                                        }}
                                                    />
                                                </MenuItem>
                                            ) : selectedKey === 'description' ? (
                                                <MenuItem
                                                    disableTouchRipple={true}
                                                    disableGutters={true}
                                                    sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    "& .MuiMenuItem-root": {
                                                        cursor: 'none',
                                                    },
                                                    "& .MuiButtonBase-root": {
                                                        backgroundColor: "white",
                                                        transition: "background-color 0.3s",
                                                        "&:hover": {
                                                            backgroundColor: "#acc4e4",
                                                        },
                                                    }
                                                }}>
                                                    <TextareaAutosize
                                                        style={{
                                                            minWidth: 150,
                                                            minHeight: 250,
                                                            backgroundColor: "#acc4e4"
                                                        }}
                                                        value={newIssueDescription}
                                                        onChange={(e) => setNewIssueDescription(e.target.value)}
                                                    />
                                                    <Button sx={{
                                                        color: "#64B5F6"
                                                    }} onClick={(e) => handleParameterChange(newIssueDescription)}>
                                                        Change
                                                    </Button>
                                                </MenuItem>
                                            ) : (
                                                parameters.map((parameter) => (
                                                    <MenuItem
                                                        sx={{color: 'white'}}
                                                        key={parameter}
                                                        onClick={() => handleParameterChange(parameter)}
                                                    >
                                                        {parameter}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Menu>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </List>
                </div>
            ))}
        </div>
    );
};

export default PersonalSpacePageIssuesList;