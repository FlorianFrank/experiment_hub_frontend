import React, {useState} from 'react';

import {useNavigate} from 'react-router-dom';
import {Collapse} from '@mui/material';

import {AiTwotoneDelete} from 'react-icons/ai';
import {CiEdit} from 'react-icons/ci';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Alert from '@mui/material/Alert';


import {triggerStartTestToast} from "../../Utils/ToastManager";
import {fetch_delete, fetch_post} from "../../Utils/AuthenticationUtils";
import {formatFieldName} from "../../Utils/FormatUtils";
import {useStateContext} from "../../../contexts/ContextProvider";
import {FETCH_DELETE_CNT_TEST_TEMPLATE, FETCH_SCHEDULE_TEST} from "../../../config";


const INVALID_SELECTION = -1;
const SELECT_ALL = -1;
const REQUIRED_FIELD_MESSAGE = 'This field is required.';


const RowGenericTestTemplate = ({row}) => {
    const {testTemplates, setTestTemplates} = useStateContext();

    const {devices} = useStateContext();
    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    const [alertIsSet, setAlertIsSet] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();


    const [values, setValues] = useState({
        waferID: INVALID_SELECTION,
        pufID: INVALID_SELECTION,
        row: INVALID_SELECTION,
        column: INVALID_SELECTION,
        column_on_puf: SELECT_ALL,
        row_on_puf: SELECT_ALL,
    });

    const [, setErrors] = useState({
        waferID: INVALID_SELECTION,
        pufID: INVALID_SELECTION,
        row: INVALID_SELECTION,
        column: INVALID_SELECTION,
    });

    const {waferConfig} = useStateContext();

    const deleteTest = (row) => {
        fetch_delete(FETCH_DELETE_CNT_TEST_TEMPLATE + row.id, (value) => {
            setAlertIsSet(value)
        }, (value) => {
            setAlertMessage(value)
        }, row).then((data) => {
            if (data) {
                if (data.status === 'ok') {
                    let newTemplateList = []
                    testTemplates.forEach((elem) => {
                        if (!(elem['id'] === row.id && elem['category'] === 'cnt_puf')) {
                            newTemplateList.push(elem)
                        }
                    })
                    setTestTemplates(newTemplateList)
                } else
                    setAlertMessage('fetch_delete returned: ' + data.status)
            }
        })
    };

    const editTest = (id) => {
        console.log('Edit Test', id);
    };

    const startTest = async (id) => {
        console.log('🚀 ~ file: RowMemoryTestTemplate.jsx:58 ~ startTest ~ id:', id);

        const selectedDevice = devices.find(
            (device) => device.id.toString() === selectedDeviceId.toString()
        );

        // Combine the data from row, selectedDevice, and values
        const combinedData = {
            testData: row,
            deviceData: selectedDevice,
            positionData: values
        };
        console.log(combinedData);

        fetch_post(FETCH_SCHEDULE_TEST + '?testCategory=cnt_puf', (value) => {
            setAlertIsSet(value)
        }, (value) => {
            setAlertMessage(value)
        }, combinedData).then((data) => {
            if (data) {
                setResponse(data);
                console.log(response);
            }
        })
    };

    const validate = () => {
        const newErrors = {
            waferID: values.waferID !== -1 ? '' : REQUIRED_FIELD_MESSAGE,
            pufID: values.pufID ? '' : REQUIRED_FIELD_MESSAGE,
            row: values.row ? '' : REQUIRED_FIELD_MESSAGE,
            column: values.column ? '' : REQUIRED_FIELD_MESSAGE
        };

        setErrors(newErrors);

        return Object.values(newErrors).every((x) => x === '');
    };

    const renderOptions = (property) => {
        const matchCondition = (v) => {
            return (
                (values.waferID === SELECT_ALL || Number(v['waferID']) === Number(values.waferID)) &&
                (values.pufID === SELECT_ALL || Number(v['pufID']) === Number(values.pufID)) &&
                (values.row === SELECT_ALL || Number(v['row']) === Number(values.row)) &&
                (values.column === SELECT_ALL || Number(v['column']) === Number(values.column))
            );
        };

        const getPropertyList = (propertyKey) => {
            let propertyList = [];
            waferConfig.forEach((v) => {
                if (matchCondition(v) && !propertyList.includes(v[propertyKey])) {
                    propertyList.push(v[propertyKey]);
                }
            });
            if ((propertyKey === 'columnsOnPUF' || propertyKey === 'rowsOnPUF') && propertyList.length > 0)
                return [propertyList[0]];
            return propertyList;
        };

        console.log("PROP ", property)
        let list_properties = property

        switch (property) {
            case 'columnsOnPUF':
                list_properties = ['all', ...getPropertyList('columnsOnPUF')];
                break;
            case 'rowsOnPUF':
                list_properties = ['all', ...getPropertyList('rowsOnPUF')];
                break;
            case 'waferIDs':
                list_properties = getPropertyList('waferID');
                break;
            case 'pufIDs':
                list_properties = getPropertyList('pufID');
                break;
            case 'rows':
                list_properties = getPropertyList('row');
                break;
            case 'columns':
                list_properties = getPropertyList('column');
                break;
            default:
                list_properties = [];
        }

        if (list_properties.length === 0) {
            return <React.Fragment/>;
        }

        return list_properties.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ));
    };

    const handleChange = (name) => (event) => {
        //  validate(); TODO currently disabled
        setValues({...values, [name]: event.target.value});
    };

    const handleOptionChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    if (alertIsSet)
        return (<div><Alert severity="error">{alertMessage}</Alert></div>)

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.title}
                </TableCell>
                <TableCell align="left">{row.testType}</TableCell>
                <TableCell
                    align="left"
                    className="inline-grid grid-cols-2 gap-4 px-1 py-4"
                >
                    <button
                        type="button"
                        onClick={(_e) => {
                            editTest(row.id);
                        }}
                        className="bg-blue-200/30 p-1 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 opacity-75 hover:opacity-100 outline-none"
                    >
                        <CiEdit/>
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteTest(row);
                        }}
                        className="bg-red-200/30 p-1 rounded-full w-8 h-8 flex items-center justify-center text-red-600 opacity-75 hover:opacity-100 outline-none"
                    >
                        <AiTwotoneDelete/>
                    </button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography
                                className="mr-2 text-gray-900 font-semibold mb-1"
                                gutterBottom
                            >
                                Characteristics
                            </Typography>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                {row['templateFields'].map((entry) => {
                                    if (entry['label'] === 'id' || entry['label'] === 'title') return null;

                                    return (
                                        <div key={entry['label']} className="flex flex-col min-w-0">
                                            <Typography
                                                variant="caption"
                                                className="text-gray-500 font-bold lowercase tracking-normal break-words"
                                            >
                                                {formatFieldName(entry['name'])}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                className="text-gray-900 font-medium mt-0.5 break-words"
                                            >
                                                {String(entry['value'])}
                                            </Typography>
                                        </div>
                                    );
                                })}
                            </div>

                            <br/>
                            <Box xs={{margin: 1}}>
                                <Typography
                                    className="mr-2 text-gray-900 font-semibold mb-1"
                                    gutterBottom
                                >
                                    Instance Info
                                </Typography>

                                <div className="grid md:grid-cols-4 md:gap-6">
                                    {row['instanceFields'].map((entry) => {
                                        return (
                                            <div className="relative z-0 w-full mb-6 group" key={entry['label']}>
                                                <h4>{entry['name']}</h4>
                                                <select
                                                    id={entry['label']}
                                                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                                                    value={values[entry['label']]}
                                                    onChange={handleChange(entry['label'])}
                                                >
                                                    <option value="">
                                                        {values[entry['label']] === INVALID_SELECTION ? (
                                                            <p className="text-red-800 text-sm mt-1">
                                                                * selection required
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </option>
                                                    {renderOptions(entry['value'])}
                                                </select>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Box>
                            <Typography
                                className="mr-2 text-gray-900 font-semibold mb-1"
                                gutterBottom
                            >
                                Execution environment
                            </Typography>
                            <div className="flex items-center bg-white rounded-lg shadow-lg p-6">
                                <Typography
                                    className="mr-2 text-gray-900 font-semibold mb-1"
                                    htmlFor="mySelect"
                                >
                                    Select Board:
                                </Typography>
                                <select
                                    className="mr-2 py-2 px-4 border cursor-pointer  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedDeviceId}
                                    onChange={handleOptionChange}
                                >
                                    <option value="Select Board"/>

                                    {devices.filter(device => device.type === 'fpga' || device.type === 'nanosec_container' && device.status === 'online').map(device => (
                                        <option key={device.id} value={device.id}>
                                            {device.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className={`ml-auto py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        !selectedDeviceId
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        startTest(row.id).catch((errorMsg) => {
                                            console.log('Error while calling startTest: ', errorMsg)
                                        })
                                        navigate('/executionStatus')
                                        triggerStartTestToast(row)
                                    }}
                                    disabled={selectedDeviceId === ''}
                                >
                                    START
                                </button>
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
        ;
}

export default RowGenericTestTemplate;