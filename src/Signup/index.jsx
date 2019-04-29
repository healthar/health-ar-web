import React, { Component } from 'react';
import { withRouter } from "react-router";
import '../Login/Login.scss';
import { DynamicFormContainer } from '../UI/DynamicForm';
import LoginData from './Login.data.js';
import axios from 'axios';

class Signup extends Component {

    state = {
        loading: false,
        data: [],
        error: null
    }

    onSignup = (formData) => {

        // console.log(formData);

        let { name, email, password, password_repeat } = formData;

        this.setState({
            error: null
        })

        if (password != password_repeat) {
            this.setState({
                error: "Passwords must match!"
            })
        } else if (password == null || password_repeat == null) {
            this.setState({
                error: "Fill out password fields!"
            })
        } else if (name == null) {
            this.setState({
                error: "Fill out name field!"
            })
        } else if (email == null) {
            this.setState({
                error: "Fill out email field!"
            })
        } else {
            console.log(` mutation {
                CreateUser(
                    name: ${ (name) ? '"' + name + '"' : null},
                    email: ${ (email) ? '"' + email + '"' : null},
                    password: ${ (password) ? '"' + password + '"' : null}
                )
            }`);

            axios.post(process.env.REACT_APP_API_URL + 'graphql', {
                query: ` mutation {
            		CreateUser(
                        name: ${ (name) ? '"' + name + '"' : null},
                        email: ${ (email) ? '"' + email + '"' : null},
                        password: ${ (password) ? '"' + password + '"' : null}
                    )
            	}`
            }).then((result) => {
                console.log(result);
                this.setState({ loading: false });
                if(result.data.data.CreateUser.hasOwnProperty("error"))
                    this.setState({
                        error: result.data.data.CreateUser.error
                    })
                else
                {
                    localStorage.setItem('user', JSON.stringify(result.data.data.CreateUser));
                    this.props.history.push('/map');
                }
            }).catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: "unknown error" });
            });
        }
    }

    render() {
        return (
            <div className='login-page'>
                <section className='login-container'>
                    <section className='login--left'>
                        <div className='login-form'>
                            <h2>Signup to Continue</h2>

                            <DynamicFormContainer
                                questions={LoginData}
                                editable={true}
                                btnText="Sign Up"
                                horizontal={false}
                                onSubmit={this.onSignup}
                            />
                            {(this.state.error) ?
                                <p className="error">{this.state.error}</p>
                                : null}
                        </div>
                    </section>
                    {/* <section className='login--right'>
                        <div className='registration--patient'>
                            <div className='registration--header'>New Patient?</div>
                            <button className='btn--main'>
                                Patient Registration
                        </button>
                        </div>
                        <div className='registration--doctor'>
                            <div className='registration--header'>New Doctor?</div>
                            <button className='btn--main'>
                                Doctor Registration
                        </button>
                        </div>
                    </section> */}
                </section>
            </div>
        )
    }
}

export default Signup;