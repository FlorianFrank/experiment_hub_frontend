import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '../../assets/up_logo.png';
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import {FETCH_REQUEST_TOKEN, FETCH_START_NATS} from "../../config";
import {useStylesLogin} from "../Utils/StyledComponents";
import {Alert} from "@mui/lab";


const Login = () => {

    const classes = useStylesLogin();

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');

    const showAlert = (severity, message) => {
        setAlert(<Alert severity={severity}>{message}</Alert>);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // Create the submit method.
    const submitLoginData = async e => {
        e.preventDefault();
        const user = {
            username: username,
            password: password
        };
        try {
            const {data} = await axios.post(FETCH_REQUEST_TOKEN, user, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('current_user', username);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

            try {
                await axios.get(FETCH_START_NATS);
                console.log("Fetch nats start")
            } catch (e) {
                showAlert('error', 'NATS service not started');
            }

            navigate('/overview');

            setAlert('');
        } catch (e) {
            showAlert('error', 'Incorrect login data');
        }
    };


    return (
        <div className="flex justify-start items-center flex-col h-screen">
            <div className="relative w-full h-full">
                <div
                    className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
                    <div className="shadow-2xl" style={{'paddingBottom': '20px'}}>
                        <Container component="main" maxWidth="xs">
                            <CssBaseline/>
                            <div className={classes.paper}>
                                <div className="p-5">
                                    <img src={logo} width="250px" alt="logo"/>
                                    PUF Execution & Evaluation Platform
                                </div>
                                <form className={classes.form} noValidate>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        autoFocus
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        autoComplete="current-password"
                                    />
                                    {alert}

                                    <FormControlLabel
                                        control={<Checkbox value="remember" color="primary"/>}
                                        label="Remember me"
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={submitLoginData}
                                        className={classes.submit}
                                    >
                                        Sign In
                                    </Button>
                                    <Grid container>
                                        <Grid item xs>
                                            <Link href="#" variant="body2">
                                                Forgot password?
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Link href="#" variant="body2">
                                                {"Don't have an account? Sign Up"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
