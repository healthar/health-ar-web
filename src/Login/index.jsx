import React, { Component } from 'react';
import './Login.scss';
import { DynamicFormContainer } from '../UI/DynamicForm';
import LoginData from './Login.data.js';
import axios from 'axios';
import { Link } from "react-router-dom";

class Login extends Component {

    state = {
        loading: false,
        data: [],
        error: null
    }

    onLogin = (formData) => {

        let { email, password } = formData;

        console.log(`{
            Login(
                email: ${ (email) ? '"' + email + '"' : null},
                password: ${ (password) ? '"' + password + '"' : null}
            )
        }`);

        axios.post(process.env.REACT_APP_API_URL + 'graphql', {
            query: `{
        		Login(
                    email: ${ (email) ? '"' + email + '"' : null},
                    password: ${ (password) ? '"' + password + '"' : null}
                )
        	}`
        }).then((result) => {
            console.log(result);
            this.setState({ loading: false });
            if(result.data.data.Login.hasOwnProperty("error"))
                this.setState({
                    error: result.data.data.Login.error
                })
            else
            {
                localStorage.setItem('user', JSON.stringify({
                    id: result.data.data.Login
                }));
                this.props.history.push('/map');
            }
        }).catch((err) => {
            console.log(err);
            this.setState({ loading: false, error: "unknown error" });
        });
    }

    render() {
        let logo = require('assets/all_in_icon@3x.png')
        return (
            <div className='login-page'>
            <img src={logo} alt='logo' className='logo' />
                <section className='login-container'>
                    <section className='login--left'>
                        <div className='login-form'>
                            <h2>Login</h2>

                            <DynamicFormContainer
                                questions={LoginData}
                                editable={true}
                                btnText="Log In"
                                horizontal={false}
                                onSubmit={this.onLogin}
                            />
                            {(this.state.error) ?
                                <p className="error">{this.state.error}</p>
                            :null}

                            <p className="signup-msg">
                                Need an account?
                                <br />
                                <Link to="/signup">Signup Here</Link>
                            </p>
                        </div>
                    </section>
                </section>
            </div>
        )
    }
}

export default Login;