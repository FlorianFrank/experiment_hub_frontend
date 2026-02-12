import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Header from "../../HeaderFooter/Header";
import {FETCH_TEST_CATEGORIES} from "../../../config";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import {Alert} from "@mui/lab";
import LoadingClip from "../../Utils/LoadingClip";

const override = {
    display: 'block',
    margin: '0 auto',
    borderColor: 'blue'
};
const TestCategorySelector = () => {
    const navigate = useNavigate();
    const [selectedTestTypeName, setSelectedTestTypeName] = useState('')
    const [testExecutionTypes, setTestExecutionTypes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [alertIsSet, setAlertIsSet] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const fetchTestCategories = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setAlertIsSet(true);
            setAlertMessage('Permission denied');
            return;
        }
        try {
            const res = await axios.get(FETCH_TEST_CATEGORIES);
            if (res.status === 200) {
                setTestExecutionTypes(res.data.categories)
                setAlertIsSet(false)
            } else {
                setAlertIsSet(true);
                setAlertMessage(`Permission denied - Status: ${res.status}`);
            }

        } catch (error) {
            setAlertIsSet(true)
            setAlertMessage(`Error: ${error.message}`);
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchTestCategories()

    }, [])

    const navigateToNextPage = (testTypeName) => {
        if (testTypeName === 'Script Tests')
            navigate('/addScriptTest', testTypeName)
        else {
            testExecutionTypes.forEach((element) => {
                if (element.name === testTypeName) {
                    navigate('/addTestTemplate',
                        {
                            state: {testType: element.field, testTypeName: element.name}
                        });
                }
            })
        }
    };
    if (alertIsSet) {
        return (
            <div><Alert severity="error">{alertMessage}</Alert></div>
        );
    } else {
        if (isLoading)
            return (
                <LoadingClip/>)
        else
            return (
                <div className="m-2 md:m-10 mt-10 p-2 md:p-10 rounded-3xl">
                    <Header category="Tests" title="Select Test Type"/>
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-1 flex-col gap-3 lg:pl-3 mt-2 w-full">
                            <select
                                id="underline_select"
                                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                                value={selectedTestTypeName}
                                onChange={(event) => {
                                    setSelectedTestTypeName(event.target.value)
                                }}
                            >
                                <option>Select a test execution type</option>
                                {testExecutionTypes.map((testType) => (
                                    <option key={testType.field} value={testType.name}>
                                        {testType.name}
                                    </option>
                                ))}
                            </select>

                            <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                                <button
                                    type="submit"
                                    className="bg-black text-white font-bold p-2 rounded-full w-28 outline-none"
                                    onClick={() => {
                                        navigateToNextPage(selectedTestTypeName)
                                    }}
                                >
                                    Next
                                </button>
                            </Box>
                        </div>
                    </div>
                </div>
            );
    }
}

TestCategorySelector.propTypes = {
    user: PropTypes.object, // Update the prop type based on the actual structure
};

export default TestCategorySelector;
