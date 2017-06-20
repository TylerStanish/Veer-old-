import React, {Component} from 'react';
import {
	Dimensions, 
	ScrollView, 
	Platform, 
	TextInput, 
	View, 
	Text, 
	StyleSheet,
	Alert,
	Animated,
} from 'react-native';

import Meteor, {Accounts} from 'react-native-meteor';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
// try the library react native keyboard scroll aware view or something
import Geocoder from 'react-native-geocoding';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from '../misc/Button';

class CreateAccount extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			margin: new Animated.Value(-width),
			opacity: new Animated.Value(0),
		}
	}

	createAccount(){
		this.setState({loading: true});
		if(this.state.first && this.state.last && this.state.email && this.state.zip && this.state.p1 && this.state.p2){
			if(this.state.p1 == this.state.p2){
				Geocoder.getFromLocation(this.state.zip).then(res => {
					Accounts.createUser({email: this.state.email, password: this.state.p1}, (error) => {
						if(!error){
							Meteor.loginWithPassword(this.state.email, this.state.p1);
							Meteor.call('profile.makeUser', this.state.first + " " + this.state.last, this.state.zip, (error, data) => {
								console.log(data);
								if(!error){
									setTimeout(() => {
										Actions.tabbar({type: 'reset'});
									}, 1000);
								}else{
									Alert.alert(error.reason);
									this.setState({loading: false});
								}
							});
						}else{
							Alert.alert(error.reason);
							this.setState({loading: false});
						}
					});
				}, error => {
					this.setState({loading: false});
					Alert.alert('Invalid zip code!');
					console.log(error);
				});
			}else{
				this.setState({loading: false});
				Alert.alert('Passwords do not match!');
			}
		}else{
			this.setState({loading: false});
			Alert.alert('Missing field(s)');
		}
	}

	componentDidMount(){
		Animated.parallel([
			Animated.timing(this.state.opacity, {toValue: 1}),
			Animated.spring(this.state.margin, {toValue: 0, velocity: 0.5, tension: -1, friction: 4}),
		]).start();
	}

	goBack(){
		var duration = 1000;
		Animated.timing(this.state.opacity, {toValue: 0, duration}).start();
		Animated.timing(this.state.margin, {toValue: -width, duration}).start();
		setTimeout(() => {
			Actions.pop();
		}, duration);
	}

	render() {
		return(
		<Animated.View style={{position: 'absolute', flex: 1, opacity: this.state.opacity, top: 0, right: this.state.margin}}>	
			<KeyboardAwareScrollView style={{width, height}} contentContainerStyle={{flex: 1, alignItems: 'center'}}>
				<View style={{width, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20}}>
					<Button height={50} width={width/2.5} text="Back" onPress={() => this.goBack()}/>
					<Button loading={this.state.loading} height={50} width={width/2.5} text="Create Account" onPress={() => this.createAccount()}/>
				</View>
				<TextInput
					style={styles.input}
					ref="email"
					keyboardType="email-address"
					returnKeyType={"next"}
					onChangeText={(email) => this.setState({email})}
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Email"
					onSubmitEditing={() => this.refs.first.focus()}
				/>
				<TextInput
					style={styles.input}
					ref="first"
					returnKeyType={"next"}
					onChangeText={(first) => this.setState({first})}
					autoCapitalize="words"
					autoCorrect={false}
					placeholder="First name"
					onSubmitEditing={() => this.refs.last.focus()}
				/>
				<TextInput
					style={styles.input}
					ref="last"
					returnKeyType={"next"}
					onChangeText={(last) => this.setState({last})}
					autoCapitalize="words"
					autoCorrect={false}
					placeholder="Last name"
					onSubmitEditing={() => this.refs.zip.focus()}
				/>
				<TextInput
					style={styles.input}
					ref="zip"
					returnKeyType={"next"}
					onChangeText={(zip) => this.setState({zip})}
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Zip code"
					onSubmitEditing={() => this.refs.p1.focus()}
				/>
				<TextInput
					secureTextEntry={true}
					style={styles.input}
					ref="p1"
					returnKeyType={"next"}
					onChangeText={(p1) => this.setState({p1})}
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Password"
					onSubmitEditing={() => this.refs.p2.focus()}
				/>
				<TextInput
					secureTextEntry={true}
					style={styles.input}
					ref="p2"
					returnKeyType={"next"}
					onChangeText={(p2) => this.setState({p2})}
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Confirm Password"
					onSubmitEditing={() => this.createAccount()}
				/>
			</KeyboardAwareScrollView>
		</Animated.View>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	input: {
		height: 40,
		width: width-10,
		marginHorizontal: 5,
		padding: 10,
		marginBottom: 10,
		backgroundColor: 'white',
		borderColor: 'gray',
		borderWidth: 1,
	},
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
	}
}

export default connect(mapStateToProps)(CreateAccount);



