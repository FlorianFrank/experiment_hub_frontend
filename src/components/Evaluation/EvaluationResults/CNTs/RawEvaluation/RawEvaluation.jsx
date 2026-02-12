import React from 'react';
import {useLocation} from "react-router-dom";
import CNTEvaluationTemplate from "../CNTEvaluationTemplate";

const RawEvaluation = () => {
    let location = useLocation();

    const {id, title, startTime, stopTime} = location.state || {};
    const identifier = id || -1;

    return (
            <CNTEvaluationTemplate
                measurementType={'Raw Result'}
                identifier={identifier}
                title={title}
                startTime={startTime}
                stopTime={stopTime}
                resultTableHeader={['VDS', 'Min', 'Max']}
                resultKeyList={['vds', 'min', 'max']}
                visualization_height={window.innerHeight * 0.5} visualization_width={window.innerHeight * 0.5}/>
    );
};

export default RawEvaluation;


