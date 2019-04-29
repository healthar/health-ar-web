import React from 'react';
import { Checkmark, Cross, Dash } from '../UI/RatingSymbols';
import './Ratings.scss';

export const ratings = [
    {
        name: 'Unisex Bathroom',
        img: require('assets/lgbtq.png'),
        field_name: 'unisexBathroom'
    },
    {
        name: 'Trans Inclusive',
        img: require('assets/trans.png'),
        field_name: 'inclusiveTransgender'
    },
    {
        name: 'LGBTQ Inclusive',
        img: require('assets/lgbtq.png'),
        field_name: 'inclusiveSexuality'
    }
]

export const AggregateRating = ({ reviews, small }) => {
    const renderSymbol = (rating) => {
        if (rating === "unsure") {
            return <Dash />
        } else if (rating === "no") {
            return <Cross />
        } else {
            return <Checkmark />
        }
    }
    const renderAggregateRating = () => {
        let array = [];
        ratings.forEach((rating_type, idx) => {
            array.push(
                <div className='rating--aggregate' key={idx}>
                    <img alt='rating' className='rating--medium' src={rating_type.img} />
                    <div className='rating--text'>{rating_type.name}</div>
                    {renderSymbol(reviews[rating_type.field_name])}
                </div>
            )
        })
        return array;
    }

    return (
        <div className={`${small ? 'rating--aggregate-container--small' : 'rating--aggregate-container'}`}>
            {renderAggregateRating()}
        </div>
    )
}

export const IndividualRating = ({ review }) => {
    const renderRating = () => {
        let array = [];
        ratings.forEach((rating_type, idx) => {
            if (review[rating_type.field_name]) {
                array.push(
                    <img key={idx} alt='rating' className='rating--small' src={rating_type.img} />
                )
            }
        })
        return array;
    }
    return (
        <div className='individual-rating'>
            {renderRating()}
        </div>
    )
}