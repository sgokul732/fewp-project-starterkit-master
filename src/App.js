import React from 'react';
import axios from 'axios';
import './App.css';
import SingerProfile from './SingerProfile';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all: null, 
      row: null,
    };
  }

  //  This example shows us how to get data from our database
  //  Note: in order for this to work, you need to deploy this
  //  application at least once, so that `public/data.php` exists
  //  on Heroku. It uses a library called axios. Think of this
  //  as an alternative to jQuery's .get, .post
  //  https://www.npmjs.com/package/axios#example

  //  Typically speaking, you'd want to abstract the following
  //  methods into a different component, specifically to handle
  //  requests to the API. This gives you a quick way to jump
  //  in and get started.

  all() {
    let that = this;  //  "this" changes inside of the then() function, so we'll save a reference to it
    return axios.get(process.env.REACT_APP_URL + '/data.php')
      .then(function(res) {
        //  We'll set our local state to the rows returned from the example
        that.setState({all: res.data.data});
        return res.data.data;
      })
      .catch(function(err) {
        console.log(err);
        return null;
      });
  }

  get(id) {
    let that = this;  //  "this" changes inside of the then() function, so we'll save a reference to it
    return axios.get(`${process.env.REACT_APP_URL}/data.php?id=${id}`)
      .then(function(res) {
        //  We'll set our local state to the row returned from the example
        that.setState({row: res.data.data});
        return res.data.data;
      })
      .catch(function(err) {
        console.log(err);
        return null;
      });
  }

  update(id, name, amazingLevel, country) {
    let that = this;  //  "this" changes inside of the then() function, so we'll save a reference to it
    let params = new URLSearchParams();
    params.append('name', name);
    params.append('amazing_level', amazingLevel);
    params.append('country', country);
   
    return axios.post(`${process.env.REACT_APP_URL}/data.php?id=${id}`, params)
      .then(function(res) {
        let data = {id: id, name: name, amazing_level: amazingLevel, country: country};
        that.setState({row: data});
        return data;
      })
      .catch(function(err) {
        console.log(err);
        return null;
      });
  }

  delete(id) {
    let that = this;  //  "this" changes inside of the then() function, so we'll save a reference to it
    return axios.delete(`${process.env.REACT_APP_URL}/data.php?id=${id}`, {})
      .then(function(res) {
        that.setState({row: null});
        return res.data.data;
      })
      .catch(function(err) {
        console.log(err);
        return null;
      });
  }

  create(name, amazingLevel, country) {
    let that = this;  //  "this" changes inside of the then() function, so we'll save a reference to it
    let params = new URLSearchParams();
    params.append('name', name);
    params.append('amazing_level', amazingLevel);
    params.append('country', country);

    return axios.post(`${process.env.REACT_APP_URL}/data.php`, params)
      .then(function(res) {
        let data = {name: name, amazing_level: amazingLevel, country: country};
        that.setState({row: data});
        return data;
      })
      .catch(function(err) {
        console.log(err);
        return null;
      });
  }

  runTests() {
    console.log("Test: create a single row");
    this.create("Robyn", 10, "Denmark")
      .then(function(res) {
        console.table(res);
      })
      .catch(function(err) {
        console.log("Failed");
        console.table(err);
      });

    // console.log("Test: get a single row");
    // this.get(3)
    //   .then(function(res) {
    //     console.table(res);
    //   })
    //   .catch(function(err) {
    //     console.log("Failed");
    //     console.table(err);
    //   });

    // console.log("Test: update a single row");
    // this.update(3, "Vengaboys", 7, "Brazil")
    //   .then(function(res) {
    //     console.table(res);
    //   })
    //   .catch(function(err) {
    //     console.log("Failed");
    //     console.table(err);
    //   });

    // console.log("Test: get all rows");
    // this.all()
    //   .then(function(res) {
    //     console.table(res);
    //   })
    //   .catch(function(err) {
    //     console.log("Failed");
    //     console.table(err);
    //   });

    // console.log("Test: delete a single row");
    // this.delete(7)
    //   .then(function(res) {
    //     console.log(res);
    //   })
    //   .catch(function(err) {
    //     console.log("Failed");
    //     console.table(err);
    //   });

  }

  //  componentDidMount runs when React has finished loading
  //  and rendering the component. A great time to try to
  //  get data.
  componentDidMount() {
    this.runTests();
  }

  render() {
    return (
      <div className="App">
        <h3>Artist Spotlight</h3>
        <SingerProfile profile={this.state.row} />
      </div>
    );
  }
}

export default App;
 