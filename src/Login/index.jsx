import React from 'react';
import './Login.scss';
import { DynamicFormContainer } from '../UI/DynamicForm';
import LoginData from './Login.data.js';

const Login = () => {
    const onLogin = (formData) => {
        // send formData to graphql login mutation
        // on success, navigate to home page
    }
    return (
        <div className='login-page'>
            <section className='login-container'>
                <section className='login--left'>
                    <div className='login-form'>
                        <DynamicFormContainer
                            questions={LoginData}
                            editable={true}
                            btnText="Log In"
                            horizontal={false}
                            onSubmit={onLogin}
                        />
                    </div>
                </section>
                <section className='login--right'>
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
                </section>
            </section>
        </div>
    )
}

export default Login;