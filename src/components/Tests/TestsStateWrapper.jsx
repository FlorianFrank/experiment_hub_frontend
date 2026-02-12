import React from 'react';
import TestsStateView from "./TestsStateView";
import {Header} from "../index";


const TestsStateWrapper = () => {
    return (
        <div className="m-2 md:m-10 mt-10 p-2 md:p-10 rounded-3xl">
            <Header category="Tests" title={
                'Tests Status'
            }/>
            <div>
                <TestsStateView  test_state='waiting' headerBgColor={"#0088c9"}/>

            </div>
            <div style={{'padding-top': '5vh'}}>
                <TestsStateView style={{'padding-top': '2vh'}} test_state='running' headerBgColor={"#58508d"}/>

            </div>
            <div style={{'padding-top': '5vh'}}>
                <TestsStateView  test_state='finished' headerBgColor={"#9bb2e0"}/>
            </div>
        </div>
    )
}

export default TestsStateWrapper;
