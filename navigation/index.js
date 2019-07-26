import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';

import Welcome from '../screens/Welcome';
import Login from '../screens/Login';


const screens = createStackNavigator({
        Login,
        Welcome,
    }, {
        headerMode: 'none'
    }
);

export default createAppContainer(screens);