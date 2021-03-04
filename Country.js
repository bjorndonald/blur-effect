import React, { Component } from 'react';
import {
    View
} from 'react-native';
// import * as RNLocalize from "react-native-localize";
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';
const NORTH_AMERICA = ['CA', 'MX', 'US'];

class Country extends Component {
  constructor(props){
    super(props);
    // console.log(getAllCountries);
    // const userCountryData = getAllCountries()
    //   .filter((country) => NORTH_AMERICA.includes(country.cca2))
    //   .filter((country) => country.cca2 === "US").pop();

    // console.log(userCountryData);
    this.state = {
        cca2: 'NG',
        callingCode: ''
      };
  }
  componentDidUpdate(){
      console(this.state.cca2)
  }

  render() {
    return (
        <CountryPicker 
          withEmoji
          onChange={(value) => {
              console.log(value);
            this.setState({cca2: value.cca2, callingCode: value.callingCode});
          }}
          onClose={()=> {}}
          cca2={this.state.cca2}
          translation='eng'
        />
    );
  }
}

export default Country;
