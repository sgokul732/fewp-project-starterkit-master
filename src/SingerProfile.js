import './SingerProfile.css';
import React from 'react';

class SingerProfile extends React.Component {
  render() {
    let content = "Please wait...";

    if(this.props.profile) {
      content = (
        <div className="SingerProfileData">
          <div className="SingerName">{this.props.profile.name}</div>
          <div className="SingerAmazingLevel">{this.props.profile.amazing_level}</div>
          <div className="SingerCountry">{this.props.profile.country}</div>
        </div>
      );
    }

    return (
      <div className="SingerProfile">{content}</div>
    );
  }
}

export default SingerProfile;
