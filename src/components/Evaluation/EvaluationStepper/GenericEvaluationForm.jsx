import React, {useEffect, useState} from "react";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import {ColorPicker} from "material-ui-color";

import {useStyles} from "../../Utils/StyledComponents";
import {fetch_get} from "../../Utils/AuthenticationUtils";
import {FETCH_EVALUATION_CONFIG, FETCH_EVALUATION_TYPES} from "../../../config";
import {Alert} from "@mui/lab";
import LoadingClip from "../../Utils/LoadingClip";
import {colorMap} from "../../../data/visualization_config";
import {useStateContext} from "../../../contexts/ContextProvider";

const GenericEvaluationForm = ({testCategory, iterations, eventHandlers, evaluationData}) => {
    const styleClasses = useStyles();

    const [evaluationType, setEvaluationType] = useState({})
    const [isLoadingTestMethods, setIsLoadingTestMethods] = useState(true)
    const [isLoadingTestConfig, setIsLoadingTestConfig] = useState(true)
    const [alertIsSet, setAlertIsSet] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [evaluationMethods, setEvaluationMethods] = useState({});


    const {selectedVisualizationProperties, setSelectedVisualizationProperties} = useStateContext();

    const handleChange = (name) => (event) => {
        setSelectedVisualizationProperties({...selectedVisualizationProperties, [name]: event.target.value});
    };

    const handleChangeColorPicker = (name) => (event) => {
        setSelectedVisualizationProperties({...selectedVisualizationProperties, [name]: '#' + event.hex});
    };

    const fetchEvaluationType = async (testCategory) => {
        await fetch_get(FETCH_EVALUATION_TYPES + testCategory, (value) => {
            setAlertIsSet(value)
        }, (value) => {
            setAlertMessage(value)
        }).then((retData) => {
            if (retData) {
                setEvaluationMethods(retData['evaluationMethods']);
                setIsLoadingTestMethods(false);
                if (testCategory === 'cnt_puf') {
                    fetchEvaluationConfig('rawFigure').catch((error) => {
                        console.log('Error while calling fetchEvaluationConfig: ' + error)
                    })
                } else if (testCategory === 'memory') {
                    fetchEvaluationConfig('classicalPUFMetrics').catch((error) => {
                        console.log('Error while calling fetchEvaluationConfig: ' + error)
                    })
                }
            }
        })
    };


    const fetchEvaluationConfig = async (testType) => {
        await fetch_get(FETCH_EVALUATION_CONFIG + testType + '&testCategory=' + testCategory, (value) => {
            setAlertIsSet(value)
        }, (value) => {
            setAlertMessage(value)
        }).then((retData) => {
            if (retData) {
                setEvaluationType(retData);
                let visualizationProperties = {};
                retData['properties'].forEach((prop) => {
                    visualizationProperties[prop['label']] = prop['default'];
                });
                setSelectedVisualizationProperties(visualizationProperties);
                setIsLoadingTestConfig(false);
            }
        })
    };

    useEffect(() => {
        fetchEvaluationType(testCategory).catch((error) => {
            console.log('Error while calling fetchEvaluationConfig: ' + error)
        })
    }, [])

    const renderSelect = (label, title, values, defaultValue) => {
        return <div className="flex">
                <span style={{width: '25%'}}
                      className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                {title}
                    </span>
            <div style={{width: '75%', paddingLeft: '2%'}}>
                <Select
                    id="underline_select"
                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={(!selectedVisualizationProperties[label]) ? defaultValue : selectedVisualizationProperties[label]}
                    onChange={handleChange(label)}
                >

                    {values.map((v) => {
                        return <MenuItem key={v} value={v}>
                            {v}
                        </MenuItem>
                    })}
                </Select>
            </div>
        </div>
    }

    const renderInput = (label, title, defaultValue) => {
        return <div className="flex">
                    <span style={{width: '25%'}}
                          className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                {title}
                    </span>
            <div style={{width: '75%', paddingLeft: '2%'}}>
                <input
                    type='text'
                    id={label}
                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={(!selectedVisualizationProperties[label]) ? defaultValue : selectedVisualizationProperties[label]}
                    onChange={handleChange(label)}
                />
            </div>
        </div>
    }

    const renderColorPicker = (label, title, defaultValue) => {
        return <div className="flex">
                    <span style={{width: '25%'}}
                          className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                {title}
                    </span>
            <div style={{width: '75%', paddingLeft: '2%'}}>

                <ColorPicker style={{width: '100%'}}
                             defaultValue={defaultValue}
                             colorPalette={colorMap}
                             value={(!selectedVisualizationProperties[label]) ? defaultValue : selectedVisualizationProperties[label]}
                             onChange={handleChangeColorPicker(label)}
                /></div>
        </div>
    }

    if (alertIsSet)
        return (<div><Alert severity="error">{alertMessage}</Alert></div>)

    if (isLoadingTestMethods || isLoadingTestConfig)
        return (<LoadingClip/>);


    return (
        (<React.Fragment>
            <FormControl className={styleClasses.formControl} required variant="standard">
                <InputLabel id="select-uniformity-challenges">
                    Evaluation Method
                </InputLabel>
                <Select
                    labelId="select-uniformity-challenges"
                    value={evaluationData.evaluationMethod}
                    onChange={(v) => {
                        setIsLoadingTestConfig(true)
                        eventHandlers.handleSelectEvaluationMethod(v)
                        fetchEvaluationConfig(v.target.value).catch((error) => {
                            console.log('Error while calling fetchEvaluationConfig: ' + error)
                        })

                    }}
                >
                    {evaluationMethods.map((method) => (
                        <MenuItem key={method.value} value={method.value}>
                            {method.label}
                        </MenuItem>
                    ))}
                </Select>
                {evaluationMethods.length === 0 && (
                    <FormHelperText error>
                        Select at least one evaluation method
                    </FormHelperText>
                )}
            </FormControl>

            {evaluationData.evaluationMethod === 'rawFigure' && (
                <FormControl className={styleClasses.formControl} required variant="standard">
                    <InputLabel id="select-iteration">Select Iteration</InputLabel>
                    <Select
                        labelId="select-iteration"
                        value={evaluationData.selectedIteration}
                        onChange={eventHandlers.handleSelectIteration}
                    >
                        {iterations.map((iteration) => (
                            <MenuItem key={iteration} value={iteration}>
                                {iteration}
                            </MenuItem>
                        ))}
                    </Select>
                    {iterations.length === 0 && (
                        <FormHelperText error>
                            Select at least one iteration
                        </FormHelperText>
                    )}
                </FormControl>
            )}

            {evaluationData.evaluationMethod === evaluationType.value && (

                <FormControl className={styleClasses.formControl} required variant="standard">
                    {evaluationType.properties.map((element) => {
                        return (element.type === 'select') ? (
                            renderSelect(element.label, element.name, element.values, element.default)
                        ) : (element.type === 'input') ? renderInput(element.label, element.name, element.default) :
                            (element.type === 'color_picker') ? renderColorPicker(element.label, element.name, element.default) : ''
                    })}
                </FormControl>)}
        </React.Fragment>)
    );
};

export default GenericEvaluationForm;

