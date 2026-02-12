import React, {useState, useEffect} from 'react';
import {Header} from "../index";

import Typography from "@mui/material/Typography";
import {useLocation} from "react-router-dom";
import {LivePlotWidget} from "../Dashboard/Widgets/DefaultWidgets";
import LinearProgressWithLabel from "../Utils/LinearProgressWithLabel";
import LinearProgressItems from "../Utils/LinearProgressItems";
import {fetch_get} from "../Utils/AuthenticationUtils";
import {FETCH_TEST_STATE} from "../../config";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    glassContainer: {
        background: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(12px)",
        webkitBackdropFilter: "blur(12px)",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        padding: "30px",
        color: "#1e1e24",
    },
    detailGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "20px",
    },
    detailItem: {
        background: "rgba(255, 255, 255, 0.3)",
        borderRadius: "16px",
        padding: "15px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    label: {
        fontSize: "0.85rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: 600,
        color: "#555",
        marginBottom: "5px",
    },
    value: {
        fontSize: "1.1rem",
        fontWeight: 500,
        color: "#222",
    },
}));

const DetailCard = ({ label, value, classes }) => (
    <div className={classes.detailItem}>
        <Typography className={classes.label}>{label}</Typography>
        <div className={classes.value}>{value}</div>
    </div>
);

const TestsStateDetails = () => {
    let location = useLocation();
    const classes = useStyles();
    const id = location.state?.id || '';
    const title = location.state?.title || '';
    //const testType = location.state?.testType || '';
    const device = location.state?.device || [];

    const [testType, setTestType] = useState("undefined")
    const [progress, setProgress] = useState(0)
    const [iteration, setIteration] = useState(0)
    const [iterations, setIterations] = useState(1)
    const [status, setStatus] = useState('IDLE')

    const [started, setStarted] = useState('-')
    const [estimate, setEstimate] = useState('-')

    const [currentRow, setCurrentRow] = useState(0)
    const [currentColumn, setCurrentColumn] = useState(0)

    const [alertIsSet, setAlertIsSet] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            requestTests()
        }, 1000);

        return () => clearInterval(interval);
    }, [])


    let requestTests = async (test_state) => {
        const data = await
            fetch_get(FETCH_TEST_STATE + '?identifier=' + id, (value) => {
                setAlertIsSet(value)
            }, (value) => {
                setAlertMessage(value)
            }).then((data) => {
                setTestType(data[0]['testType'])
                setIteration(data[0]['iteration'])
                setStarted(data[0]['started'])
                setEstimate(data[0]['estimate'])
                setIterations(data[0]['iterations'])
                setProgress(data[0]['progress'])
                setStatus(data[0]['status'])
                if (data[0]['testType'] === "Carbon Nanotube Tests") {
                    setCurrentColumn(data[0]['current_column'])
                    setCurrentRow(data[0]['current_row'])
                }
            })
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10">
            <div className={classes.glassContainer}>
                <Header category="Tests" title='Tests Details'/>
                
                <div className={classes.detailGrid}>
                    <DetailCard classes={classes} label="ID" value={id} />
                    <DetailCard classes={classes} label="Title" value={title} />
                    <DetailCard classes={classes} label="Test Type" value={testType} />
                    <DetailCard classes={classes} label="Device" value={device} />
                    <DetailCard classes={classes} label="Status" value={status} />
                    <DetailCard classes={classes} label="Started" value={started} />
                    <DetailCard classes={classes} label="Estimated Time" value={estimate} />                    
                    {testType === "Carbon Nanotube Tests" && (
                        <>
                            <DetailCard classes={classes} label="Current Row" value={currentRow} />
                            <DetailCard classes={classes} label="Current Column" value={currentColumn} />
                        </>
                    )}
                    
                    <div className={classes.detailItem} style={{ gridColumn: "span 2" }}>
                        <Typography className={classes.label}>Progress</Typography>
                        <LinearProgressWithLabel value={progress}/>
                    </div>
                    
                    <div className={classes.detailItem} style={{ gridColumn: "span 2" }}>
                        <Typography className={classes.label}>Iteration</Typography>
                        <LinearProgressItems value={(iteration / iterations) * 100} current={iteration} total={iterations}/>
                    </div>
                </div>

                <br/>
                {testType === "Carbon Nanotube Tests" && (
                <div style={{ marginTop: '20px' }}>
                    <LivePlotWidget/>
                </div> )}
            </div>
        </div>
    );
};

export default TestsStateDetails;