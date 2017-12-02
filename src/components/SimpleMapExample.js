import React, { Component } from "react";
import {
  withGoogleMap,
  InfoWindow,
  GoogleMap,
  Marker
} from "react-google-maps";

const google = window.google;
const geocoder= new google.maps.Geocoder;

const AccessingArgumentsExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={4}
    defaultCenter={props.center}
    onClick={props.onMapClick}
  >
    {props.markers.map((marker, index) => (
      <Marker
        position={marker.position}
        key={index}
        onClick={() => props.onMarkerClick(marker)}
        onDblClick={() => props.onMarkerDblClick(marker)}
      >
        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div className='scrollFix'>
                <div className="row">
                    <div className='col-md-6'><img className='img' src='http://www.nationsonline.org/gallery/Australia/Twelve-Apostles-Princetown-Australia.jpg' alt='responsive image'/></div>
                    <div className='col-md-6'><h4 className='mk-title'>{marker.infoContent}</h4></div>
                </div>
              <a className='icon-color' href="#"><i className="fa fa-camera fa-lg" aria-hidden="true"></i> Upload Image here</a>
            </div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

class AccessingArgumentsExample extends Component {
  state = {
    markers: [
      {
        position: new google.maps.LatLng(-23.363882, 129.044922),
        showInfo: false,
        infoContent: <span>Cemetery Access, Petermann NT 0872, Australia</span>
      }
    ],
    center: new google.maps.LatLng(-25.363882, 131.044922)
  };

  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerClick = this.handleMarkerClick.bind(this);
  handleMarkerClose = this.handleMarkerClose.bind(this);

  handleMapClick(event) {
      var that=this;
      geocoder.geocode({'location':event.latLng},function(results,status){
         if(status==='OK'){
             const formattedAddress=results[3].formatted_address;
             //console.log(results);
             that.setState({
               center: event.latLng,
               markers: [...that.state.markers, { position: event.latLng , infoContent: formattedAddress }]
             });
         }
      });
  }

  handleMarkerDblClick=(targetMarker)=>{
      const markersCopy=this.state.markers.filter(marker =>{
          if(marker===targetMarker){
              return false;
          }
          return true;
      });
      this.setState({
          markers: markersCopy
      });
  }
  handleMarkerClick(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: true
          };
        }
        marker.showInfo=false;
        return marker;
      })
    });
  }

  handleMarkerClose(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false
          };
        }
        return marker;
      })
    });
  }

  render() {
    return (
      <AccessingArgumentsExampleGoogleMap
        containerElement={<div style={{ height: `600px` }} />}
        mapElement={<div style={{ height: `600px` }} />}
        onMapClick={this.handleMapClick}
        center={this.state.center}
        markers={this.state.markers}
        onMarkerClick={this.handleMarkerClick}
        onMarkerClose={this.handleMarkerClose}
        onMarkerDblClick={this.handleMarkerDblClick}
      />
    );
  }
}

export default AccessingArgumentsExample;
