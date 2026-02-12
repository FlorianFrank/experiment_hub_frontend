import React from 'react';

import {useLocation} from "react-router-dom";
import CNTEvaluationTemplate from "../CNTEvaluationTemplate";

const WaferOverview = () => {
    let location = useLocation();

    const identifier = location.state?.id || -1;
    const title = location.state?.title || {};
    const startTime = location.state?.startTime || 'undefined';
    const stopTime = location.state?.stopTime || 'undefined';

    return (
        <CNTEvaluationTemplate
            measurementType={'Wafer Visualizer'}
            identifier={identifier}
            title={title}
            startTime={startTime}
            stopTime={stopTime}
            resultTableHeader={['Wafer', 'Row', 'Column', 'PUF ID', 'Nr. Selected Cells', 'Nr. Conductive',
                'Nr. Non-Conductive', 'Nr. Semi-Conductive', 'Nr. Faulty cells', 'Hamming Weight']}
            resultKeyList={['wafer', 'row', 'column', 'pufID', 'nrSelectedCells', 'nrConductiveCells',
                'nrNonConductiveCells', 'nrSemiConductiveCells', 'nrErrorCells', 'hammingWeight']}
            visualization_height={window.innerHeight*0.7} visualization_width={window.innerHeight*0.9}/>
    );
};

export default WaferOverview;

