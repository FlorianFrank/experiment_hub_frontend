import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {FiSettings} from 'react-icons/fi';
import {TooltipComponent} from '@syncfusion/ej2-react-popups';
import 'react-toastify/dist/ReactToastify.css';

import {
    Navbar,
    Sidebar,
    Devices,
    EvaluationStepper,
    Results,
    Upload,
    EvaluationsPage, RawEvaluation, TestDetail, AddTest,
} from '../components';

import {TestsPage, Overview} from './index';

import {useStateContext} from '../contexts/ContextProvider';
import TestCategorySelector from '../components/Tests/AddTest/TestCategorySelector';
import ScriptExecution from '../components/Tests/AddTest/ScriptExecution';
import VersionInfo from '../components/Utils/VersionInfo';
import DeviceInfo from "../components/Devices/DeviceInfo";
import WaferOverview from "../components/Evaluation/EvaluationResults/CNTs/WaferPlotter/WaferOverview";
import AddDevice from "../components/Devices/AddDevice";
import TestsStateWrapper from "../components/Tests/TestsStateWrapper";
import TestsStateDetails from "../components/Tests/TestsStateDetails";

const Home = () => {

    const {activeMenu} = useStateContext();

    return (
        <div className="flex relative dark:bg-main-dark-bg">
            {/** Setting Button */}
            <div className="fixed right-4 bottom-4" style={{zIndex: '1000'}}>
                <TooltipComponent content="Settings" position="Top">
                    <button
                        type="button"
                        style={{background: 'blue', borderRadius: '50%'}}
                        className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                    >
                        <FiSettings/>
                    </button>
                </TooltipComponent>
            </div>

            {/* Sidebar */}
            {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                    <Sidebar/>
                </div>
            ) : (
                <div className="w-0 dark:bg-secondary-dark-bg ">
                    <Sidebar/>
                </div>
            )}

            {/** Navbar */}
            <div
                className={` dark:bg-main-bg bg-main-bg min-h-screen w-full
            ${activeMenu ? 'md:ml-72' : 'flex-2'}
            `}
            >
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                    <Navbar/>
                </div>
                {/** Routing */}
                <div>
                    <Routes>
                        <Route path="/" element={<Devices/>}/>
                        <Route path="/overview" element={<Overview/>}/>
                        <Route path="/devices" element={<Devices/>}/>
                        <Route path="/addTest" element={<TestCategorySelector/>}/>
                        <Route path="/addTestTemplate" element={<AddTest/>}/>
                        <Route path="/addScriptTest" element={<ScriptExecution/>}/>
                        <Route path="/versionInfo" element={<VersionInfo/>}/>
                        <Route path="/uploadMeasurments" element={<Upload/>}/>
                        <Route path="/deviceInfo" element={<DeviceInfo/>}/>
                        <Route path="/testStateInfo" element={<TestsStateDetails/>}/>

                        <Route path="/addDevice" element={<AddDevice/>}/>
                        {/**TESTS */}
                        <Route path="/tests" element={<TestsPage/>}/>
                        <Route
                            path="/executionStatus"
                            element={<TestsStateWrapper/>}
                        />

                        {/**EVALUATION   */}
                        <Route
                            path="/evaluation/memory"
                            element={<EvaluationStepper evalType={'memory'}/>}
                        />
                        <Route
                            path="/evaluation/cnt_fets"
                            element={<EvaluationStepper evalType={'cnt_puf'}/>}
                        />
                        <Route
                            path="/evaluation"
                            element={<EvaluationsPage/>}
                        />

                        <Route path="/metrics/rawEvaluation" element={<RawEvaluation/>}/>
                        <Route path="/metrics/waferOverview" element={<WaferOverview/>}/>
                        <Route path="/uploadMeasurements" element={<Upload/>}/>
                        <Route path="/results" element={<Results/>}/>
                        <Route path="/testDetail" element={<TestDetail/>}/>
                    </Routes>
                </div>
                {/*End Routing */}
            </div>
            {/* End Navbar */}
        </div>
    );
};

export default Home;
