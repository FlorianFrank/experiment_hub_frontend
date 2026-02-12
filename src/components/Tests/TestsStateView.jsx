import React, {useState, useEffect} from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Header} from '../index';
import {Alert} from "@mui/lab";
import {FETCH_TEST_STATE} from "../../config";
import LoadingClip from "../Utils/LoadingClip";
import {fetch_get} from "../Utils/AuthenticationUtils";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Card from "@mui/material/Card";
import {Stack} from "@mui/material";
import LinearProgressWithLabel from "../Utils/LinearProgressWithLabel";
import {useNavigate} from "react-router-dom";

const TestsStateView = ({test_state, headerBgColor}) => {
    const [alertState, setAlertState] = useState(null);
    const [testsListWaiting, setTestsListWaiting] = useState([]);
    const [testsListRunning, setTestsListRunning] = useState([]);
    const [testsListCompleted, setTestsListCompleted] = useState([]);
    const [collapsibleOpen, setCollapsibleOpen] = useState(true);
    const navigate = useNavigate();


    const [loading, setLoading] = useState(true);
    const [alertIsSet, setAlertIsSet] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const interval = window.setInterval(
            () => {
                requestTestState('waiting')
                requestTestState('running')
                requestTestState('finished')
            }
            , 1000);

        return () => clearInterval(interval)
    }, []);

    function requestTestState(testState) {
        requestTests(testState).then((result) => {
            console.log(`requestTests returned ${result}`)
        })
            .catch((error) => {
                console.error(`requestTests returned ${error}`)
            });
    }

    const StyledChip = styled(Card)(() => ({
        backgroundColor: headerBgColor,
        width: '100%',
        marginTop: '5%'
    }));


    const StyledTable = styled(Table)(() => ({
        '&:last-child td, &:last-child th': {
            border: 0
        },
        borderColor: 'primary',
        marginTop: '5px'
    }));

    let requestTests = async (test_state) => {
        const data = await
            fetch_get(FETCH_TEST_STATE + '?filter=' + test_state, (value) => {
                setAlertIsSet(value)
            }, (value) => {
                setAlertMessage(value)
            })
        if (data) {
            setLoading(false)
            const receivedTests = Object.values(data).reduce(
                (acc, array) => acc.concat(array),
                []
            );
            console.log(
                '🚀 ~ file: TestView.jsx:29 ~ request tests at state ' + test_state,
                receivedTests
            );
            if (test_state === 'waiting')
                setTestsListWaiting(receivedTests);
            else if (test_state === 'running')
                setTestsListRunning(receivedTests);
            else if (test_state === 'finished')
                setTestsListCompleted(receivedTests);
        }
    };


    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14
        }
    }));

    const StyledTableRow = styled(TableRow)(({theme}) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0
        }
    }));

    function getTestsList(testState) {
        if (testState === 'waiting')
            return testsListWaiting;
        else if (testState === 'running')
            return testsListRunning;
        else if (testState === 'finished')
            return testsListCompleted;
    }

    const Button = ({style, className, onClick, children}) => (
        <button type="button" style={{...style}} className={className} onClick={onClick}>
            {children}
        </button>
    );

    if (alertIsSet)
        return (
            <div><Alert severity="error">{alertMessage}</Alert></div>
        );
    if (loading)
        return (<LoadingClip/>);
    else
        return (
            <Stack direction="row" spacing={1}>
                <StyledChip>
                    <h1 style={{
                        'font-size': '20px',
                        'font-weight': 'bold',
                        'color': 'white'
                    }}>{(test_state === 'waiting') ? "Waiting" : ((test_state === 'running') ? "Running" : "Completed")}</h1>
                    <TableContainer component={Paper}>
                        <StyledTable aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>ID</StyledTableCell>
                                    <StyledTableCell align="left">Title</StyledTableCell>
                                    <StyledTableCell align="left">Type</StyledTableCell>
                                    <StyledTableCell align="left">Device</StyledTableCell>
                                    {(test_state === 'running') &&
                                        <StyledTableCell align="left">Progress</StyledTableCell>}
                                    <StyledTableCell align="left">Iteration</StyledTableCell>
                                    <StyledTableCell align="left">Status</StyledTableCell>
                                    <StyledTableCell align="left">More</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setCollapsibleOpen(!collapsibleOpen)}
                                >
                                    {collapsibleOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                                </IconButton>
                                {collapsibleOpen && getTestsList(test_state).map((row) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.id}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.title}</StyledTableCell>
                                        <StyledTableCell align="left">{row.testType}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.device}
                                        </StyledTableCell>
                                        {(test_state === 'running') && <StyledTableCell align="left">
                                            {<LinearProgressWithLabel value={row['progress']}/>}
                                        </StyledTableCell>}
                                        <StyledTableCell align="left">
                                            {row.iteration}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.status}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Button
                                                style={{background: 'Grey'}}
                                                className="statusButton text-white py-1 px-2 capitalize rounded-1xl text-md"
                                                onClick={() => navigate('/testStateInfo', {
                                                    state: {
                                                        id: row.id,
                                                        title: row.title,
                                                        testType: row.testType,
                                                        device: row.device
                                                    }
                                                })}
                                            >
                                                More Information
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </StyledTable>
                    </TableContainer>
                </StyledChip>
            </Stack>
        );
};

export default TestsStateView;
