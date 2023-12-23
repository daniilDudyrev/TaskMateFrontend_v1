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
        try {
            const uniqueUserIds = Array.from(new Set(issues!.map(issue => issue.performerId)));
            const emails = {};
            for (const userId of uniqueUserIds) {
                try {
                    const response = await userApi.userGetByIdGet(userId, requestConfig);
                    // @ts-ignore
                    emails[userId] = response.data.email;
                } catch (error) {
                    console.error(`Error fetching email for user ${userId}:`, error);
                }
            }
    
            setUserEmails(emails);
        }
        catch (error) {
            console.error('Error fetching user emails:', error);
        }
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
            marginLeft: "26px",
        };

        switch (difficulty) {
            case 1:
                return <KeyboardArrowUpIcon style={{marginLeft: -6}}/>;
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
            return <Typography className="listItemsText" style={{color: 'white'}}>
                Issue completed
            </Typography>
        }
        if (status == 2) {
            return <Typography className="listItemsText" style={{color: 'white'}}>
                Issue closed
            </Typography>
        }
        if (status == 3) {
            return <Typography className="listItemsText" style={{color: 'white'}}>
                Issue paused
            </Typography>
        }
        if (daysDiff < 0) {
            return <Typography className="listItemsText" style={{color: 'white'}}>
                {Math.abs(daysDiff)} days overdue!
            </Typography>
        } else {
            return <Typography className="listItemsText" style={{color: '#64B5F6'}}>
                {daysDiff} days left
            </Typography>
        }
    }

    // @ts-ignore
    const navigateToIssueDetails = (issueId) => {
        window.location.href = `/TaskMateFrontend_v1/#/issue/${issueId}`
    }
    
    return (
        <div style={{
            width: "100%",
            marginLeft: 0,
        }}>
            <div style={{
                borderBottom: "1px solid white",
                height: 80,
                backgroundColor: '#c4b5ab',
                marginBottom: 8
            }}>
                {/*<Typography className="listItemsText" sx={{*/}
                {/*    right: 115, position: 'absolute', fontWeight: 700,*/}
                {/*    letterSpacing: '.1rem',*/}
                {/*    textDecoration: 'none',*/}
                {/*    color: 'white',*/}
                {/*    backgroundColor: '#ded3c5',*/}
                {/*}}>*/}
                {/*    Group by*/}
                {/*</Typography>*/}
                <Select
                    MenuProps={{
                        disableScrollLock: true,
                    }}
                    sx={{
                        right: 75, position: 'absolute', width: 140, fontWeight: 550,
                        letterSpacing: '.1rem',
                        textDecoration: 'none',
                        backgroundColor: '#ded3c5',
                        color: '#857366',
                        marginTop: 1,
                        '& > fieldset': {borderColor: "#F0F0F0"},
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: 0
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none"
                        },
                        "&:hover": {
                            backgroundColor: "#b79a84",
                            color: "#FFFFFF"
                        },

                    }} value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}>
                    {groupByOptions.map((option) => (
                        <MenuItem className="listItemsText" sx={{
                            color: "#FFFFFF"
                        }} key={option.value} value={option.value}>
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
                                height: 110,
                                backgroundColor: '#ad998b',
                                borderBottom: "1px solid white",
                            }} onClick={() => navigateToIssueDetails(issue.issueId)}
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
                                        <div title="Change issue status" style={{
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
                                                                return '#739072';
                                                            case 1:
                                                                return '#96B6C5';
                                                            case 2:
                                                                return '#FD8A8A';
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
                                                    cursor: 'pointer',
                                                    marginTop: 35
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
                                            <Typography title="Change issue name" className="listItemsText"
                                                style={{
                                                    color: 'white',
                                                    padding: '8px',
                                                    margin: '4px',
                                                    width: 200,
                                                    cursor: 'pointer',
                                                    marginTop: 35
                                                }}
                                                onClick={(event) => handleMenuClick(event, issue, 'name')}
                                            >
                                                {issue.name}
                                            </Typography>
                                        </div>
                                        <div title="Show issue description">
                                            <Typography className="listItemsText"
                                                style={{
                                                    color: 'white',
                                                    width: 200,
                                                    cursor: 'pointer',
                                                    marginTop: 35
                                                }}
                                                onClick={(event) => handleMenuClick(event, issue, 'description')}
                                            >
                                                Description
                                            </Typography>
                                        </div>

                                        <div style={{display: "flex", justifyContent: "space-between", width: 200,marginTop: 35}}>
                                            {getDaysLeft(issue.endDate!, issue.status!)}
                                        </div>

                                        <div title="Change issue performer" style={{display: "flex", justifyContent: "space-between", width: 200}}>
                                            <Typography className="listItemsText" style={{
                                                color: 'white',
                                                cursor: 'pointer',
                                                marginTop: 25
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
                                            <div title="Change issue priority" onClick={(event) => handleMenuClick(event, issue, 'priority')}>
                                                <Typography className="listItemsText" style={{
                                                    color: 'white',
                                                    marginTop: 25
                                                }}>Priority</Typography>
                                                {getPriorityIcon(issue.priority)}
                                            </div>
                                            <div title="Change issue difficulty" style={{cursor: 'pointer'}}
                                                 onClick={(event) => handleMenuClick(event, issue, 'difficulty')}>
                                                <Typography className="listItemsText" style={{
                                                    color: 'white',
                                                    marginTop: 25
                                                }}>Difficulty</Typography>
                                                {getDifficultyIcon(issue.difficulty)}
                                            </div>
                                        </div>
                                        {/*<div title="Show issue details" style={{*/}
                                        {/*    marginTop: 25*/}
                                        {/*}}>*/}
                                        {/*    <Link*/}
                                        {/*        href={`/TaskMateFrontend_v1/#/issue/${issue.issueId}`}*/}
                                        {/*        onClick={handleClick}*/}
                                        {/*        onContextMenu={(e) => {*/}
                                        {/*            e.preventDefault();*/}
                                        {/*            handleClick(e);*/}
                                        {/*        }}*/}
                                        {/*    >*/}
                                        {/*        <MoreVertIcon sx={{*/}
                                        {/*            color: 'white'*/}
                                        {/*        }}></MoreVertIcon>*/}
                                        {/*    </Link>*/}
                                        {/*    <Menu*/}
                                        {/*        anchorEl={anchorEl}*/}
                                        {/*        open={Boolean(anchorEl)}*/}
                                        {/*        onClose={handleClose}*/}
                                        {/*    >*/}
                                        {/*        <MenuItem onClick={handleGoToIssue}>Go to issue page</MenuItem>*/}
                                        {/*    </Menu>*/}
                                        {/*</div>*/}
                                        <div title="Delete issue"
                                            onClick={() => deleteIssue(issue.issueId!)}>
                                            <DeleteIcon sx={{
                                                color: 'white',
                                                cursor: 'pointer',
                                                marginTop: 3
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
                                                        backgroundColor: "#b79a84",
                                                        transition: "background-color 0.3s",
                                                        "&:hover": {
                                                            backgroundColor: "#857366",
                                                        },
                                                    }
                                                }}>
                                                    <TextareaAutosize
                                                        style={{
                                                            minWidth: 150,
                                                            minHeight: 250,
                                                            backgroundColor: "#b79a84"
                                                        }}
                                                        value={newIssueDescription}
                                                        onChange={(e) => setNewIssueDescription(e.target.value)}
                                                    />
                                                    <Button sx={{
                                                        color: "#FFFFFF"
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