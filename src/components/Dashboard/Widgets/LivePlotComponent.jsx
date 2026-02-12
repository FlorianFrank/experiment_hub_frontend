import React, {useState, useEffect} from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from "apexcharts";

import {fetch_get} from "../../Utils/AuthenticationUtils";
import {FETCH_LIVE_PLOT_DATA, FETCH_LIVE_PLOT_PROPERTIES} from "../../../config";
import {Alert} from "@mui/lab";
import {useStateContext} from "../../../contexts/ContextProvider";
import LoadingClip from "../../Utils/LoadingClip";


const LivePlotComponent = () => {

    const TICKINTERVAL = 1000;
    const max_nr_points = 1000;

    let lastDate = 0
    const {devices} = useStateContext();
    const [selectedDevice, setSelectedDevice] = useState('None')

    const [chartPropsSet, setChartPropsSet] = useState(false);
    const [alertIsSet, setAlertIsSet] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [series, updateSeries] = useState([]);
    const [options, setOptions] = useState({
        chart: {
            id: 'realtime', height: 350,
            type: 'line',
            animations: {
                enabled: true,
                easing: "linear",
                dynamicAnimation: {
                    speed: 500
                }
            },
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    customIcons: []
                },
                export: {
                    csv: {
                        filename: undefined,
                        columnDelimiter: ',',
                        headerCategory: 'category',
                        headerValue: 'value'
                    }
                },
                autoSelected: 'zoom'
            },
        },
        dataLabels: {
            enabled: false
        },

        markers: {
            size: 0
        }
    })

    const handleChange = (name) => (event) => {
        setSelectedDevice({...selectedDevice, [name]: event.target.value});
    };

    const setChartOptions = () => {
        fetch_get(FETCH_LIVE_PLOT_PROPERTIES, (value) => {
            setAlertIsSet(value)
        }, (value) => {
            setAlertMessage(value)
        }).then((retData) => {
            if (retData) {
                updateSeries(retData['dataLabels'].map((label) => {
                        return {name: label, data: []}
                    }
                ))
                setOptions({
                    xaxis: retData['xaxis'],
                    yaxis: retData['yaxis'],
                    title: retData['title'],
                    legend: retData['legend'],
                    stroke: retData['stroke'],
                    chart: { animations: retData['animations']}
                })
                setChartPropsSet(true)
            } else {
                console.error("FETCH_LIVE_PLOT_PROPERTIES caused an error!")
            }
        })
    }

    useEffect(() => {
            setChartOptions()
            // Set interval to update the chart

        }
        , []
    )

    useEffect(() => {
        const interval = window.setInterval(() => {
            getNewSeries();
        }, 500);

        return () => clearInterval(interval)
    }, [chartPropsSet])


    useEffect(() => {
        // Update series and trigger ApexCharts update when component mounts or series changes
        ApexCharts.exec('realtime', 'updateSeries', series);
    }, [series]);

    const getNewSeries = () => {

        fetch_get(FETCH_LIVE_PLOT_DATA, (value) => {
            setAlertIsSet(value)
        }, (value) => {
            setAlertMessage(value)
        }).then((retData) => {
            if (retData) {

                let series_list = Array.from({length: series.length}, () => []);

                retData.points.forEach((measure_list, index) => {

                    measure_list.forEach((value) => {
                        const newDate = lastDate + TICKINTERVAL;
                        const newDataPoint = {
                            x: newDate,
                            y: value
                        };
                        series_list[index].push(newDataPoint)
                        lastDate = newDate
                    })
                })
                updateSeries(prevSeries => (
                    prevSeries.map((elem, idx) => ({
                        data: [
                            ...prevSeries[idx].data.slice(-max_nr_points),
                            ...series_list[idx]
                        ],
                    }))
                ));
            }
        })
    }


    if (alertIsSet)
        return (<div><Alert severity="error">{alertMessage}</Alert></div>)

    if (!chartPropsSet)
        return (<LoadingClip/>);

    return (
        <div>

            <select
                id="device"
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                value={devices}
                onChange={(event) => handleChange(event)}
            >
                {devices.map((v) => {
                    return <option value={v.name}>{v.name}</option>
                })}

            </select>
            <div id="chart">
                <Chart options={options} series={series} type="line" height={350}/>
            </div>
            <div id="html-dist"/>
        </div>
    );
}

export default LivePlotComponent;