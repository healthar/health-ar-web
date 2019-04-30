import React from 'react';
import './Location.scss';
import {
    IndividualRating, AggregateRating
} from './Ratings'

const Location = ({ currentLocation, aggregate, toggleReviewFormVisibility }) => {
    const renderDescription = (review) => {
        return review.description && (
            <>
            <div className='sidebar--review-subheader'>
                Description
            </div>
            <div className='sidebar--review-text'>
                {review.description}
            </div>
            </>
    )
    }


    const renderBathroom = (review) => {
        return review.bathroomLocationDescription && (
            <>
            <div className='sidebar--review-subheader'>
                Bathroom Location Description
            </div>
            <div className='sidebar--review-text'>
                {review.bathroomLocationDescription}
            </div>
            </>
    )
    }
    return (
        <section className='location--container'>
            <img className='location--hero-img' alt="location" src='http://placeimg.com/450/300/arch' />
            <div className='location--header'>{currentLocation.name}</div>
            <div className="location-icons">
                <AggregateRating reviews={aggregate} />
            </div>
            <div className='location--add-review-container'>
                <button onClick={() => { toggleReviewFormVisibility() }} className='location--btn'>Add New Review</button>
            </div>
            <div className='location--subheader'>Reviews</div>
            <br />
            {currentLocation.reviews.length > 0 ?
                currentLocation.reviews.map((review, id) => {
                    return (
                        <div className='location--review-single' key={id}>
                            <div className='review-top'>
                                <img className='small-avatar' src={require('assets/user.png')} alt='user' />
                                <div className='location--review-h3'>{`Anonymous ${names[Math.floor(Math.random() * names.length)]}`}</div>
                                <IndividualRating key={id} review={review} />
                            </div>
                            <div className='review-content'>
                                {renderDescription(review)}
                                {renderBathroom(review)}
                            </div>
                        </div>
                    )
                })
            : <p className="no-reviews">No Reviews Yet!</p>}
        </section>
    )
}

export default Location;


const names = [
    'Turtle',
    'Lion',
    'Bunny',
    'Lizard',
    'Fox',

]