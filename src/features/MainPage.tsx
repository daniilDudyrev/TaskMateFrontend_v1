import React, {useEffect} from "react";
import {Typography} from "@mui/material";
import Header from "../components/Layout/Header";
import "../index.css"
import {useNavigate} from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            navigate("/PersonalSpace")
        }
    }, []);
    return (
        <div>
            <Header></Header>
            <Typography variant="h4" align="center" style={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: '#302c34',
                backgroundColor:'#857366',
                textDecoration: 'none',
                paddingLeft: 200,
                maxWidth: 600,
                paddingTop: 200,
            }}>
                Create and manage your projects with mates.
            </Typography>
            {/*<div className="threed" style={{*/}
            {/*    position: 'absolute',*/}
            {/*    height: 700,*/}
            {/*    width: 1200,*/}
            {/*    right: 30,*/}
            {/*    top: 100,*/}
            {/*    boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",*/}
            {/*}}>*/}
                {/*<img*/}
                {/*    onContextMenu={(e) => e.preventDefault()}    */}
                {/*    style={{*/}
                {/*    width: 1200,*/}
                {/*    height: 700,*/}
                {/*    pointerEvents: 'none'*/}
                {/*}} src={PersonalSpaceImage} alt="qwe" />*/}
            {/*</div>*/}
        </div>
    );
};
export default MainPage;