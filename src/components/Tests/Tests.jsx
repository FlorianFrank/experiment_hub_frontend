import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {Spinner, Header} from '../index';
import {
    BACKEND_IP_ADDRESS,
    FETCH_TEST_TEMPLATES,
    FETCH_WAFER_CONFIG
} from '../../config'
import {Alert} from "@mui/lab";
import AddTestTypeLayout from "./AddTestTypeLayout";
import axios from "axios";
import {fetch_get} from "../Utils/AuthenticationUtils";
import {useStateContext} from "../../contexts/ContextProvider";
import TestLayout from "./TestLayout/TestLayout";


const Tests = () => {
    const [loading, setLoading] = useState(false);
    //const [tests, setTests] = useState([]);
    const [alertIsSet, setAlertIsSet] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [alertState, setAlertState] = useState('');
    const {testId} = useParams();

    const {waferConfig, setWaferConfig} = useStateContext();
    const {testTemplates, setTestTemplates} = useStateContext();

    const [waferConfigLoaded, setWaferConfigLoaded] = useState(false)
    const [templatesLoaded, setTemplatesLoaded] = useState(false)


    useEffect(() => {
        setLoading(true);
        if (testId) {
            console.log('useEffect byID');
            fetchTestTemplateById(testId);
        } else {
            requestTests();
        }
        setLoading(false);
    }, [testId]);


    const fetchWaferConfigs = async () => {
        fetch_get(FETCH_WAFER_CONFIG, (value) => {
            setAlertIsSet(value)
        }, (value) => {
            setAlertMessage(value)
        }).then((data) => {
            if (data) {
                setWaferConfig(data.configs)
                setWaferConfigLoaded(true)
            }
        })
    }

    useEffect(() => {
            fetchWaferConfigs().catch((errorMsg) => {
                console.log('Error while calling fetchWaferConfigs ', errorMsg)
            })
        }
        , [])

    let requestTests = async () => {
        await fetch_get(FETCH_TEST_TEMPLATES + '?testType=all', (value) => {
            setAlertIsSet(value)
        }, (value) => {
            setAlertMessage(value)
        }).then((data) => {
            console.log(data)
            if (data) {
                setTemplatesLoaded(true)
                setTestTemplates(data['tests'])
            }
        })
    };

    let fetchTestTemplateById = async (id) => {
        const fetchStr = 'http://' + BACKEND_IP_ADDRESS + ':8089/test/tests/' + id
        try {
            let response = await fetch(fetchStr);
            let data = await response.json();

            console.log('DATA:', data);
        } catch (error) {
            setAlertState(<Alert severity="warning">{"Could not fetch from " + fetchStr + ' (' + error + ')'}</Alert>)
        }
    };
    if (alertState !== '') {
        return (
            <React.Fragment>{alertState}</React.Fragment>
        );
    }

    if (alertIsSet)
        return (<div><Alert severity="error">{alertMessage}</Alert></div>)

    if (loading)
        return <Spinner message="Fetching tests"/>;

    return (
        <React.Fragment>
            <Header category="Tests" title="All Tests"/>
            {(waferConfigLoaded && templatesLoaded) ?
                <AddTestTypeLayout
                    color="#0088c9"
                    type="Carbon NanoTube Tests"
                    elements={[[0, <TestLayout
                        color="#ffc107"
                        type="Transfer Characteristic"
                        category='cnt_puf'
                    />],
                        [1, <TestLayout
                            color="#ffc107"
                            type="Output Characteristic"
                            category='cnt_puf'
                        />], [2, <TestLayout
                            color="#ffc107"
                            type="Gate Current"
                            category='cnt_puf'
                        />]
                    ]}
                /> : <Spinner message="Fetching tests"/>}

            {(templatesLoaded) ? <AddTestTypeLayout
                color="#58508d"
                type="Memory Tests"
                elements={[[0, <TestLayout
                    color="#ffc107"
                    type="Reliability Tests"
                    category='memory'
                />],
                    [1, <TestLayout
                        color="#ffc107"
                        type="Read Latency Tests"
                        category='memory'
                    />], [2, <TestLayout
                        color="#ffc107"
                        type="Write Latency Tests"
                        category='memory'
                    />],
                    [3, <TestLayout
                        color="#ffc107"
                        type="Row Hammering Tests"
                        category='memory'
                    />],
                    [4, <TestLayout
                        color="#ffc107"
                        type="DRAM Retention Tests"
                        category='memory'
                    />],
                        [5, <TestLayout
                        color="#ffc107"
                        type="SRAM Startup Tests"
                        category='memory'
                    />]
                ]}
            /> : <Spinner message="Fetching tests"/>}

            {(templatesLoaded) ? <AddTestTypeLayout
                color="#9bb2e0"
                type="Script Tests"
                elements={[[0, <TestLayout
                    color="#ffc107"
                    type="Script Test"
                    category='script'
                />]]}
            /> : <Spinner message="Fetching tests"/>}

        </React.Fragment>
    );
};

export default Tests;
