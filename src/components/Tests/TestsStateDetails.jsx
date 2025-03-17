import React, {useState, useEffect} from 'react';
import {Header} from "../index";


import Typography from "@mui/material/Typography";
import {useLocation} from "react-router-dom";
import {LivePlotWidget} from "../Dashboard/Widgets/DefaultWidgets";
import LinearProgressWithLabel from "../Utils/LinearProgressWithLabel";
import LinearProgressItems from "../Utils/LinearProgressItems";
import {fetch_get} from "../Utils/AuthenticationUtils";
import {FETCH_TEST_STATE} from "../../config";

function add_row(key, value) {
    return <tr>
        <th style={{
            border: '1px solid black',
            paddingRight: '20px',
            paddingLeft: '10px',
            width: '40%',
            textAlign: 'left'
        }}>{key}</th>

        <td style={{
            border: '1px solid black',
            width: '100%',
            paddingRight: '20px',
            paddingLeft: '10px',
            textAlign: 'left'
        }}>
            {value}</td>
    </tr>
}

const TestsStateDetails = () => {
        let location = useLocation();
        const id = location.state?.id || '';
        const title = location.state?.title || '';
        const testType = location.state?.testType || '';
        const device = location.state?.device || [];

        const [progress, setProgress] = useState(0)
        const [iteration, setIteration] = useState(0)
        const [status, setStatus] = useState('IDLE')

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
                    console.log("DATA", data)
                    setIteration(data[0]['iteration'])
                    setProgress(data[0]['progress'])
                    setStatus(data[0]['status'])
                    setCurrentColumn(data[0]['current_column'])
                    setCurrentRow(data[0]['current_row'])
                })
        };

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Tests" title='Tests Details'/>
                <div>
                    <table>
                        <Typography variant="h6" color="text.secondary">
                            {add_row("ID", id)}
                            {add_row("Title", title)}
                            {add_row("Test Type", testType)}
                            {add_row("Device", device)}
                            {add_row("Status", status)}
                            {add_row("Started", "12:30")}
                            {add_row("Estimated Time", '10:05')}
                            {add_row("Current Row", currentRow)}
                            {add_row("Current Column", currentColumn)}
                            {add_row("Progress", <LinearProgressWithLabel value={progress}/>)}
                            {add_row("Iteration", <LinearProgressItems value={(iteration / 10) * 100} current={iteration}
                                                                       total={10}/>)}
                        </Typography>
                    </table>
                </div>
                <br/>
                <LivePlotWidget/>
            </div>
        )
            ;
    }
;

export default TestsStateDetails;