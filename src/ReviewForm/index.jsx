import React from 'react';
import './ReviewFrom.scss';
import ReviewQA from './review.data';
import { DynamicFormContainer } from '../ui/DynamicForm'

class ReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, 
            error: false,
            data: false
        }
    }

    submitHandler = (formData) => {

    }
    
    render() {
        return (
            <section className='review-form--container'>
                <DynamicFormContainer
                    questions={ReviewQA}
                    onSubmit={this.submitHandler}
                />
            </section>
        )
    }
}

export default ReviewForm;