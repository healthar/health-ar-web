import React, { Component } from 'react';
import axios from 'axios';
import './Map.scss';
import MapData from './Map.data.js';

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const position = [37.330917, -121.889185]

class MapLayout extends Component {

    state = {
        loading: false,
        locations: [],
        currentLocation: {}
    };

    updateAllAccounts(radius, lat, lng) {
        this.setState({ loading: true });

        console.log(`{
            GetLocationsNearby(radius: ${radius}, lat: ${lat}, lng: ${lng})
        }`);

        console.log(process.env.REACT_APP_API_URL + 'graphql');

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

	componentDidMount() {
		this.updateAllAccounts(1, 37.330917, -121.889185);
    }

    render() {
        return (<div className='map-layout'>
            <Map center={position} zoom={13}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {this.state.locations.map((location, id) => {
                    return <Marker position={location.geometry.location} onClick={() => {
                        this.setState({
                            currentLocation: location
                        })
                    }}>
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
                        <br/>
                        <b>{this.state.currentLocation.id}</b>
                        <br/>
                        <b>Reviews</b>
                        <br/>
                        {this.state.currentLocation.reviews.map((review, id) => {
                            return <ul>
                                <li>inclusiveSexuality: {((review.inclusiveSexuality) ? "True" : "False")}</li>
                                <li>inclusiveTransgender: {((review.inclusiveTransgender) ? "True" : "False")}</li>
                                <li>unisexBathroom: {((review.unisexBathroom) ? "True" : "False")}</li>
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