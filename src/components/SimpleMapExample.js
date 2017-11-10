import React,{ Component } from 'react';
import { withGoogleMap, InfoWindow, GoogleMap, Marker, } from 'react-google-maps';

const google = window.google;

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
      >
      {marker.showInfo && (
        <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
        <div><h1>Image</h1>
        <a href="#">Upload image here</a>
        </div>
        </InfoWindow>
      )}
      </Marker>
    ))}
  </GoogleMap>
));

class AccessingArgumentsExample extends Component{
  state = {
   markers: [
     {
       position: new google.maps.LatLng(-23.363882, 129.044922),
       showInfo: false,
       infoContent: (
         <h1>cool</h1>
       ),
     },
   ],
   center: new google.maps.LatLng(-25.363882, 131.044922),
 };

 handleMapClick = this.handleMapClick.bind(this);
 handleMarkerClick = this.handleMarkerClick.bind(this);
 handleMarkerClose = this.handleMarkerClose.bind(this);


 handleMapClick(event) {
   this.setState({
     center: event.latLng,
     markers: [
       ...this.state.markers,
       { position: event.latLng },
     ],
   });
 }

 handleMarkerClick(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: true,
          };
        }
        return marker;
      }),
    });
  }

  handleMarkerClose(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false,
          };
        }
        return marker;
      }),
    });
  }

 render() {
   return (
     <AccessingArgumentsExampleGoogleMap
       containerElement={
         <div style={{ height: `600px` }} />
       }
       mapElement={
         <div style={{ height: `600px` }} />
       }
       onMapClick={this.handleMapClick}
       center={this.state.center}
       markers={this.state.markers}
       onMarkerClick={this.handleMarkerClick}
       onMarkerClose={this.handleMarkerClose}
     />
   );
 }
}

export default AccessingArgumentsExample;
