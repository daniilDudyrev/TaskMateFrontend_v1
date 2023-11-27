import React, {useState} from "react";
import {IssueResponse, ProjectUserResponse, Status} from "../../models";
import {Calendar, Day, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {IssueApi, UserApi} from "../../api";
import {AxiosRequestConfig} from "axios";
import "../../index.css"
import {Typography} from "@mui/material";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import IssueAddModal from "../modals/IssueAddModal";
import IssueAddModalCalendar from "../modals/IssueAddModalCalendar";

const localizer = momentLocalizer(moment);


interface PersonalSpacePageIssuesProps {
    issues: IssueResponse[];
    CustomBackdrop(props: any): JSX.Element,
    projectUsers: ProjectUserResponse[],
    handleAddIssue(priority: number, difficulty: number, name: string, description: string, performerId: string, startDate: Date, endDate: Date): Promise<void>,
}

const userApi = new UserApi();
const issueApi = new IssueApi();


interface EventWrapperProps {
    children: React.ReactNode;
    event: {
        id: string | undefined,
        title: string,
        status: Status | undefined,
        difficulty: number | undefined,
        priority: number | undefined,
        performer: string,
        start: Date,
        end: Date
    }
}

const PersonalSpacePageIssuesCalendar: React.FC<PersonalSpacePageIssuesProps> = ({
                                                                                     issues,
                                                                                     handleAddIssue,
                                                                                     projectUsers,
                                                                                     CustomBackdrop,
                                                                                 }) => {
    const [issueEndDate, setIssueEndDate] = useState<Date | null>(null);
    const [issueAddOpen, setIssueAddOpen] = useState(false);
    
    
    const token = localStorage.getItem("token");
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": 'skip-browser-warning'
        },
    }
    
    // @ts-ignore
    const handleSelectSlot = async ({start, end}) => {
        const day = end.getDate();
        const month = end.getMonth();
        const year = end.getFullYear();
        const date = new Date(year, month, day);
        console.log(date);
        setIssueEndDate(date);
        openIssueAddModal()
    }

    const openIssueAddModal = () => {
        setIssueAddOpen(true);
    };

    const closeIssueAddModal = () => {
        setIssueAddOpen(false);
    };
    

    const eventList = issues.map((issue) => ({
        id: issue.issueId,
        title: issue.name || '',
        status: issue.status,
        difficulty: issue.difficulty,
        priority: issue.priority,
        performer: issue.performerId || '',
        start: new Date(issue.startDate || ''),
        end: new Date(issue.endDate || ''),
    }));


    return (
        <div>
            <Calendar
                localizer={localizer}
                events={eventList}
                defaultView="month"
                startAccessor="end"
                endAccessor="end"
                style={{height: "90vh", width: "80vw", marginLeft: 100, marginTop: 10}}
                titleAccessor="title"
                selectable={true}
                onSelectSlot={handleSelectSlot}
                views={['month']}
                components={{
                    // @ts-ignore
                    eventWrapper: ({event, children}) => (
                        <EventWrapper event={event}>{children}</EventWrapper>
                    ),
                }}
            />
            <IssueAddModalCalendar issueAddOpen={issueAddOpen} closeIssueAddModal={closeIssueAddModal}
                           CustomBackdrop={CustomBackdrop} projectUsers={projectUsers}
                           handleAddIssue={handleAddIssue} calendarDate={issueEndDate!}></IssueAddModalCalendar>
        </div>
    );
};

const EventWrapper: React.FC<EventWrapperProps> = ({children, event}) => {
    return (
        <OverlayTrigger
            overlay={
                <Tooltip id={`tooltip-${event.id}`}>
                    {
                        <div style={{
                            border: "1px solid white",
                            marginBottom: 5,
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                            background: "linear-gradient(to bottom, #9bb0cd, #acc4e4)",
                            borderRadius: "10px",
                            padding: "10px",
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: 'center',
                            width: 300
                        }}>
                            <Typography sx={{
                                color: 'white'
                            }}>{event.title}</Typography>
                            <Typography
                                style={{
                                    backgroundColor: (() => {
                                        switch (event.status) {
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
                            >
                                {(() => {
                                    switch (event.status) {
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
                    }
                </Tooltip>
            }
        >
            {/*@ts-ignore*/}
            {children}
        </OverlayTrigger>
    );
};
export default PersonalSpacePageIssuesCalendar;
