// VenueMenu.js

/*
FUNCTIONALITY:

  1. Display list of items + prices
  2. Select desired items

*/
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CardView from 'react-native-cardview';
import 'geolib';

export default class BudgetPage extends Component {

  constructor(props) {
    // will get passed in:
    // currlatitude, currlongitude, venuelatitude, venuelongitude
    super(props);
    this.incrementAmount = this.incrementAmount.bind(this);
    this.decrementAmount = this.decrementAmount.bind(this);
    this.incrementTime = this.incrementTime.bind(this);
    this.decrementTime = this.decrementTime.bind(this);
    this.state = {
      amount: '0',
      hours: '0',
      minutes: '0'
    };
  }

  incrementAmount() {
    const curr = Number(this.state.amount) + 1;
    this.setState({
      amount: String(curr)
    });
  }

  decrementAmount() {
    const curr = Number(this.state.amount) - 1;
    if(curr >= 0) {
      this.setState({
        amount: String(curr)
      });
    }
  }

  incrementTime() {
    const currMin = Number(this.state.minutes) + 1;
    const currHour = Number(this.state.hours) + 1;
    if(currMin > 59) {
      this.setState({
        hours: String(currHour),
        minutes: '0'
      });
    }
    else {
      this.setState({
        minutes: String(currMin)
      });
      if(this.state.hours == null) {
        this.setState({
          hours: '0'
        });
      }
    }
  }

  decrementTime() {
    const currMin = Number(this.state.minutes) - 1;
    const currHour = Number(this.state.hours) - 1;
    if(currMin < 0 && currHour > 0) {
      this.setState({
        hours: String(currHour),
        minutes: '59'
      });
    }
    else if(currMin > 0) {
      this.setState({
        minutes: String(currMin)
      });
    }
  }

  render() {
    // how much are you willing to spend?
    // use +/- or use input using keyboard
    // display URL for menu

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <CardView
          cardElevation={2}
          cardMaxElevation={5}
          cornerRadius={10}
          style={styles.moneyHeader}>
          <View style={styles.subContainerHeader}>
            <Text style={styles.headerText}>How much money will you spend here?</Text>
          </View>
        </CardView>
        <CardView
          cardElevation={2}
          cardMaxElevation={5}
          cornerRadius={10}
          style={styles.body}>
          <View style={styles.subContainerBody}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.bodyText}
              onChangeText={(value) => this.setState({amount: value})}
              placeholder={this.state.amount}
              maxLength={6}
              keyboardType='numeric'
              value={this.state.amount}
              />
          </View>
          <CardView
            cardElevation={0}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.arrowsContainer}>
            <TouchableOpacity onPress={this.incrementAmount}>
              <Icon name='plus' size={28} iconStyle={{marginVertical: 25, marginHorizontal: 30}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.decrementAmount}>
              <Icon name='minus' size={28} iconStyle={{marginVertical: 25, marginHorizontal: 30}} />
            </TouchableOpacity>
          </CardView>
        </CardView>
        <CardView
          cardElevation={2}
          cardMaxElevation={5}
          cornerRadius={10}
          style={styles.timeHeader}>
          <View style={styles.subContainerHeader}>
            <Text style={styles.headerText}>How much time will you spend here (not</Text>
            <Text style={styles.headerText}>including transportation time)?</Text>
          </View>
        </CardView>
        <CardView
          cardElevation={2}
          cardMaxElevation={5}
          cornerRadius={10}
          style={styles.body}>
          <View style={styles.subContainerBody}>
            <TextInput
              style={styles.dollarSign}
              onChangeText={(value) => this.setState({hours: value})}
              placeholder={this.state.hours}
              maxLength={2}
              keyboardType='numeric'
              value={this.state.hours}
            />
            <Text style={styles.bodyText}>h</Text>
            <TextInput
              style={styles.dollarSign}
              onChangeText={(value) => this.setState({minutes: value})}
              placeholder={this.state.minutes}
              maxLength={2}
              keyboardType='numeric'
              value={this.state.minutes}
            />
            <Text style={styles.bodyText}>m</Text>
          </View>
          <CardView
            cardElevation={0}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.arrowsContainer}>
            <TouchableOpacity onPress={this.incrementTime}>
              <Icon name='plus' size={28} iconStyle={{marginVertical: 25, marginHorizontal: 30}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.decrementTime}>
              <Icon name='minus' size={28} iconStyle={{marginVertical: 25, marginHorizontal: 30}} />
            </TouchableOpacity>
          </CardView>
        </CardView>
        <TouchableOpacity onPress={() => this.props.navigation.push('Transportation',
          {updateData: this.props.navigation.state.params.updateData, currLocation: this.props.navigation.state.params.currLocation,
            venueLocation: this.props.navigation.state.params.venueLocation, venueName: this.props.navigation.state.params.venueName, amount: this.state.amount, hours: this.state.hours, minutes: this.state.minutes })} >
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            cornerRadius={10}
            style={styles.continueButton}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.continueText}>Continue</Text>
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
  moneyHeader: {
    width: 340,
    height: 40,
    marginTop: 50,
    marginVertical: 5,
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    alignItems: 'flex-start'
  },
  timeHeader: {
    width: 340,
    height: 60,
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
  dollarSign: {
    marginLeft: 30,
    marginVertical: 40,
    fontSize: 48,
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'center',
  },
  bodyText: {
    marginVertical: 40,
    fontSize: 48,
    fontFamily: 'Avenir Next',
    color: '#000',
    textAlign: 'center',
  },
  arrowsContainer: {
    width: 60,
    backgroundColor: '#ff4d4d',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
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
