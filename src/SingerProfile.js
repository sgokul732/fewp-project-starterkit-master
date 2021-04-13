import './SingerProfile.css';
import React from 'react';
import { MapContainer } from './Map';
import deleteImage from './images/delete.png';


class SingerProfile extends React.Component {
  render() {
    let content = "Please wait...";
   
    if(this.props.profile) {
      content = (
        this.props.profile.map(data=>{ return  <div key={data.id} className="SingerProfileData">
          <div className="SingerName">{data.name}</div>
          <div className="SingerAmazingLevel">{data.amazing_level}</div>
          <div className="SingerCountry">{data.country}</div>
          <img  width="48" height="48" src={deleteImage} onClick={()=>this.props.delete(data.id)} alt="Error"/>
          
        </div>})
      );
    }
  return this.props.profile ? (
    <div >
      <div className="SingerProfile">{content} </div>
       <MapContainer profile={this.props.profile}/> 
      </div>
 
    ):" "
}
}

export default SingerProfile;

