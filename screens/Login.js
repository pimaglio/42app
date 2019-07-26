// Components/Search.js

import React from 'react'
import {StyleSheet, View, Button, Linking} from 'react-native';
import {AsyncStorage} from 'react-native';


const CLIENT_ID = '33e1f1c73faff37ed56b6f079189c2ef37897d6757c9978ce920f61953507c64';
const CLIENT_SECRET = '745bb5fc2599e11af6782aa79bd8fbbaeebe3c22f63d3102e83761514cafb17a';
const URI = 'exp://127.0.0.1:19000';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: 'yes',
        }
    }


    async componentDidMount() {
        await AsyncStorage.getItem('TOKEN', (err, result) => {
            if (result !== null) {
                this.infoToken(result);
                this.props.navigation.navigate('Welcome');
            }
        });
    };


    componentWillUnmount() {
        Linking.removeEventListener("url", this._handleOpenURL);
    }

    _storeToken = async (token) => {
        try {
            await AsyncStorage.setItem('TOKEN', token);
        } catch (error) {
            // Error saving data
        }
    };

    _handleTokenExpire = () => {
        AsyncStorage.removeItem('TOKEN');
    };

    infoToken = (result) => {
        fetch('https://api.intra.42.fr/oauth/token/info',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + result
                },
            })
            .then((response) => response.json())
            .then(response => {
                if (response.error === 'invalid_request') {
                    this._handleTokenExpire();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    handleClick = () => {
        Linking.addEventListener("url", this._handleOpenURL);
        Linking.openURL('https://api.intra.42.fr/oauth/authorize?client_id=33e1f1c73faff37ed56b6f079189c2ef37897d6757c9978ce920f61953507c64&redirect_uri=exp%3A%2F%2F127.0.0.1%3A19000&response_type=code');
    };

    _getToken = (code) => {
        let payload = 'grant_type=authorization_code&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + code + '&redirect_uri=' + URI;
        fetch('https://api.intra.42.fr/oauth/token',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: payload
            })
            .then((response) => response.json())
            .then((responseData) => {
                this._storeToken(responseData['access_token']);
                this.props.navigation.navigate('Welcome');
            });
    };

    _handleOpenURL = (event) => {
        Linking.removeEventListener("url", this._handleOpenURL);
        let regex = /[?&]([^=#]+)=([^&#]*)/g,
            match;
        match = regex.exec(event.url);
        if (match[1] === 'code') {
            this._getToken(match[2]);
        }
    };

    render() {
        return (
            <View style={styles.main_container}>
                <Button title='Login' onPress={this.handleClick}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        marginTop: 60
    }
});

export default Login