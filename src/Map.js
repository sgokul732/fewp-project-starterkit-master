import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import './Map.css';
const mapStyles = {
  width: '80%',
  height: '100%',
  margin:'auto'
};

export class MapContainer extends Component {

    constructor(props){
        super(props);
        this.state={};
    }
    displayMarkers = () => {
        
        return this.props.profile.map((store, index) => {
          return <Marker key={index} id={index} position={{
           lat: store.lat,
           lng: store.lng
         }} onClick={()=>this.setState(store)}
          />
        })
      }
  render() {
    return (<div>
   {  this.state.id &&   <div className="hero">
      <h3>Last Viewed Location</h3> 
   <h3>{this.state.name}</h3>
   <h5>{this.state.lat},{this.state.lng} </h5>
   <h5>{this.state.country}</h5>
   <p>Amazing Level:{this.state.amazing_level} </p>
</div>}
      <Map
        google={window.google}
        zoom={6}
        style={mapStyles}
        initialCenter={{ lat: 49.444, lng: -125.176}}
      >
          {this.displayMarkers()}
      </Map>
      </div>
    );
    
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyD2jIOsTDP80Bx9sxPAHlKizzcw44vnTqY'
})(MapContainer);