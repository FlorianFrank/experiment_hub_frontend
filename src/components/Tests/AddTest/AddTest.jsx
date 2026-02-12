import React, {useEffect, useState} from 'react';
import {FETCH_ADD_TEST, FETCH_DEFAULT_VALUES} from '../../../config';
import {Header} from '../../index';
import {useNavigate} from 'react-router-dom';
import {fetch_get, fetch_post} from '../../Utils/AuthenticationUtils';
import Tooltip from '@mui/material/Tooltip';
import {Typography} from '@material-ui/core';
import {Alert} from '@mui/lab';
import LoadingClip from '../../Utils/LoadingClip';
import {triggerAddTestToast} from "../../Utils/ToastManager";
import {makeStyles} from '@material-ui/core/styles';
import {useLocation} from "react-router-dom";
import {formatFieldName} from "../../Utils/FormatUtils";


const useStyles = makeStyles((theme) => ({
    customTooltip: {
        fontSize: '50px',
    },
}));


const AddTest = () => {
    let location = useLocation();

    const testType = location.state?.testType || '';
    const testTypeName = location.state?.testTypeName || '';

    const classes = useStyles();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true)
    const [alertIsSet, setAlertIsSet] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [values, setValues] = useState({
        title: '',
        testType: ''
    })
    const [, setErrors] = useState({})
    const [testTypes, setTestTypes] = useState([])
    const [input_groups, setInput_groups] = useState([])
    const [, setFields] = useState(false)


    useEffect(() => {
        fetchTestTypes(testType, values.testType).then((result) => {
            console.log(`fetch_test_types returned ${result}`)
        })
            .catch((error) => {
                console.error(`fetch_test_types returned ${error}`)
            });
    }, [])

    const fetchTestTypes = async (testClass, testType) => {
        if (testClass.length > 0) {
            try {
                console.log('Fetch default test template values for test class ' + testClass)
                fetch_get(FETCH_DEFAULT_VALUES + '?testClass=' + testClass + '&testSubclass=' + testType, (value) =>
                    setAlertIsSet(value), (value) => setAlertMessage(value)).then((retData) => {
                    if (!retData || !retData['test_types'] || retData['test_types'].length == 0) {
                        setAlertIsSet(true)
                        setAlertMessage("FETCH_DEFAULT_VALUES returns empty data array")
                        return;
                    }

                    if (testType === '')
                        testType = retData['test_types'][0].field
                    
                    const defaultValueList = { testType: testType }
                    retData['input_fields'][testType]['groups'].forEach((group) => {
                        group['fields'].forEach((field) => {
                            if (field['type'] === 'input')
                                defaultValueList[field['label']] = field['default']
                            if (field['type'] === 'checkbox') {
                                defaultValueList[field['label']] = (field['default'] === 'true')
                            }
                        })
                    })

                    setIsLoading(false)
                    setValues(defaultValueList)
                    setTestTypes(retData['test_types'])
                    setInput_groups(retData['input_fields'])
                })

            } catch (error) {
                console.error('An unexpected error occurred:', error);
            }
        } else {
            console.log('Length of test type is 0')
        }
    }

    const validate = () => {
        let newErrors = {};
        newErrors.title = values.title ? '' : 'This field is required.';
        setErrors(newErrors)
        return Object.values(newErrors).every((x) => x === '');
    };

    const handleSubmit = async (pufType, event) => {
        event.preventDefault();
        try {
            if (validate()) {
                console.log('Send Post Request:' + FETCH_ADD_TEST + '?testClass=' + pufType);

                await fetch_post(FETCH_ADD_TEST + '?testClass=' + pufType,
                    (value) => setAlertIsSet(value),
                    (value) => setAlertMessage(value),
                    values).then((retData) => {
                    if (retData) {
                        console.log('Response Data:', retData);
                        triggerAddTestToast(values)
                        navigate('/tests')
                    }
                });
            } else {
                console.log('Input missing');
                setFields(true)
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };

    const handleChange = (name) => (event) => {
        console.log('🚀 ~ handleChange ~ event:', name, event.target.value);
        setValues(prev => ({ ...prev, [name]: event.target.value }))
    };

    const handleChangeChecked = (name) => (event) => {
        console.log('🚀 ~ handleChangeChecked ~ event:', name, event.target.checked);
        setValues(prev => ({ ...prev, [name]: event.target.checked }))
    };

    const defineInputField = (label, value, value_name, type, tooltip) => {
        return (
            <div key={value_name} className="flex flex-col space-y-1.5 min-w-0 h-full">
                <div className="flex items-center space-x-1">
                    <Typography 
                        variant="caption" 
                        className="text-gray-500 font-bold lowercase tracking-normal truncate"
                        title={formatFieldName(label)}
                    >
                        {formatFieldName(label)}
                    </Typography>
                    {tooltip && (
                        <Tooltip title={tooltip} classes={{tooltip: classes.customTooltip}}>
                            <span className="text-gray-400 cursor-help text-[10px] bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center">?</span>
                        </Tooltip>
                    )}
                </div>
                <input
                    type={type}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none hover:border-gray-300 shadow-sm"
                    value={value}
                    onChange={handleChange(value_name)}
                />
            </div>
        )
    }


    const defineSelectField = (value, onChange, optionList) => {
        return <div className="relative z-0 w-full mb-6 group">
            <label htmlFor="underline_select" className="sr-only">
                Underline select
            </label>
            <select
                id="underline_select"
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                value={value}
                onChange={onChange}
            >
                <option selected>Select a test type</option>
                {optionList.map((testType) => (
                    <option key={testType.field} value={testType.field}>
                        {testType.name}
                    </option>
                ))}
            </select>
        </div>
    }

    const defineCheckbox = (checkedValue, checkedValueName, title) => {
        return (
            <div key={checkedValueName} className="flex items-center h-full pt-6">
                <label className="relative inline-flex items-center cursor-pointer group">
                    <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={values[checkedValueName]}
                        onChange={handleChangeChecked(checkedValueName)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 group-hover:scale-105 transition-transform"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                        {formatFieldName(title)}
                    </span>
                </label>
            </div>
        )
    }

    const returnRenderObject = (renderObj, testType) => {
        return <div className="m-2 md:m-10 mt-10 p-2 md:p-10 rounded-3xl">
            <Header category="Tests" title={"Add " + testType + " Test"}/>
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-1 flex-col gap-3 lg:pl-3 mt-2 w-full">
                    {renderObj}
                </div>
            </div>
        </div>
    }

    if (alertIsSet)
        return <Alert severity="error">{alertMessage}</Alert>
    if (isLoading)
        return <LoadingClip/>

    return returnRenderObject(
        <form onSubmit={(event) => {
            handleSubmit(testType, event).catch((errorMsg) => {
                console.log('Error while calling handleSubmit: ', errorMsg)
            })
        }}>
            <div className="relative z-0 w-full mb-10 group">
                <input
                    type="text"
                    name="floating_Title"
                    id="floating_Title"
                    className="block py-4 px-0 w-full text-2xl font-bold text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer transition-all"
                    placeholder=" "
                    onChange={handleChange('title')}
                    required
                />
                <label
                    htmlFor="floating_Title"
                    className="peer-focus:font-medium absolute text-lg text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                >
                    Test Title
                </label>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
                {defineSelectField(values["testType"], (event) => {
                    fetchTestTypes(testType, event.target.value).catch((error) => {
                        console.error("Error while calling fetch_test_types ", error)
                    })
                }, testTypes)}
            </div>

            {input_groups[values.testType]['groups'].map((group) => {
                return <div key={group['name']} className="mb-12">
                    <Typography 
                        variant="h6" 
                        className="text-gray-900 font-bold mb-6 border-l-4 border-blue-500 pl-4"
                    >
                        {formatFieldName(group['name'])}
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-2">
                        {group['fields'].map((field) => {
                            if (field['type'] === 'input')
                                return defineInputField(field['name'], values[field['label']], field['label'], field['type'], field['tooltip'])
                            if (field['type'] === 'select')
                                return defineSelectField(values[field['label']], handleChange(field['label']), field['options'])
                            if (field['type'] === 'checkbox')
                                return defineCheckbox(values[field['label']], field['label'], field['name'])
                            else
                                return <div key={field['label']}><Alert severity="error">{field['type'] + ' undefined'}</Alert></div>
                        })}
                    </div>
                </div>
            })}
            <button
                type="submit"
                className="bg-black text-white font-bold p-2 rounded-full w-28 outline-none"
            >
                Save
            </button>
        </form>, testTypeName
    )

}

export default AddTest;
