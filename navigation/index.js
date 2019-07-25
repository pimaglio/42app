import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';

import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import Rewards from '../screens/Rewards';
import Trip from '../screens/Trip';

import {theme} from '../constants';

const screens = createStackNavigator({
        Login,
        Welcome,
        Rewards,
        Trip,
    }, {
        headerMode: 'none'
    }
);

export default createAppContainer(screens);