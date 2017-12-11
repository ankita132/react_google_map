import React,{ Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, } from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/addons/InfoBox'
import SearchBox from 'react-google-maps/lib/places/SearchBox'

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
              storageRef={firebase.storage().ref('images')}
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

const INPUT_STYLE = {
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `30px`,
  marginTop: `10px`,
  padding: `0 12px`,
  borderRadius: `1px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
};

const AccessingArgumentsExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={4}
    center={props.center}
    onClick={props.onMapClick}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="Search.."
      inputStyle={INPUT_STYLE}
    />
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
  handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
  handlePlacesChanged = this.handlePlacesChanged.bind(this);

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

  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
  }

  handlePlacesChanged() {
    const places = this._searchBox.getPlaces();
    
    const markers = places.map(place => ({
      position: place.geometry.location,
    }));

    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;
    this.setState({
      center: mapCenter,
      markers,
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
        onSearchBoxMounted={this.handleSearchBoxMounted}
        onPlacesChanged={this.handlePlacesChanged}
      />
    );
  }
}

export default AccessingArgumentsExample;