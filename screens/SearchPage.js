import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CardView from 'react-native-cardview';
import StarRating from 'react-native-star-rating';

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // search information
      response: null,
      text: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {

    // zomato api key: 667c1b9e37e268fa42277abb6b6d87d2
    const first = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
    const second = '&radius=160000&type=restaurant&keyword='
    const third = '&key=AIzaSyB7yher8Q1-RILH7bZYXRHUpVI6lH5mbZA';

    var query = first + this.props.navigation.state.params.currLatitude + ',' + this.props.navigation.state.params.currLongitude + second + this.state.text + third;
    query = query.replace(/ /g,"+");

    return fetch(query)
    .then ( (response) => response.json() )
    .then( (responseJson) => {
      this.setState({response: responseJson.results, text: ''});
      console.log(this.state.response);
    })
    .catch((error) => {
      console.log(error)
    })
    ;

  }

  render() {

    const SearchBar = (
        <View style={styles.header} >
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.searchBar}>
            <TextInput
              style={styles.searchBarText}
              onChangeText={(text) => this.setState({text: text})}
              onSubmitEditing={this.handleSubmit}
              placeholder="Enter a venue"
              value={this.state.text}
              />
          </CardView>
          <TouchableOpacity onPress={this.handleSubmit}>
            <CardView
              cardElevation={2}
              cardMaxElevation={5}
              cornerRadius={10}
              style={styles.searchIcon}>

              <Icon name='search' />
            </CardView>
          </TouchableOpacity>
        </View>
    )

    var Results = <View></View>;

    if(this.state.response) {
      Results = (this.state.response).map(result => {

        var currLocation = {latitude: this.props.navigation.state.params.currLatitude, longitude: this.props.navigation.state.params.currLongitude};
        var venueLocation = {latitude: result.geometry.location.lat, longitude: result.geometry.location.lng};

        return (
          <TouchableOpacity onPress={() => this.props.navigation.push('Budget', {updateData: this.props.navigation.state.params.updateData, venueName: result.name, currLocation: currLocation, venueLocation: venueLocation})}>
            <CardView
              cardElevation={2}
              cardMaxElevation={5}
              cornerRadius={10}
              style={styles.searchResultsContainer}>
              <Text style={styles.searchResultsTextTitle}>{result.name}</ Text>
              <View style={styles.subContainer}>
                <StarRating containerStyle={styles.starContainer} disabled={true} maxStars={5} halfStarEnabled={true} rating={result.rating} starSize={20} />
                <Text style={styles.searchResultsPriceLevel}>{'$'.repeat(result.price_level)}</ Text>
              </View>
              <Text style={styles.searchResultsTextAddress}>{result.vicinity}</ Text>
              <Text style={styles.searchResultsTextAddress}>{geolib.getDistance(currLocation, venueLocation, 100)/1000} km away</ Text>
            </CardView>
          </TouchableOpacity>
        )
      })
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {SearchBar}
        {Results}
      </ScrollView>
    );
  };
}

  const styles = StyleSheet.create({
    container: {
      flex: 0,
      flexGrow: 1,
      justifyContent: 'flex-start',
      flexDirection: 'column',
      alignItems: 'center',
      //008CC5
      backgroundColor: '#00ccff',
    },
    starContainer: {
      marginLeft: 15,
    },
    subContainer: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      marginBottom: 5,
    },
    header: {
      marginBottom: 25,
      justifyContent: 'flex-start',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    searchBar: {
      width: 300,
      height: 40,
      marginTop: 50,
      marginVertical: 5,
      flexDirection: 'row',
      backgroundColor: '#f2f2f2',
      alignItems: 'flex-start'
    },
    searchBarText: {
      marginTop: 10,
      marginLeft: 20,
      fontSize: 16,
      fontFamily: 'Avenir Next',
      color: '#000',
      textAlign: 'left',
    },
    searchIcon: {
      width: 40,
      height: 40,
      marginTop: 50,
      marginVertical: 5,
      marginHorizontal: 5,
      flexDirection: 'column',
      backgroundColor: '#f2f2f2',
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchResultsContainer: {
      width: 345,
      height: 120,
      marginVertical: 5,
      flexDirection: 'column',
      backgroundColor: '#f2f2f2',
      alignItems: 'flex-start'
    },
    searchResultsTextTitle: {
      marginTop: 10,
      marginBottom: 5,
      marginLeft: 15,
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Avenir Next',
      color: '#000',
      textAlign: 'center'
    },
    searchResultsPriceLevel: {
      marginLeft: 15,
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Avenir Next',
      color: '#000',
      textAlign: 'center'
    },
    searchResultsTextAddress: {
      marginLeft: 15,
      fontSize: 14,
      textAlign: 'center',
      fontFamily: 'Avenir Next',
      color: '#000',
      textAlign: 'center'
    }
  });
