import React from 'react';
import './ReviewForm.scss';
import ReviewQA from './review.data';
import { DynamicFormContainer } from '../UI/DynamicForm'
import axios from 'axios';

class ReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false,
            data: false
        }
    }

    formatData = (formData, creatorId, locationId) => {
        const checkData = ["inclusiveSexuality", "inclusiveTransgender", "unisexBathroom"]
        checkData.forEach(key => {
            if (formData[key] === "positive") {
                formData[key] = true
            } else if (formData[key] === "negative") {
                formData[key] = false
            }
        })
        return formData;
    }

    submitHandler = (formData) => {
        // needs creatorID and locationID!!
        let formattedData = this.formatData(formData)
        let {
            inclusiveSexuality,
            inclusiveTransgender,
            unisexBathroom,
            bathroomLocationDescription,
            description
        } = formattedData

        let creatorID = this.props.creatorID;
        let locationID = this.props.locationID;

        this.setState({ loading: true });

        console.log(formattedData);

        console.log(process.env.REACT_APP_API_URL + 'graphql');

        console.log(`mutation {
            CreateReview(
                creatorID: "${ creatorID}",
                locationID: "${ locationID}",
                inclusiveSexuality: ${ inclusiveSexuality},
                inclusiveTransgender: ${ inclusiveTransgender},
                unisexBathroom: ${ unisexBathroom},
                bathroomLocationDescription: ${ (bathroomLocationDescription) ? '"' + bathroomLocationDescription + '"' : null},
                description: ${ (description) ? '"' + description + '"' : null}
            )
        }`);

        axios.post(process.env.REACT_APP_API_URL + 'graphql', {
            query: `mutation {
        		CreateReview(
                    creatorID: "${creatorID}",
                    locationID: "${locationID}",
                    inclusiveSexuality: ${inclusiveSexuality},
                    inclusiveTransgender: ${inclusiveTransgender},
                    unisexBathroom: ${unisexBathroom},
                    bathroomLocationDescription: ${ (bathroomLocationDescription) ? '"' + bathroomLocationDescription + '"' : null},
                    description: ${ (description) ? '"' + description + '"' : null}
                )
        	}`
        }).then((result) => {
            console.log(result);
            this.setState({ loading: false, data: result.data });
            this.props.createdReview();
        }).catch((err) => {
            this.setState({ loading: false, data: [] });
        });
    }

    render() {
        return (
            <div className='review-form--page'>
                <section className='review-form--container'>
                    <DynamicFormContainer
                        questions={ReviewQA}
                        onSubmit={this.submitHandler}
                        editable={true}
                    />
                </section>
            </div>
        )
    }
}

export default ReviewForm;
