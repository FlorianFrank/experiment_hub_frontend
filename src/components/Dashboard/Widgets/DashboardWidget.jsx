import React, {useState} from "react";
import {
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core";
import {MoreVert as MoreIcon} from "@material-ui/icons";
import classnames from "classnames";

// styles
import useStyles from "../components/style";

export default function DashboardWidget({
                                            children,
                                            title,
                                            noBodyPadding,
                                            bodyClass,
                                            disableWidgetMenu,
                                            header,
                                            noHeaderPadding,
                                            headerClass,
                                            style,
                                            noWidgetShadow,
                                            onDeleteHandler
                                        }) {
    const classes = useStyles();

    // local
    const [moreButtonRef, setMoreButtonRef] = useState(null);
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

    return (
        <div className={classes['widgetWrapper']} style={style && {...style}}>
            <Paper className={classes['paper']} style={{background: 'transparent', boxShadow: 'none'}} classes={{
                root: classnames(classes['widgetRoot'], {
                    [classes['noWidgetShadow']]: noWidgetShadow
                })
            }}>
                <div className={classnames(classes['widgetHeader'], {
                    [classes['noPadding']]: noHeaderPadding,
                    [headerClass]: headerClass
                })}>
                    {header ? (
                        header
                    ) : (
                        <React.Fragment>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="h5" color="textSecondary" noWrap style={{marginLeft: '10px'}}>
                                    {title}
                                </Typography>
                                {!disableWidgetMenu && (
                                    <IconButton
                                        style={{marginLeft: 'auto'}}
                                        color="primary"
                                        classes={{root: classes['moreButton']}}
                                        aria-owns="widget-menu"
                                        aria-haspopup="true"
                                        onClick={() => setMoreMenuOpen(true)}
                                        buttonRef={setMoreButtonRef}
                                    >
                                        <MoreIcon/>
                                    </IconButton>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                </div>
                <div
                    className={classnames(classes['widgetBody'], {
                        [classes['noPadding']]: noBodyPadding,
                        [bodyClass]: bodyClass,
                    })}
                >
                    {children}
                </div>
            </Paper>
            <Menu
                id="widget-menu"
                open={isMoreMenuOpen}
                anchorEl={moreButtonRef}
                onClose={() => setMoreMenuOpen(false)}
                disableAutoFocusItem
            >
                <MenuItem>
                    <Typography onClick={() => {
                        setMoreMenuOpen(false)
                    }}>Edit</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography onClick={() => {
                        setMoreMenuOpen(false)
                        onDeleteHandler();
                    }}>Delete</Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}
