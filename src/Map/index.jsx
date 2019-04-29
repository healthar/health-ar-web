import React, { Component } from 'react';
import axios from 'axios';
import './Map.scss';
import MapData from './Map.data.js';

import { Map, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'

const position = [37.330917, -121.889185]

const L = require('leaflet');

const redMarker = L.icon({
    iconUrl: 'https://i.imgur.com/ruUU57h.png',
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(16, 0),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

const blueMarker = L.icon({
    iconUrl: 'https://i.imgur.com/jZSdhH5.png',
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(16, 0),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

const purpleMarker = L.icon({
    iconUrl: 'https://i.imgur.com/Jx16f2H.png',
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(16, 0),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

class MapLayout extends Component {

    state = {
        loading: false,
        locations: [],
        currentLocation: {}
    };

    /**
     * 
     * @param {*} reviews the reviews associated with a location
     */
    getAverageForLocation(reviews) {
        if (reviews == null || reviews == undefined || reviews.length <= 0) {
            return {
                inclusiveSexuality: "unsure",
                inclusiveTransgender: "unsure",
                unisexBathroom: "unsure"
            }
        }
        else {
            let inclusiveSexuality = 0;
            let inclusiveSexualityCount = 0;

            let inclusiveTransgender = 0;
            let inclusiveTransgenderCount = 0;

            let unisexBathroom = 0;
            let unisexBathroomCount = 0;

            reviews.map((element, id) => {
                if (element.inclusiveSexuality != null) {
                    if (element.inclusiveSexuality)
                        inclusiveSexuality++;
                    inclusiveSexualityCount++;
                }

                if (element.inclusiveTransgender != null) {
                    if (element.inclusiveTransgender)
                        inclusiveTransgender++;
                    inclusiveTransgenderCount++;
                }

                if (element.unisexBathroom != null) {
                    if (element.unisexBathroom)
                        unisexBathroom = unisexBathroom + 1;
                    unisexBathroomCount = unisexBathroomCount + 1;
                }
            })

            let inclusiveSexualityPer = (inclusiveSexualityCount > 0) ? inclusiveSexuality / inclusiveSexualityCount : 0.5;
            let inclusiveTransgenderPer = (inclusiveTransgenderCount > 0) ? inclusiveTransgender / inclusiveTransgenderCount : 0.5;
            let unisexBathroomPer = (unisexBathroomCount > 0) ? unisexBathroom / unisexBathroomCount : 0.5;

            if (inclusiveSexualityPer > 0.7)
                inclusiveSexualityPer = "yes"
            else if (inclusiveSexualityPer > 0.4)
                inclusiveSexualityPer = "unsure"
            else
                inclusiveSexualityPer = "no"

            if (inclusiveTransgenderPer > 0.7)
                inclusiveTransgenderPer = "yes"
            else if (inclusiveTransgenderPer > 0.4)
                inclusiveTransgenderPer = "unsure"
            else
                inclusiveTransgenderPer = "no"

            if (unisexBathroomPer > 0.7)
                unisexBathroomPer = "yes"
            else if (unisexBathroomPer > 0.4)
                unisexBathroomPer = "unsure"
            else
                unisexBathroomPer = "no"

            return {
                inclusiveSexuality: inclusiveSexualityPer,
                inclusiveTransgender: inclusiveTransgenderPer,
                unisexBathroom: unisexBathroomPer
            }
        }
    }

    /**
     * 
     * @param {*} radius radius to search in miles
     * @param {*} lat latitude of the center of the search
     * @param {*} lng longitude of the center of the search
     */
    getLocations(radius, lat, lng) {
        this.setState({ loading: true });

        axios.post(process.env.REACT_APP_API_URL + 'graphql', {
            query: `{
				GetLocationsNearby(radius: ${radius}, lat: ${lat}, lng: ${lng})
			}`
        }).then((result) => {
            console.log(result);
            this.setState({ loading: false, locations: result.data.data.GetLocationsNearby });
        }).catch((err) => {
            this.setState({ loading: false, locations: [] });
        });
    }

    getLocationDetails(id) {
        this.setState({ loading: true });
        axios.post(process.env.REACT_APP_API_URL + 'graphql', {
            query: `{
				GetLocationDetails(id: ${id})
			}`
        }).then((result) => {
            console.log(result);
            this.setState({ loading: false, locationDetails: result.data.data.GetLocationDetails });
            console.log(result.data.data.GetLocationDetails);
        }).catch((err) => {
            this.setState({ loading: false, locationDetails: {} });
        });
    }

    componentDidMount() {
        this.getLocations(1, 37.330917, -121.889185); // default locations
    }

    render() {
        return (<div className='map-layout'>
            <Map center={position} zoom={13} onViewportChanged={({ center, zoom }) => {
                this.getLocations(1, center[0], center[1]); // to update view on drag
            }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {this.state.locations.map((location, id) => {
                    return <Marker icon={(location.reviews.length > 0) ? blueMarker : redMarker} position={location.geometry.location} onClick={() => {
                        this.setState({
                            currentLocation: location
                        })

                        this.getLocationDetails(location.place_id);
                    }}>
                        <Tooltip className={"tooltip"}>
                            {location.name}
                            {(location.reviews.length > 0) ?
                                <div className="tooltip-icons">
                                    <span className={"trans " + this.getAverageForLocation(location.reviews).inclusiveTransgender}></span>
                                    <span className={"sexuality " + this.getAverageForLocation(location.reviews).inclusiveSexuality}></span>
                                    <span className={"bathroom " + this.getAverageForLocation(location.reviews).unisexBathroom}></span>
                                </div>
                                : null}
                        </Tooltip>
                        {/* <Popup onClick>
                            <b>{location.name}</b> - {location.rating}
                            {location.reviews.map((review, id) => {
                                return <ul>
                                    <li>{JSON.stringify(review)}</li>
                                    <li>inclusiveSexuality: {((review.inclusiveSexuality) ? "True" : "False")}</li>
                                    <li>inclusiveTransgender: {((review.inclusiveTransgender) ? "True" : "False")}</li>
                                    <li>unisexBathroom: {((review.unisexBathroom) ? "True" : "False")}</li>
                                </ul>
                            })}
                        </Popup> */}
                    </Marker>
                })}
            </Map>
            <div className="sidebar">
                {Object.keys(this.state.currentLocation).length > 0 ?
                    <>
                        <b>{this.state.currentLocation.name} - {this.state.currentLocation.rating}</b>
                        <br />
                        {/* <b>{this.state.currentLocation.id}</b>
                        <br />
                        <b>{this.state.currentLocation.place_id}</b>
                        <br /> */}
                        <div className="sidebar-icons">
                            <span className={"trans " + this.getAverageForLocation(this.state.currentLocation.reviews).inclusiveTransgender}></span>
                            <span className={"sexuality " + this.getAverageForLocation(this.state.currentLocation.reviews).inclusiveSexuality}></span>
                            <span className={"bathroom " + this.getAverageForLocation(this.state.currentLocation.reviews).unisexBathroom}></span>
                        </div>
                        <br />
                        <b>Reviews</b>
                        <br />
                        {this.state.currentLocation.reviews.map((review, id) => {
                            return <ul>
                                <li>inclusiveSexuality: {((review.inclusiveSexuality) ? "True" : "False")}</li>
                                <li>inclusiveTransgender: {((review.inclusiveTransgender) ? "True" : "False")}</li>
                                <li>unisexBathroom: {((review.unisexBathroom) ? "True" : "False")}</li>
                                <li>desc: {((review.description) ? review.description : "No Description")}</li>
                            </ul>
                        })}
                    </>
                    :
                    <p>select a location</p>}
            </div>
        </div>)
    }
}

export default MapLayout;