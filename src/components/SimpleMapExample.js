import React,{ Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, } from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/addons/InfoBox'

import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';

import swal from 'sweetalert2';

const google = window.google;
const geocoder= new google.maps.Geocoder;

const config = {
  apiKey: "AIzaSyAy-n9AAPKr4d2eY5WbUuT5_H3AYhMVZEs",
  authDomain: "maps-af71e.firebaseapp.com",
  databaseURL: "https://maps-af71e.firebaseio.com",
  projectId: "maps-af71e",
  storageBucket: "maps-af71e.appspot.com",
  messagingSenderId: "728757124399"
};
firebase.initializeApp(config);

class Uploader extends Component {

  state = {
    isUploading: false,
    progress: 0
  };
  
  handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error) => {
    swal({
      type: 'error',
      title: 'Oops !',
      text: "Something went wrong, please try again.",
      showConfirmButton: false,
      timer: 1500
    });
    console.log(error);
  }
  handleUploadSuccess = (filename) => {
    this.setState({progress: 100, isUploading: false});
    swal({
      type: 'success',
      title: 'Success !',
      text: "Your image has been uploaded.",
      showConfirmButton: false,
      timer: 1500
    });
  };

  render(){
    return (
        <form> 
          <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor'}}>
            UPLOAD IMAGE
            <FileUploader
              hidden
              randomizeFilename
              accept="image/*"
              storageRef={firebase.storage().ref()}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
          </label>
        </form>
    )         
  }
}

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
        <InfoBox 
          onCloseClick={() => props.onMarkerClose(marker)}
          options={{ closeBoxURL: ``, enableEventPropagation: false }}
        >
        <div className='scrollFix'>
          <div className="row">
            <div className='col-md-6'><img className='img' src='http://www.nationsonline.org/gallery/Australia/Twelve-Apostles-Princetown-Australia.jpg' alt='responsive image'/></div>
            <div className='col-md-6'><h4 className='mk-title'>{marker.infoContent}</h4></div>
          </div>
          <Uploader />
        </div>
        </InfoBox>
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