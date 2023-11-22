import {IssueResponse} from "../../models";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {IssueApi} from "../../apis/issue-api";
import {AxiosRequestConfig} from "axios/index";
import {IssueLog} from "../../models/issue-log";
import List from "@mui/material/List";
import {Grid, ListItem, ListItemText, Paper, Typography} from "@mui/material";
import {UserApi} from "../../apis/user-api";

const issueApi = new IssueApi();
const userApi = new UserApi();


const IssueDetailsPage: React.FC = () => {
    const {id} = useParams();
    const token = localStorage.getItem("token");
    const [issue, setIssue] = useState<IssueResponse>();
    const [issueLogs, setIssueLogs] = useState<IssueLog[]>();
    const [userEmails, setUserEmails] = useState({});
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
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
            setIssueLogs(data || []);
        }
        fetchIssueLogs();
    }, []);

    useEffect(() => {
        fetchUserEmails();
    }, [issueLogs]);

    const fetchUserEmails = async () => {
        const emails = {};
        // @ts-ignore
        for (const log of issueLogs) {
            try {
                const response = await userApi.userGetByIdGet(log.userId, requestConfig);
                // @ts-ignore
                emails[issue.performerId] = response.data.email;
            } catch (error) {
                console.error(`Error fetching email for user ${log.userId}:`, error);
            }
        }

        setUserEmails(emails);
    };
    
    return (
        <div
            style={{
                width: "100%",
                height: "99vh",
                marginLeft: 20,
                marginTop: 10,
                display: 'flex',
                flexDirection: 'row'
            }}>
            <List>
                {issueLogs?.map((issueLog) => (
                    issueLog.oldValue !== issueLog.newValue && (
                        <ListItem key={issueLog.id}>
                            <ListItemText>
                                <Typography>
                                    {/*@ts-ignore*/}
                                    {userEmails[issueLog.userId]} changed {issueLog.propertyName} from "{issueLog.oldValue}" to "{issueLog.newValue}"
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    )
                ))}
            </List>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Issue Details
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography>
                            <strong>Name:</strong> {issue?.name}
                        </Typography>

                        <Typography>
                            <strong>Description:</strong> {issue?.description}
                        </Typography>

                        <Typography>
                            <strong>Priority:</strong> {issue?.priority}
                        </Typography>

                        <Typography>
                            <strong>Difficulty:</strong> {issue?.difficulty}
                        </Typography>
                        
                        <Typography>
                            {/*@ts-ignore*/}
                            <strong>Performer:</strong> {userEmails[issue?.performerId]}
                        </Typography>

                        <Typography>
                            {/*@ts-ignore*/}
                            <strong>End Date:</strong> {issue?.endDate}
                        </Typography>

                        <Typography>
                            <strong>Status:</strong> {issue?.status}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default IssueDetailsPage;