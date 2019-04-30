import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from "react-router";
import './Map.scss';
import ReviewForm from '../ReviewForm/index';
import MapData from './Map.data.js';
import Location from './Location';
import { AggregateRating } from './Ratings'
import Avatar from './Avatar';

import { Map, Marker, Popup, TileLayer, Tooltip, Circle, LayerGroup, LayersControl } from 'react-leaflet'

let { Overlay } = LayersControl

const L = require('leaflet');

const xOffset = 16;
const yOffset = 32;

const no_review_marker = L.icon({
    iconUrl: require('assets/no-review@0.5x.png'),
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(xOffset, yOffset),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

const general_good_marker = L.icon({
    iconUrl: require('assets/green@0.5x.png'),
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(xOffset, yOffset),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

const general_bad_marker = L.icon({
    iconUrl: require('assets/red@0.5x.png'),
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(xOffset, yOffset),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

const medical_marker = L.icon({
    iconUrl: require('assets/health@0.5x.png'),
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(xOffset, yOffset),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

const bathroom_marker = L.icon({
    iconUrl: require('assets/bathroom@0.5x.png'),
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(xOffset, yOffset),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

const school_marker = L.icon({
    iconUrl: require('assets/schools@0.5x.png'),
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(xOffset, yOffset),
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

class MapLayout extends Component {

    state = {
        loading: false,
        locations: [],
        currentLocation: {},
        position: [37.330917, -121.889185],
        reviewFormVisibility: false,
        zoom: 13,
        searchVal: null,
        reviews: []
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
    getLocations(radius, lat, lng, category) {
        this.setState({ loading: true });

        if(!category)
            category = this.state.category;

        console.log(`{
            GetLocationsNearby(radius: ${radius}, lat: ${lat}, lng: ${lng}, name: ${(this.state.searchVal ? '"' + this.state.searchVal + '"' : null)}, category: ${((category != null) ? '"' + category + '"' : null)})
        }`);

        axios.post(process.env.REACT_APP_API_URL + 'graphql', {
            query: `{
				GetLocationsNearby(radius: ${radius}, lat: ${lat}, lng: ${lng}, name: ${(this.state.searchVal ? '"' + this.state.searchVal + '"' : null)}, category: ${((category != null) ? '"' + category + '"' : null)})
			}`
        }).then((result) => {
            console.log(result);
            this.setState({
                loading: false,
                locations: result.data.data.GetLocationsNearby,
                currentLocation: (result.data.data.GetLocationsNearby.filter(x => x.place_id == this.state.currentLocation.place_id).length > 0) ? result.data.data.GetLocationsNearby.filter(x => x.place_id == this.state.currentLocation.place_id)[0] : {},
            })
            this.toggleReviewFormVisibility(false);
        }).catch((err) => {
            this.setState({ loading: false, locations: [] });
        });

        axios.post(process.env.REACT_APP_API_URL + 'graphql', {
            query: `{
				GetReviewsNearby(radius: ${radius}, lat: ${lat}, lng: ${lng})
			}`
        }).then((result) => {
            this.setState({
                loading: false,
                reviews: result.data.data.GetReviewsNearby,
            })
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
            this.setState({ loading: false, locationDetails: result.data.data.GetLocationDetails });
        }).catch((err) => {
            this.setState({ loading: false, locationDetails: {} });
        });
    }

    componentDidMount() {
        if (this.getUser() == -1)
            this.props.history.push("/");
        else
            this.getLocations(1, 37.330917, -121.889185); // default locations
    }

    getUser() {
        if (localStorage.getItem('user') == null || JSON.parse(localStorage.getItem('user')).id == null)
            return -1;
        else
            return JSON.parse(localStorage.getItem('user'));
    }

    toggleReviewFormVisibility = (_set) => {
        if (_set != null)
            this.setState({ reviewFormVisibility: _set })
        else
            this.setState({ reviewFormVisibility: this.state.reviewFormVisibility ? false : true })
    }

    componentDidUpdate() {
        console.log("Updated Map");
    }

    logout = () => {
        localStorage.removeItem("user");
        this.props.history.push('/');
    }

    getMarker = (location) => {
        let { types, reviews, hasBR } = location
        let averages = this.getAverageForLocation(reviews);
        if (averages.inclusiveSexuality === 'no' || averages.inclusiveTransgender === 'no') {
            return general_bad_marker;
        }

        if (types.includes('school') || types.includes('university')) {
            return school_marker;
        } 

        if (types.includes('doctor') || types.includes('health')) {
            return medical_marker;
        }

        if (hasBR) {
            return bathroom_marker;
        }

        return general_good_marker;
    }

    render() {
        let { reviewFormVisibility } = this.state;
        let currentLocationAggregate = this.getAverageForLocation(this.state.currentLocation.reviews)
        return (<div className={"map-layout " + (Object.keys(this.state.currentLocation).length > 0 ? "show" : "hide")}>

            <Avatar logout={this.logout} />

            {(Object.keys(this.state.currentLocation).length > 0) && reviewFormVisibility ?
                <ReviewForm
                    title={this.state.currentLocation.name}
                    locationID={this.state.currentLocation.place_id}
                    lat={this.state.currentLocation.geometry.location.lat}
                    lng={this.state.currentLocation.geometry.location.lng}
                    creatorID={this.getUser().id}
                    createdReview={() => {
                        this.getLocations(1, this.state.position[0], this.state.position[1]); // to update view on drag
                    }}
                    toggleReviewFormVisibility={this.toggleReviewFormVisibility}
                />
                : null}

            <Map minZoom={15} center={this.state.position} zoom={this.state.zoom} onViewportChanged={({ center, zoom }) => {
                if(!this.state.reviewFormVisibility)
                {
                    console.log(zoom);
                    this.getLocations(1, center[0], center[1]); // to update view on drag
                    this.setState({
                        position: center,
                        zoom,
                        currentLocation: {}
                    })
                }
            }}>
                <TileLayer
                    url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <LayerGroup>
                    { this.state.zoom < 16 ?
                        this.state.reviews.map((review, id) => {
                            return <Circle center={[review.lat, review.lng]} color={"none"} fillColor={((review.inclusiveTransgender == false || review.inclusiveSexuality == false) ? "red" : "green")} radius={200} />
                        })
                    :null}
                </LayerGroup>
                {this.state.locations.map((location, id) => {
                    return <Marker icon={(location.reviews.length > 0) ? this.getMarker(location) : no_review_marker} position={location.geometry.location} onClick={() => {
                        this.toggleReviewFormVisibility(false);
                        this.setState({
                            currentLocation: location
                        })
                        this.getLocationDetails(location.place_id);
                    }}>
                        <Tooltip className={"tooltip"}>
                            {location.name}
                            {(location.reviews.length > 0) ?
                                <div className="tooltip-icons">
                                    <AggregateRating reviews={this.getAverageForLocation(location.reviews)} small={true} />
                                </div>
                                : null}
                        </Tooltip>
                    </Marker>
                })}
            </Map>
            <div className={"sidebar " + (Object.keys(this.state.currentLocation).length > 0 ? "show" : "hide")}>
                {Object.keys(this.state.currentLocation).length > 0
                    ? <Location
                        currentLocation={this.state.currentLocation}
                        aggregate={currentLocationAggregate}
                        toggleReviewFormVisibility={this.toggleReviewFormVisibility}
                    />
                    : <p>Please select a location</p>
                }
            </div>

            <div className={"topbar " + (Object.keys(this.state.currentLocation).length > 0 ? "show" : "hide")}>
                <div className="search">
                    <input type="text" placeholder="1 Hacker Way, Menlo Park"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                this.getLocations(1, this.state.position[0], this.state.position[1]);
                            }
                        }}
                        onChange={(val) => {
                            this.setState({ searchVal: val.target.value, category: "all" })
                        }}></input>
                    <button onClick={() => {
                        this.getLocations(1, this.state.position[0], this.state.position[1]);
                    }}>Search</button>
                </div>
                <div className="categories">
                    <div className={"all " + (this.state.category == "all" ? "active" : "")} onClick={() => {
                        this.setState({
                            category: "all"
                        })
                        this.getLocations(1, this.state.position[0], this.state.position[1], "all");
                    }}>all</div>
                    <div className={"schools " + (this.state.category == "schools" ? "active" : "")} onClick={() => {
                        this.setState({
                            category: "schools"
                        })
                        this.getLocations(1, this.state.position[0], this.state.position[1], "schools");
                    }}>schools</div>
                    <div className={"medical " + (this.state.category == "medical" ? "active" : "")} onClick={() => {
                        this.setState({
                            category: "medical"
                        })
                        this.getLocations(1, this.state.position[0], this.state.position[1], "medical");
                    }}>medical</div>
                    <div className={"restroom " + (this.state.category == "restroom" ? "active" : "")} onClick={() => {
                        this.setState({
                            category: "restroom"
                        })
                        this.getLocations(1, this.state.position[0], this.state.position[1], "restroom");
                    }}>restrooms</div>
                </div>
            </div>
        </div>)
    }
}

export default MapLayout;