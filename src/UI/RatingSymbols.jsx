import React from 'react';
import './RatingSymbols.scss';

export const Checkmark = () => (
    <div className='rating rating--checkmark'>
        <i className="fas fa-check"></i>
    </div>
)

export const Cross = () => (
    <div className='rating rating--cross'>
        <i className="fas fa-times"></i>
    </div>
)

export const Dash = () => (
    <div className='rating rating--dash' />
)
