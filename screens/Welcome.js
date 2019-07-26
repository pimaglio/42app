import React, {Component} from 'react'
import {AsyncStorage, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native'
import {LinearGradient} from 'expo';
import rgba from 'hex-to-rgba';
import Icon from 'react-native-vector-icons';
// alternative for expo LinearGradient
// import LinearGradient  from 'react-native-linear-gradient';

import {Block, Badge, Card, Text, Progress,} from '../components';
import {styles as blockStyles} from '../components/Block';
import {styles as cardStyles} from '../components/Card';
import {theme, mocks} from '../constants';
import {CircularProgress} from "react-native-circular-progress";

const {width} = Dimensions.get('window');

export default class Welcome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            login: '',
            id: '',
            nom: '',
            imageUrl: '',
            cursus: [],
            level: '',
            correction_point: '',
            available: '',
            isAvailable: {},
            progress: '',
            progressP: '',
            timeLocation: '',
            timeCurrent: '',
            timeCurrentDay: '',
            allachievements: '',

        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem('TOKEN', (err, result) => {
            if (result !== null) {
                this.infoToken(result);
                this.setState({token: result});
            }
            else
                this.props.navigation.navigate('Login');
        });
        this._fetchProfile();
        this._isAvailable();
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
            .catch((error) => {
                console.error(error);
            });
    };

    _isAvailable = () => {
        if (this.state.available !== '')
        {
            this.setState({isAvailable:
                    {
                        shadowColor: "#57d62f",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 2.62,
                        elevation: 1
                    }
            });
        }
        else {
            this.setState({isAvailable:
                    {
                        shadowColor: "#d62f4e",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 2.62,
                        elevation: 1
                    }
            });
            this.setState({available: 'Not connected'});
        }
    };

    _setProgress = () => {
        let level = this.state.level;
        let regex = /[^.]*$/g,
            match;
        match = regex.exec(level);
        this.setState({progress: '0.' + match[0]});
        if (match[0] <= 9) {
            let regex = /[^0]*$/g,
                match;
            match = regex.exec(test);
            this.setState({progressP: match[0]});
        }
        else
            this.setState({progressP: match[0]});
    };

    _getTime = () => {
        let date = new Date().toJSON();
        let month = date.split('-');
        let day = date.split('-');

        let regex = /[^T]*/g,
            matchday;
        matchday = regex.exec(day[2]);
        let alltime = this.state.timeLocation;
        let i = 0;
        let cumul = 0;
        let cumulday = 0;

        while (alltime[i]){

            let res = alltime[i].begin_at.split('-');
            if (month[1] === res[1])
            {
                let h = 0;
                let m = 0;
                let s = 0;

                let resa = alltime[i].begin_at.split('T');
                let resa2 = resa[1].split(':');
                let regex = /[^.]*/g,
                    match;
                match = regex.exec(resa2[2]);
                h = parseInt(resa2[0], 10) * 3600;
                m = parseInt(resa2[1], 10) * 60;
                s = parseInt(match, 10);
                let totalA = h + m + s;

                let resb = alltime[i].end_at.split('T');
                let resb2 = resb[1].split(':');
                let regex2 = /[^.]*/g,
                    match2;
                match2 = regex2.exec(resb2[2]);
                h = parseInt(resb2[0], 10) * 3600;
                m = parseInt(resb2[1], 10) * 60;
                s = parseInt(match, 10);
                let totalB = h + m + s;
                let total =  totalB - totalA;
                cumul += total;
            }
            let currentday = alltime[i].begin_at.split('-');
            let regex = /[^T]*/g,
                matchcurrentday;
            matchcurrentday = regex.exec(currentday[2]);
            if ('25' === matchcurrentday[0]){
                let h = 0;
                let m = 0;
                let s = 0;

                let resa = alltime[i].begin_at.split('T');
                let resa2 = resa[1].split(':');
                let regex = /[^.]*/g,
                    match;
                match = regex.exec(resa2[2]);
                h = parseInt(resa2[0], 10) * 3600;
                m = parseInt(resa2[1], 10) * 60;
                s = parseInt(match, 10);
                let totalA = h + m + s;

                let resb = alltime[i].end_at.split('T');
                let resb2 = resb[1].split(':');
                let regex2 = /[^.]*/g,
                    match2;
                match2 = regex2.exec(resb2[2]);
                h = parseInt(resb2[0], 10) * 3600;
                m = parseInt(resb2[1], 10) * 60;
                s = parseInt(match, 10);
                let totalB = h + m + s;
                let total =  totalB - totalA;
                cumulday += total;
            }
            i++;
        }
        cumul /= 3600;
        cumulday /= 3600;
        this.setState({timeCurrent: Math.round(cumul)});
        this.setState({timeCurrentDay: Math.round(cumulday)});
};

    _fetchTime = () => {
        let id = this.state.id;

        fetch('https://api.intra.42.fr/v2/users/' + id + '/locations',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.token
                },
            })
            .then((response) => response.json())
            .then((response) => {
                this.setState({timeLocation: response});
                this._getTime();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    _fetchProfile = () => {
        fetch('https://api.intra.42.fr/v2/me',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.token
                },
            })
            .then((response) => response.json())
            .then((response) => {
                if (response === 'undefined') {
                    AsyncStorage.removeItem('TOKEN');
                    this.props.navigation.navigate('Login');
                }
                this.setState({login: response['login']});
                this.setState({id: response['id']});
                this.setState({nom: response['displayname']});
                this.setState({imageUrl: response['image_url']});
                this.setState({cursus: response['cursus_users']});
                let level = this.state.cursus;
                this.setState({level: level[0].level});
                this._setProgress();
                this.setState({correction_point: response['correction_point']});
                this.setState({available: response['location']});
                this._fetchTime();
                this.setState({allachievements: response['achievements']});
                this._getAchievements();

            })
            .catch((error) => {
                console.error(error);
            });
    };

    _getAchievements = () => {
        console.log(this.state.allachievements);
    };

    static navigationOptions = {
        headerTitle: <Text style={theme.fonts.header}>Welcome</Text>,
        headerRight: (
            <TouchableOpacity>
                <Block flex={false}>
                    <Image
                        resizeMode="contain"
                        source={require('../assets/images/Icon/Menu.png')}
                        style={{width: 20, height: 24}}
                    />
                    <Badge
                        size={13}
                        color={theme.colors.accent}
                        style={{position: 'absolute', top: -4, right: -4}}
                    />
                </Block>
            </TouchableOpacity>
        )
    };

    renderMonthly() {
        const {navigation} = this.props;
        const imageurl = this.state.imageUrl;
        const isAvailable = this.state.isAvailable;
        const progress = 'value={' + this.state.progress + '}';

        return (
            <TouchableOpacity
                activeOpacity={0.8}
            >
                <Block row style={{
                    marginBottom: theme.sizes.base,
                    marginTop: theme.sizes.basehome,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text spacing={0.4} transform="uppercase">
                        {this.state.nom}
                    </Text>


                </Block>
                <Card shadow style={{ paddingVertical: theme.sizes.base * 2}}>
                    <Block center>
                        <ImageBackground
                            source={{ url: imageurl}}
                            imageStyle={{ borderRadius: 150/2 }}
                            style={[isAvailable, {width: 150, height: 150, borderRadius: 150/ 2}]}
                        />
                    </Block>

                    <Block center>
                        <Text title spacing={1} style={{marginTop: 15}}>
                            {this.state.login}
                        </Text>
                        <Text style={[theme.fonts.login, {marginTop: 5}]} spacing={0.5} caption medium>({this.state.available})</Text>
                        <Text style={{marginTop: 20}}>
                            <Text gray transform="uppercase">LEVEL </Text>
                            <Text size={20} primary>{this.state.level}</Text>
                        </Text>
                    </Block>
                    <Block style={{ marginTop: theme.sizes.base }}>
                        <Block row space="between" style={{ paddingLeft: 6 }}>
                            <Text body spacing={0.7}>Current Progression</Text>
                            <Text caption spacing={0.7}>{this.state.progressP}%</Text>
                        </Block>
                        <Progress progress/>
                    </Block>

                    <Block color="gray3" style={styles.hLine2} />

                    <Block row>
                        <Block center flex={1}>
                            <Text size={20} spacing={1} primary>{this.state.correction_point}</Text>
                            <Text body spacing={0.7} style={{textAlign: 'center'}}>Correction Point</Text>
                        </Block>
                        <Block center flex={1}>
                            <Text size={20} spacing={1} primary>{this.state.timeCurrent}H</Text>
                            <Text body spacing={0.7} style={{textAlign: 'center'}}>Current{"\n"}Month</Text>
                        </Block>
                        <Block center flex={1}>
                            <Text size={20} spacing={1} primary>{this.state.timeCurrentDay}H</Text>
                            <Text body spacing={0.7} style={{textAlign: 'center'}}>Current{"\n"}Day</Text>
                        </Block>
                    </Block>

                    <Block color="gray3" style={styles.hLine} />

                    <Block style={{ marginBottom: theme.sizes.base }}>
                        <Block row space="between" style={{ paddingLeft: 6 }}>
                            <Text body spacing={0.7}>Breaking</Text>
                            <Text caption spacing={0.7}>8.1</Text>
                        </Block>
                        <Progress value={0.81} />
                    </Block>

                    <Block style={{ marginBottom: theme.sizes.base }}>
                        <Block row space="between" style={{ paddingLeft: 6 }}>
                            <Text body spacing={0.7}>Speeding</Text>
                            <Text caption spacing={0.7}>9.8</Text>
                        </Block>
                        <Progress value={0.98} />
                    </Block>

                    <Block style={{ marginBottom: theme.sizes.base }}>
                        <Block row space="between" style={{ paddingLeft: 6 }}>
                            <Text body spacing={0.7}>Distracted Driving</Text>
                            <Text caption spacing={0.7}>7.4</Text>
                        </Block>
                        <Progress endColor="#D37694" value={0.74} />
                    </Block>

                    <Block color="gray3" style={styles.hLine} />

                    <Block row center space="between">
                        <Text>Total Driver Discount</Text>
                        <Text size={20} spacing={1} primary>$6.71</Text>
                    </Block>
                </Card>
            </TouchableOpacity>
        )
    }

    renderAwards() {
        return (
            <LinearGradient
                end={{x: 1, y: 0}}
                style={[blockStyles.row, cardStyles.card, styles.awards]}
                colors={["#FF988A", theme.colors.accent]}
            >
                <Block middle flex={0.4}>
                    <Badge color={rgba(theme.colors.white, '0.2')} size={74}>
                        <Badge color={rgba(theme.colors.white, '0.2')} size={52}>
                            <Icon.FontAwesome name="trophy" color="white" size={theme.sizes.h2}/>
                        </Badge>
                    </Badge>
                </Block>
                <Block middle>
                    <Text size={theme.sizes.base} spacing={0.4} medium white>Wohoo!</Text>
                    <Text size={theme.sizes.base} spacing={0.4} medium white>Safe Driver Trophy!</Text>
                </Block>
            </LinearGradient>
        )
    }

    renderTrip = trip => {
        return (
            <Card shadow key={`trip-${trip.id}`}>
                <Block row space="between" style={{marginBottom: theme.sizes.base}}>
                    <Text spacing={0.5} caption>{trip.date}</Text>
                    <Text spacing={0.5} caption medium primary>{trip.score}</Text>
                    <Text spacing={0.5} caption>{trip.distance}</Text>
                </Block>
                <Block row center>
                    <Badge color={rgba(theme.colors.accent, '0.2')} size={14} style={{marginRight: 8}}>
                        <Badge color={theme.colors.accent} size={8}/>
                    </Badge>
                    <Text spacing={0.5} color="gray">{trip.from}</Text>
                </Block>

                <Block row center style={{paddingVertical: 4}}>
                    <Badge color="gray2" size={4} style={{marginLeft: 4.5}}/>
                </Block>

                <Block row center>
                    <Badge color={rgba(theme.colors.primary, '0.2')} size={14} style={{marginRight: 8}}>
                        <Badge color={theme.colors.primary} size={8}/>
                    </Badge>
                    <Text spacing={0.5} color="gray">{trip.to}</Text>
                </Block>
            </Card>
        )
    }

    renderTrips() {
        return (
            <React.Fragment>
                <Block style={{marginBottom: theme.sizes.base}}>
                    <Text spacing={0.4} transform="uppercase">
                        Recent Trips
                    </Text>
                </Block>

                {mocks.trips.map(trip => this.renderTrip(trip))}
            </React.Fragment>
        )
    }

    renderTripButton() {
        const {navigation} = this.props;

        return (
            <Block center middle style={styles.startTrip}>
                <Badge color={rgba(theme.colors.primary, '0.1')} size={144}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Trip")}>
                        <Badge color={theme.colors.primary} size={62}>
                            <Icon.FontAwesome name="automobile" size={62 / 2.5} color="white"/>
                        </Badge>
                    </TouchableOpacity>
                </Badge>
            </Block>
        )
    }

    render() {
        return (
            <React.Fragment>
                <ScrollView style={styles.welcome} showsVerticalScrollIndicator={false}>
                    {this.renderMonthly()}
                    {this.renderAwards()}
                    {this.renderTrips()}
                </ScrollView>
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    welcome: {
        paddingVertical: theme.sizes.padding,
        paddingHorizontal: theme.sizes.padding,
        backgroundColor: theme.colors.gray4,
    },
    // horizontal line
    hLine: {
        marginVertical: theme.sizes.base * 2,
        marginHorizontal: theme.sizes.base * 2,
        height: 1,
    },
    hLine2: {
        marginVertical: theme.sizes.base * 1.5,
        marginHorizontal: theme.sizes.base * 2,
        height: 1,
    },
    // vertical line
    vLine: {
        marginVertical: theme.sizes.base / 2,
        width: 1,
    },
    awards: {
        padding: theme.sizes.base,
        marginBottom: theme.sizes.padding,
    },
    moreIcon: {
        width: 16,
        height: 17,
        position: 'absolute',
        right: theme.sizes.base,
        top: theme.sizes.base,
    },
    startTrip: {
        position: 'absolute',
        left: (width - 144) / 2,
        bottom: 0,
    }
})
