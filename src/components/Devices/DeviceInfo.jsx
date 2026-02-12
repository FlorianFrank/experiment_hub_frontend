import React from 'react';
import {Header} from "../index";
import {makeStyles} from '@material-ui/core/styles';
import nanosec_matrix from '../../assets/devices/nanosec_matrix.jpg';
import microcontroller_raspberry_pi_3 from '../../assets/devices/microcontroller_raspberry_pi_3.png';
import oscilloscope_keysight_3000a from '../../assets/devices/oscilloscope_keysight_3000a.png';
import smu_keithley_2600b from '../../assets/devices/smu_keithley_2600b.png';
import keysight_33500b from '../../assets/devices/signal_generator_keysight_33500B.png';
import zcu_adapter from '../../assets/devices/zcu_adapter.jpg';


import Typography from "@mui/material/Typography";
import {useLocation} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    container: {
        margin: '20px 40px',
        marginTop: '96px',
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 250, 255, 0.9))',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        '@media (max-width: 768px)': {
            margin: '8px',
            marginTop: '24px',
            padding: '16px',
        },
    },
    contentWrapper: {
        display: 'flex',
        gap: '48px',
        marginTop: '32px',
        '@media (max-width: 1024px)': {
            flexDirection: 'column',
            gap: '32px',
        },
    },
    imageSection: {
        flex: '0 0 400px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        '@media (max-width: 1024px)': {
            flex: '1',
        },
    },
    deviceImage: {
        maxHeight: '600px',
        maxWidth: '100%',
        width: 'auto',
        height: 'auto',
        borderRadius: '16px',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
        },
    },
    infoSection: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    deviceTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #2c3e50, #3498db)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '8px',
        letterSpacing: '-0.02em',
        '@media (max-width: 768px)': {
            fontSize: '2rem',
        },
    },
    infoGrid: {
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    },
    infoCard: {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
        },
    },
    infoLabel: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '8px',
    },
    infoValue: {
        fontSize: '1.125rem',
        fontWeight: '500',
        color: '#1e293b',
        wordBreak: 'break-word',
    },
    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 20px',
        borderRadius: '12px',
        fontSize: '0.95rem',
        fontWeight: '600',
        textTransform: 'capitalize',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        },
    },
    statusOnline: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
    },
    statusOffline: {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    },
    statusDefault: {
        background: 'linear-gradient(135deg, #64748b, #475569)',
    },
}));

const COLORS = {
    online: '#83f28f',
    offline: '#FF0000',
    grey: 'Grey',
};

const DeviceStatus = ({state, classes}) => {
    const getStatusClass = () => {
        if (state === 'online') return classes.statusOnline;
        if (state === 'offline') return classes.statusOffline;
        return classes.statusDefault;
    };

    return (
        <span className={`${classes.statusBadge} ${getStatusClass()}`}>
            {state}
        </span>
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
        return zcu_adapter
    if (type === 'SMU')
        return smu_keithley_2600b
    if (type === 'Signal Generator' || type === 'signal_generator')
        return keysight_33500b
    if (type === 'Microcontroller')
        return microcontroller_raspberry_pi_3

    return nanosec_matrix
}

const DeviceInfo = () => {
    const classes = useStyles();
    let location = useLocation();
    const title = location.state?.title || '';
    const type = location.state?.type || '';
    const deviceDict = location.state?.deviceDict || [];

    return (
        <div className={classes.container}>
            <Header category="Devices" title='Device Information'/>
            
            <div className={classes.contentWrapper}>
                <div className={classes.imageSection}>
                    <img 
                        src={selectDeviceFigure(title, type)} 
                        className={classes.deviceImage}
                        alt={title}
                    />
                </div>
                
                <div className={classes.infoSection}>
                    <Typography className={classes.deviceTitle}>
                        {title}
                    </Typography>
                    
                    <div className={classes.infoGrid}>
                        {deviceDict.map((entry, index) => (
                            <div key={index} className={classes.infoCard}>
                                <div className={classes.infoLabel}>
                                    {entry['key']}
                                </div>
                                <div className={classes.infoValue}>
                                    {entry['key'] === 'Status' ? (
                                        <DeviceStatus state={entry['value']} classes={classes} />
                                    ) : (
                                        entry['value']
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceInfo;