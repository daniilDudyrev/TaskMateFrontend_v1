import {IssueResponse} from "../../models";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {IssueApi} from "../../apis/issue-api";
import {AxiosRequestConfig} from "axios";
import {IssueLog} from "../../models";
import List from "@mui/material/List";
import {Grid, ListItem, ListItemText, Paper, Typography} from "@mui/material";
import {UserApi} from "../../apis/user-api";
import FlagIcon from "@mui/icons-material/Flag";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const issueApi = new IssueApi();
const userApi = new UserApi();


const IssueDetailsPage: React.FC = () => {
    const {id} = useParams();
    const token = localStorage.getItem("token");
    const [issue, setIssue] = useState<IssueResponse>();
    const [issueLogs, setIssueLogs] = useState<IssueLog[]>();
    const [userEmails, setUserEmails] = useState({});
    let index = 0;
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": 'skip-browser-warning'
        },
    }
    useEffect(() => {
        const fetchIssue = async () => {
            const response = await issueApi.issueGetByIdGet(id, requestConfig);
            const data = response.data;
            setIssue(data);
        }
        fetchIssue();
    }, []);

    useEffect(() => {
        const fetchIssueLogs = async () => {
            const response = await issueApi.issueGetIssueLogsByIssueIdGet(id, requestConfig);
            const data = response.data;
            // @ts-ignore
            const sortedDataDescending = data.sort((a, b) => new Date(b.changeDateTime) - new Date(a.changeDateTime));
            setIssueLogs(data || []);
        }
        fetchIssueLogs();
    }, []);

    useEffect(() => {
        fetchUserEmails();
    }, [issueLogs]);

    const fetchUserEmails = async () => {
        try {
            const uniqueUserIds = Array.from(new Set(issueLogs?.map(issueLog => issueLog.userId)));
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
        } catch (error) {
            console.error('Error fetching user emails:', error);
        }
    };

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
                return <KeyboardArrowUpIcon style={style}/>;
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

    return (
        <div
            style={{
                width: "100%",
                height: "90vh",
                marginLeft: 20,
                marginTop: 100,
                display: 'flex',
                flexDirection: 'row'
            }}>


            <div style={{
                backgroundColor: '#b79a84',
                height: 400,
                border: "1px solid #ded3c5",
                borderRadius: "4px",
                width: 500,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                marginLeft: 60
            }}>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
                    <Typography className="listItemsText">
                        <strong>Name:</strong>
                    </Typography>
                    <Typography className="listItemsText">
                        {/*@ts-ignore*/}
                        {issue?.name}
                    </Typography>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
                    <Typography className="listItemsText">
                        <strong>Description:</strong>
                    </Typography>
                    <Typography className="listItemsText">
                        {/*@ts-ignore*/}
                        {issue?.description}
                    </Typography>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
                    <Typography className="listItemsText">
                        <strong>Priority:</strong>
                    </Typography>
                    <div>
                        {getPriorityIcon(issue?.priority)}
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
                    <Typography className="listItemsText">
                        <strong>Difficulty:</strong>
                    </Typography>
                    <div>
                        {getDifficultyIcon(issue?.difficulty)}
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
                    <Typography className="listItemsText">
                        <strong>Performer:</strong>
                    </Typography>
                    <Typography className="listItemsText">
                        {/*@ts-ignore*/}
                        {userEmails[issue?.performerId]}
                    </Typography>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
                    <Typography className="listItemsText">
                        <strong>End Date:</strong>
                    </Typography>
                    <Typography className="listItemsText">
                        {/*@ts-ignore*/}
                        {new Date(issue?.endDate).toDateString()}
                    </Typography>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
                    <Typography className="listItemsText">
                        <strong>Status:</strong>
                    </Typography>
                    <Typography
                        style={{
                            backgroundColor: (() => {
                                switch (issue?.status) {
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
                            width: 110,
                        }}
                        className="listItemsText"
                    >
                        {(() => {
                            switch (issue?.status) {
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
                </div>
            </div>
            <Paper style={{maxHeight: 800, overflow: 'auto', overflowX: 'hidden', marginLeft: 220}}>
                <List>
                    {issueLogs?.map((issueLog) => (
                        issueLog.oldValue !== issueLog.newValue && (
                            <ListItem key={issueLog.id}
                                      style={{
                                          backgroundColor: (index = index + 1) % 2 == 0 ? '#EDEDED' : '#b79a84',
                                          display: 'flex',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between'
                                      }}>
                                <ListItemText>
                                    <Typography className="listItemsText">
                                        {/*@ts-ignore*/}
                                        {userEmails[issueLog.userId]} changed {issueLog.propertyName} from
                                        "{issueLog.oldValue}" to "{issueLog.newValue}"
                                    </Typography>
                                </ListItemText>
                                <Typography
                                    className="listItemsText">
                                    {/*@ts-ignore*/}
                                    {new Date(issueLog.changeDateTime).toDateString()}
                                </Typography>
                            </ListItem>
                        )
                    ))}
                </List>
            </Paper>
        </div>
    );
}

export default IssueDetailsPage;