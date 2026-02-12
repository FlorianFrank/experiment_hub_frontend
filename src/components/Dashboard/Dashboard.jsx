import React, {useState} from 'react';
import {Grid, Button} from "@material-ui/core";
import {Header} from '..';
import useStyles from "./components/style";

import AddWidgetMenu from "./components/AddWidgetMenu";
import {
    ServerInfoWidget,
    DevicesWidget,
    TestExecutionTableWidget,
    LoggingWidget, LivePlotWidget
} from "./Widgets/DefaultWidgets";


const Dashboard = () => {
        const classes = useStyles();

        const handleDelete = (id) => {
            setWidgetList((prevWidgetList) => {
                const newWidgetList = prevWidgetList.map(row =>
                    row.filter(elem => elem.id !== id)
                );
                return newWidgetList.filter(row => row.length > 0);
            });
        };

        const [widgetIDCtr, setWidgetIDCtr] = useState(5)

        const [widgetList, setWidgetList] = useState([
            [{
                id: 0,
                widget: ServerInfoWidget(() => handleDelete(1), classes),
                colspan: 6,
                rowspan: 1
            }
            ],
            [{
                id: 2,
                widget: DevicesWidget(() => handleDelete(2), classes),
                colspan: 3,
                rowspan: 1
            }, {
                id: 3,
                widget: TestExecutionTableWidget(() => handleDelete(3), classes),
                colspan: 3,
                rowspan: 1
            }], [
                {
                    id: 4,
                    widget: LoggingWidget(() => handleDelete(4), classes),
                    colspan: 6,
                    rowspan: 1
                }
            ],
            [
                {
                    id: 5,
                    widget: LivePlotWidget(() => handleDelete(5), classes),
                    colspan: 6,
                    rowspan: 1
                }
            ]
        ])

        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const addWidget = (title, row, colspan) => {
            let widget = null
            if (title === 'Server Info Widget') {

                widget = {
                    id: widgetIDCtr,
                    widget: ServerInfoWidget(() => handleDelete(widgetIDCtr), classes),
                    colspan: colspan,
                    rowspan: 1
                }
            } else if (title === 'Logging Widget') {
                widget = {
                    id: widgetIDCtr,
                    widget: LoggingWidget(() => handleDelete(widgetIDCtr), classes),
                    colspan: colspan,
                    rowspan: 1
                }
            } else if (title === 'Devices Widget') {
                widget = {
                    id: widgetIDCtr,
                    widget: DevicesWidget(() => handleDelete(widgetIDCtr), classes),
                    colspan: colspan,
                    rowspan: 1
                }
            } else if (title === 'Test Execution Table Widget') {
                widget = {
                    id: widgetIDCtr,
                    widget: TestExecutionTableWidget(() => handleDelete(widgetIDCtr), classes),
                    colspan: colspan,
                    rowspan: 1
                }
            } else if (title  === 'Live Plot Widget') {
                widget = {
                    id: widgetIDCtr,
                    widget: LivePlotWidget(() => handleDelete(widgetIDCtr), classes),
                    colspan: colspan,
                    rowspan: 1
                }
            }
            if (widget) {
                let bk = widgetList;
                bk[row].unshift(widget)
                setWidgetList(bk)
                setWidgetIDCtr(widgetIDCtr + 1)
            }
        }

        return (
            <React.Fragment>
                <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                    <Header category="Dashboard" title='Dashboard'/>

                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >Add Widget</Button>

                    <AddWidgetMenu
                        addWidget={addWidget}
                        anchorEl={anchorEl}
                        open={open}
                        handleClose={handleClose}
                    />

                    <Grid container spacing={4}>
                        {/*TODO*/}
                        {widgetList.map((widgetRow, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                {widgetRow.map((element, colIndex) => (
                                    <Grid item key={colIndex}  xs={element['colspan'] * 2}>
                                        {element.widget}
                                    </Grid>
                                ))}
                            </React.Fragment>
                        ))}
                    </Grid>

                </div>
            </React.Fragment>
        );
    }
;

export default Dashboard;

