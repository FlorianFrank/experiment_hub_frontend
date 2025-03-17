import React from 'react';
import {Header} from "../index";

import nanosec_matrix from '../../assets/devices/nanosec_matrix.jpg';
import microcontroller_raspberry_pi_3 from '../../assets/devices/microcontroller_raspberry_pi_3.png';
import oscilloscope_keysight_3000a from '../../assets/devices/oscilloscope_keysight_3000a.png';
import smu_keithley_2600b from '../../assets/devices/smu_keithley_2600b.png';
import keysight_33500b from '../../assets/devices/signal_generator_keysight_33500B.png';
import diglent_atlys from '../../assets/devices/fpga_digilent_atlys.png';


import Typography from "@mui/material/Typography";
import {Button} from "reactstrap";
import {useLocation} from "react-router-dom";

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

function selectDeviceFigure(deviceIdentifier, type) {
    switch (deviceIdentifier) {
        case 'Keithley 2636B SMU':
            return smu_keithley_2600b;
        case 'NanoSec Switchmatrix':
            return nanosec_matrix;
        case 'Keysight 3000a':
            return oscilloscope_keysight_3000a;
        case 'Raspberry Pi 3':
            return microcontroller_raspberry_pi_3;
    }

    if (type === 'fpga' || type === 'FPGA')
        return diglent_atlys
    if (type === 'SMU')
        return smu_keithley_2600b
    if (type === 'Signal Generator' || type === 'signal_generator')
        return keysight_33500b
    if (type === 'Microcontroller')
        return microcontroller_raspberry_pi_3

    return nanosec_matrix
}

const DeviceInfo = () => {
        let location = useLocation();
        const title = location.state?.title || '';
        const type = location.state?.type || '';
        const deviceDict = location.state?.deviceDict || [];

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Dashboard" title='Device Info'/>
                <div>
                    <div style={{float: 'left', paddingTop: '3.5%', paddingRight: '5%'}}>
                        <img src={selectDeviceFigure(title, type)} style={{maxHeight: '600px', maxWidth: '400px'}} alt="logo"/>
                    </div>
                    <div style={{flex: '1', background: 'white'}}>
                        <table>
                            <Typography variant="h6" color="text.secondary">
                                <tr>
                                    <th colSpan={2} style={{textAlign: "left"}}><Typography variant="h4"
                                                                                            color="text.secondary">{title}</Typography>
                                    </th>
                                </tr>
                                <br/>
                                {deviceDict.map((entry) => {
                                    return <tr>
                                        <th style={{
                                            border: '1px solid black',
                                            paddingRight: '20px',
                                            width: '200px',
                                            textAlign: 'left'
                                        }}>{entry['key']}</th>

                                        <td style={{
                                            border: '1px solid black',
                                            width: '200px',
                                            textAlign: 'left'
                                        }}>
                                            {(entry['key'] === 'Status') ?
                                                <DeviceStatus style={{textAlign: 'center'}} state={entry['value']}/> :
                                                entry['value']}</td>
                                    </tr>
                                })}

                            </Typography>
                        </table>
                    </div>
                </div>
            </div>
        )
            ;
    }
;

export default DeviceInfo;