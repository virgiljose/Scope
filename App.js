import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import OverviewPage from './screens/OverviewPage';
import SearchPage from './screens/SearchPage';
import BudgetPage from './screens/BudgetPage';
import TransportationPage from './screens/TransportationPage';

const AppStackNavigator = createStackNavigator({
  Overview: {screen: OverviewPage},
  Search: {screen: SearchPage},
  Budget: {screen: BudgetPage},
  Transportation: {screen: TransportationPage}
},
{
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
})

export default createAppContainer(AppStackNavigator)
