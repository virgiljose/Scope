import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CardView from 'react-native-cardview';

export default class TransportationPage extends Component {

  constructor(props) {
    super(props);   // currLocation, vanueLocation, amount, hours, minutes

    this.state = {
      driving: {
        hours: null,
        minutes: null
      },
      transit: {
        hours: null,
        minutes: null,
        cost: 'NO FARE'
      },
      walking: {
        hours: null,
        minutes: null
      }
    }
    this.convertTime = this.convertTime.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  convertTime(value, unit) {
    var sec_num = value;
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    if(unit == "hr") {
      return hours;
    }
    if(unit == "min") {
      return minutes;
    }
  }

  handlePress(transportOption) {

    var totalHr, totalMin, totalCost;

    totalCost = this.props.navigation.state.params.amount;

    if(transportOption == "driving") {
      totalHr = parseInt(this.state.driving.hours, 10);
      totalMin = parseInt(this.state.driving.minutes, 10);
    }
    else if(transportOption == "transit") {
      totalHr = parseInt(this.state.transit.hours, 10);
      totalMin = parseInt(this.state.transit.minutes, 10);
      totalCost += parseInt(this.state.transit.cost, 10);
    }
    else if(transportOption == "walking") {
      totalHr = parseInt(this.state.walking.hours, 10);
      totalMin = parseInt(this.state.walking.minutes, 10);
    }
    totalHr += parseInt(this.props.navigation.state.params.hours, 10);
    totalMin += parseInt(this.props.navigation.state.params.minutes, 10);

    const newPlace = {
      name: this.props.navigation.state.params.venueName,
      location: this.props.navigation.state.params.venueLocation,
      cost: totalCost,
      hours: totalHr,
      minutes: totalMin
    };

    this.props.navigation.state.params.updateData(
      newPlace,
      this.props.navigation.state.params.venueLocation.latitude,
      this.props.navigation.state.params.venueLocation.longitude
    );

    this.props.navigation.popToTop();

    return;
  }

  // retrieve costs of transportation
  componentDidMount() {

    const firstTransit = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins='
    const firstDriving = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=driving&origins='
    const firstWalking = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=walking&origins='
    const second = '&destinations='
    const third = '&key=AIzaSyA3AGOyiOO_TH_J3MTsmnxeyIHmIrgJBQs';

    var queryTransit =
      firstTransit + this.props.navigation.state.params.currLocation.latitude + ',' + this.props.navigation.state.params.currLocation.longitude
      + second + this.props.navigation.state.params.venueLocation.latitude + ',' + this.props.navigation.state.params.venueLocation.longitude
      + third;
    queryTransit = queryTransit.replace(/ /g,"+");

    var queryDriving =
      firstDriving + this.props.navigation.state.params.currLocation.latitude + ',' + this.props.navigation.state.params.currLocation.longitude
      + second + this.props.navigation.state.params.venueLocation.latitude + ',' + this.props.navigation.state.params.venueLocation.longitude
      + third;
    queryDriving = queryDriving.replace(/ /g,"+");

    var queryWalking =
      firstWalking + this.props.navigation.state.params.currLocation.latitude + ',' + this.props.navigation.state.params.currLocation.longitude
      + second + this.props.navigation.state.params.venueLocation.latitude + ',' + this.props.navigation.state.params.venueLocation.longitude
      + third;
    queryWalking = queryDriving.replace(/ /g,"+");

    fetch(queryTransit)
    .then ( (response) => response.json() )
    .then( (responseJson) => {
      if(typeof responseJson.rows[0].elements[0].fare != 'undefined') {
        this.setState( () => ({transit: { hours: this.convertTime(responseJson.rows[0].elements[0].duration.value, "hr"),
        minutes: this.convertTime(responseJson.rows[0].elements[0].duration.value, "min"), cost: responseJson.rows[0].elements[0].fare.text}}));
      }
      else {
        this.setState( () => ({transit: { hours: this.convertTime(responseJson.rows[0].elements[0].duration.value, "hr"),
        minutes: this.convertTime(responseJson.rows[0].elements[0].duration.value, "min")}}));
      }
    })
    .catch((error) => {
      console.log(error)
    });

    fetch(queryDriving)
    .then ( (response) => response.json() )
    .then( (responseJson) => {
      this.setState( () => ({driving: { hours: this.convertTime(responseJson.rows[0].elements[0].duration.value, "hr"),
      minutes: this.convertTime(responseJson.rows[0].elements[0].duration.value, "min")}}));
      }
    )
    .catch((error) => {
      console.log(error)
    });

    fetch(queryWalking)
    .then ( (response) => response.json() )
    .then( (responseJson) => {
      this.setState( () => ({walking: { hours: this.convertTime(responseJson.rows[0].elements[0].duration.value, "hr"),
      minutes: this.convertTime(responseJson.rows[0].elements[0].duration.value, "min")}}));
      }
    )
    .catch((error) => {
      console.log(error)
    });

    return;
  }

  render() {

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <CardView
          cardElevation={2}
          cardMaxElevation={5}
          cornerRadius={10}
          style={styles.header}>
          <View style={styles.subContainerHeader}>
            <Text style={styles.headerText}>Select Desired Mode of Transportation</Text>
          </View>
        </CardView>
        <TouchableOpacity onPress={() => this.handlePress("driving")}>
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.body}>
            <View style={styles.subContainerHeader}>
              <Text style={styles.bodyTitle}>Driving</Text>
              <Text style={styles.bodyText}>{this.state.driving.hours} hr {this.state.driving.minutes} min</Text>
            </View>
          </CardView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.handlePress("transit")}>
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.body}>
            <View style={styles.subContainerHeader}>
              <Text style={styles.bodyTitle}>Public Transit</Text>
              <Text style={styles.bodyText}>{this.state.transit.hours} hr {this.state.transit.minutes} min</Text>
              <Text style={styles.bodyText}>Total fares: {this.state.transit.cost}</Text>
            </View>
          </CardView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.handlePress("walking")}>
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.body}>
            <View style={styles.subContainerHeader}>
              <Text style={styles.bodyTitle}>Walking</Text>
              <Text style={styles.bodyText}>{this.state.walking.hours} hr {this.state.walking.minutes} min</Text>
            </View>
          </CardView>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#00ccff',
  },
  header: {
    width: 340,
    height: 40,
    marginTop: 50,
    marginVertical: 5,
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    alignItems: 'flex-start'
  },
  headerText: {
    marginLeft: 20,
    fontSize: 16,
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'center',
  },
  body: {
    width: 340,
    height: 80,
    marginTop: 50,
    marginVertical: 5,
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    alignItems: 'flex-start'
  },
  bodyTitle: {
    marginLeft: 20,
    fontSize: 20,
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'center',
  },
  bodyText: {
    marginLeft: 20,
    fontSize: 16,
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'center',
  },
  subContainerHeader: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginVertical: 10
  },
  body: {
    width: 340,
    height: 150,
    marginVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  subContainerBody: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  continueButton: {
    width: 120,
    height: 40,
    marginTop: 50,
    backgroundColor: '#f2f2f2',
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    marginHorizontal: 10,
    fontSize: 20,
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'center',
  },
});
