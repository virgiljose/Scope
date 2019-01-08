import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import CardView from 'react-native-cardview';
import 'geolib';

export default class OverviewPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // keep list of places, along with time and cost information
      places: [],
      // keep track of the coordinates of the last location on the list (or if list empty, the user's current location)
      currLatitude: undefined,
      currLongitude: undefined,
      error: undefined,
    };
    this.updateData = this.updateData.bind(this);
    this.clearPlaces = this.clearPlaces.bind(this);
  }

  componentDidMount() {
    // get current location if there is no data
    if(typeof currLatitude === 'undefined') {
      navigator.geolocation.requestAuthorization();
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            currLatitude: position.coords.latitude,
            currLongitude: position.coords.longitude,
          });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    }
  }

  clearPlaces() {
    this.setState( {
      places: [],
      currLatitude: undefined,
      currLongitude: undefined,
      error: undefined,
    });
  }

  updateData(newPlace, latitude, longitude) {

    var places;

    if(this.state.places != []) {
      places = this.state.places;
      places.push(newPlace);
    }
    else {
      places = newPlace;
    }

    this.setState({places: places, currLatitude: latitude, currLongitude: longitude}, () => console.log(this.state));
    console.log('function called');
  }

  // TO-DO: method to render each place (along with relevant information)

  render() {

    var Places, AddPlace;
    if(this.state.places !== undefined && (this.state.places).length != 0) {
      Places = (this.state.places).map(place => {

        return (
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.placeCardStyle}>
            <View style={styles.subContainer}>
              <Text style={styles.titleText}>{place.name}</Text>
              <Text style={styles.bodyText}>Time spent: {place.hours} hr {place.minutes} min</Text>
              <Text style={styles.bodyText}>Cost: {place.cost}</Text>
            </View>
          </CardView>
        )
      });

      AddPlace = (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.props.navigation.push('Search', {updateData: this.updateData, currLatitude: this.state.currLatitude, currLongitude: this.state.currLongitude})}>
            <CardView
              cardElevation={2}
              cardMaxElevation={5}
              cornerRadius={10}
              style={styles.addPlaceButtonStyle}>
              <Text style={styles.addPlaceText}>ADD PLACE</Text>
            </CardView>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.clearPlaces}>
            <CardView
              cardElevation={2}
              cardMaxElevation={5}
              cornerRadius={10}
              style={styles.addPlaceButtonStyle}>
              <Text style={styles.addPlaceText}>CLEAR PLACES</Text>
            </CardView>
          </TouchableOpacity>
        </View>
      );

    }
    else {
      Places = (
        <CardView
          cardElevation={2}
          cardMaxElevation={5}
          cornerRadius={10}
          style={styles.emptyCardStyle}>
          <View style={styles.subContainer}>
            <Text style={styles.bodyText}>Your trip is currently empty.</Text>
            <Text style={styles.bodyText}>Select 'Add Place' to get started!</Text>
          </View>
        </CardView>
      );
      AddPlace = (
        <TouchableOpacity onPress={() => this.props.navigation.push('Search', {updateData: this.updateData, currLatitude: this.state.currLatitude, currLongitude: this.state.currLongitude})}>
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.addPlaceButtonStyle}>
            <Text style={styles.addPlaceText}>ADD PLACE</Text>
          </CardView>
        </TouchableOpacity>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{height:50}}></View>
        {Places}
        {AddPlace}
      </ScrollView>
    );
  }

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
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  emptyCardStyle: {
    width: 350,
    height: 80,
    marginVertical: 5,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
    alignItems: 'center'
  },
  placeCardStyle: {
    width: 350,
    height: 100,
    marginVertical: 5,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
    alignItems: 'center'
  },
  titleText: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'left',
  },
  bodyText: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'left',
  },
  addPlaceButtonStyle: {
    width: 125,
    height: 50,
    marginVertical: 5,
    marginHorizontal: 5,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlaceText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'center'
  }
});
