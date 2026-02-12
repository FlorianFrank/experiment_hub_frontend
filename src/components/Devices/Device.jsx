import React from 'react';
import {useNavigate} from "react-router-dom";


const COLORS = {
    online: '#83f28f',
    offline: '#FF0000',
    grey: 'Grey',
};

const DeviceStatus = ({state}) => {
    const getStatusColor = () => COLORS[state] || COLORS.offline;

    return (
        <Button
            style={{background: getStatusColor()}}
            className="statusButton text-white py-1 px-2 capitalize rounded-2xl text-md"
        >
            {state}
        </Button>
    );
};

const Button = ({style, className, onClick, children}) => (
    <button type="button" style={{...style}} className={className} onClick={onClick}>
        {children}
    </button>
);

export const AddTest = ({startTest}) => (
    <Button style={{background: COLORS.grey}} className="text-white py-1 px-2 capitalize rounded-1xl text-md"
            onClick={startTest}>
        Add
    </Button>
);

const deviceProtocolMap = {
    tcp_ip: 'TCP/IP',
    uart: 'UART',
    spi: 'SPI',
};

const deviceTypeMap = {
    nanosec_container: 'NanoSec Container',
    oscilloscope: 'Oscilloscope',
    smu: 'SMU',
    signal_generator: 'Signal Generator'
};

const Device = ({id, name, type, protocol, port, status, idn, additional}) => {
    const deviceProtocolJsonToStr = (protocol) => deviceProtocolMap[protocol] || protocol;
    const deviceTypeJsonToStr = (devType) => deviceTypeMap[devType] || devType;
    const navigate = useNavigate()

    const startTest = () => {
        alert("Currently not supported");
    };

    const GetDeviceInfo = () => (
        <Button style={{background: COLORS.grey}} className="text-white py-1 px-2 capitalize rounded-1xl text-md"
                onClick={() => navigate('/deviceInfo', {
                    state: {
                        title: name,
                        type: type,
                        deviceDict: [{'key': 'Type', 'value': deviceTypeJsonToStr(type)},
                            {'key': 'Protocol', 'value': deviceProtocolJsonToStr(protocol)},
                            {'key': 'Port', 'value': port},
                            {'key': '*IDN?', 'value': idn}].concat(JSON.parse(additional)).concat([{
                            'key': 'Status',
                            'value': status
                        }])
                    }
                })}>
            Get Device Info
        </Button>
    );

    return (
        <tr className="templateRow">
            <td className="text-center">{id}</td>
            <td className="text-center">{name}</td>
            <td className="text-center">{deviceTypeJsonToStr(type)}</td>
            <td className="text-center">{deviceProtocolJsonToStr(protocol)}</td>
            <td className="text-center">{port}</td>
            <td className="text-center">
                <DeviceStatus state={status}/>
            </td>
            <td className="text-center">
                <AddTest startTest={startTest}/>
            </td>
            <td className="text-center">
                <GetDeviceInfo/>
            </td>
        </tr>
    );
};

export default Device;