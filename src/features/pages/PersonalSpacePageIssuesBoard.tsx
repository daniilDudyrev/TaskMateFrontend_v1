import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {IssueRequest, IssueResponse} from "../../models";
import FlagIcon from "@mui/icons-material/Flag";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {Typography} from "@mui/material";
import {IssueApi} from "../../apis/issue-api";
import {AxiosRequestConfig} from "axios";

interface PersonalSpacePageIssuesProps {
    issues: IssueResponse[];
}

const issueApi = new IssueApi();

const PersonalSpacePageIssuesBoard: React.FC<PersonalSpacePageIssuesProps> = ({issues}) => {

    const [updatedIssues, setUpdatedIssues] = useState<IssueResponse[]>(issues);
    const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
    const [groupBy, setGroupBy] = useState('status');
    const token = localStorage.getItem("token");
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    
    
    const statusMap: { [key: string]: number } = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
    };
    // @ts-ignore
    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const sourceColumn = result.source.droppableId;
        const destinationColumn = result.destination.droppableId;

        if (sourceColumn !== destinationColumn) {
            const issueId = result.draggableId;
            const newStatus = statusMap[destinationColumn];
            const issue = issues.find((issue) => issue.issueId === issueId);

            const updatedIssues = [...issues];
            const issueIndex = updatedIssues.findIndex((issue) => issue.issueId === issueId);
            
            if (issue) {
                const issue = updatedIssues[issueIndex];
                issue.status = newStatus;
                updatedIssues.splice(issueIndex, 1);
                updatedIssues.splice(result.destination.index, 0, issue);
                setUpdatedIssues(updatedIssues);
                setSelectedIssue(issue);
                issue.status = newStatus;
                const updatedIssue: IssueRequest = {...issue as any}
                await issueApi.issueUpdatePut(updatedIssue, issue.issueId, requestConfig);
            }
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
    
    // @ts-ignore
    const Column = ({status, issues}) => (
        <div style={{
            minHeight: 114,
            minWidth: 300
        }}>
            <Typography
                style={{
                    backgroundColor: (() => {
                        switch (statusMap[status]) {
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
                    marginLeft: 95
                }}
            >
                {(() => {
                    switch (statusMap[status]) {
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
            {/*@ts-ignore*/}
            {issues.map((issue, index) => (
                <Draggable
                    key={issue.issueId}
                    draggableId={issue.issueId}
                    index={index}
                >
                    {(providedDraggable, snapshot) => (
                        <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                        >
                            <div style={{
                                border: "1px solid white",
                                marginBottom: 5,
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                                background: "linear-gradient(to bottom, #9bb0cd, #acc4e4)",
                                borderRadius: "10px",
                                padding: "10px",
                                display: 'flex',
                                flexDirection: "row",
                                alignItems: 'center',
                                width: 300
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    width: 300,
                                }}
                                >
                                    <Typography
                                        style={{
                                            color: 'white',
                                            padding: '8px',
                                            margin: '4px',
                                        }}
                                    >
                                        {issue.name}
                                    </Typography>
                                </div>
                                <div style={{display: "flex", justifyContent: "space-between", width: 200}}>
                                    <div 
                                    >
                                        {getPriorityIcon(issue.priority)}
                                    </div>
                                    <div 
                                    >
                                        {getDifficultyIcon(issue.difficulty)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Draggable>
            ))}
        </div>
    );

    return (
        <div style={{
            width: '100%',
            marginLeft: '10%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: ''
        }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                {Object.keys(statusMap).map((status) => (
                    <Droppable droppableId={status} key={status}>
                        {(provided, snapshot) => (
                            <div style={{
                                borderLeft: "1px solid white",
                                borderRight: "1px solid white",
                                paddingLeft:10,
                                paddingRight:10
                            }} ref={provided.innerRef}>
                                <Column status={status} issues={groupedIssues[status] || []} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </div>
    );
}

export default PersonalSpacePageIssuesBoard;