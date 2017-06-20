import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated, TextInput, Image, findNodeHandle, Dimensions, TouchableOpacity} from 'react-native';
import {BlurView} from 'react-native-blur';

import Loading from '../misc/Loading';
import Button from '../misc/Button';

import dismissKeyboard from 'react-native-dismiss-keyboard';
import {Actions} from 'react-native-router-flux';
import Meteor from 'react-native-meteor';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class Init extends Component{
	
	constructor(props) {
		super(props);
		if(props.references.atLogoutPage){
			this.state = {
				rotate: new Animated.Value(0),
				margin: new Animated.Value(0),
				opacity: new Animated.Value(0),
				height: new Animated.Value(height/6),
				width: new Animated.Value(height/6),

				animRight: new Animated.Value(0),
			}
			return;
		}
		this.state = {
			rotate: new Animated.Value(0),
			margin: new Animated.Value(50),
			opacity: new Animated.Value(0),
			height: new Animated.Value(width),
			width: new Animated.Value(width),

			animRight: new Animated.Value(0),
		}
	}

	login(){
		this.setState({error: null, loading: true});
		if(this.state.email && this.state.password){
			Meteor.loginWithPassword(this.state.email, this.state.password, (error) => {
				if(error){
					this.setState({error: error.reason, loading: false});
				}else{
					Actions.tabbar({type: 'reset'});
					//this.setState({email: null, password: null});
				}
			});
		}else{
			this.setState({error: 'Missing field(s)', loading: false});
		}
	}

	createAccount(){
		Animated.timing(this.state.animRight, {toValue: width, duration: 1000}).start();
		Animated.timing(this.state.opacity, {toValue: 0, duration: 1000}).start();
		setTimeout(() => {
			Actions.CreateAccount();
		}, 1000);
	}

	imageLoaded(){
		this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
	}

	componentDidMount() {

		if(!this.props.references.atLogoutPage){
			Animated.sequence([
				Animated.parallel([
					Animated.timing(
						this.state.margin,
						{
							toValue: 0,
							duration: 1000,
						}
					),
					Animated.timing(
						this.state.opacity,
						{
							toValue: 1,
							duration: 1000
						}
					),
					Animated.timing(
						this.state.height,
						{
							toValue: height/6,
							duration: 1000
						}
					),
					Animated.timing(
						this.state.width,
						{
							toValue: height/6,
							duration: 1000
						}
					),
				]),
				Animated.sequence([
					Animated.timing(
						this.state.rotate,
						{
							toValue: 12.5,
						}
					),
					Animated.spring(
						this.state.rotate,
						{
							toValue: -100,
							duration: 500,
						}
					)
				])
			]).start();
		}else{
			Animated.sequence([
				Animated.parallel([
					Animated.timing(
						this.state.margin,
						{
							toValue: 0,
							duration: 1000,
						}
					),
					Animated.timing(
						this.state.opacity,
						{
							toValue: 1,
							duration: 1000
						}
					),
					Animated.timing(
						this.state.height,
						{
							toValue: height/6,
							duration: 1000
						}
					),
					Animated.timing(
						this.state.width,
						{
							toValue: height/6,
							duration: 1000
						}
					),
				])
			]).start();
		}
	}

	render() {

		var interpolatedValue = this.state.rotate.interpolate({
			inputRange: [0, 100],
			outputRange: ['0deg', '360deg']
		});

		if(!this.props.references.atLogoutPage){
			this.props.setAtLogoutPage(true);
		}

		return(
			<Animated.View style={[{position: 'absolute', height, width, top: 0, right: this.state.animRight}, styles.container]}>
				<TouchableOpacity activeOpacity={1} onPress={() => dismissKeyboard()} style={styles.container}>
					<Animated.Image
						source={require('../../../assets/new full alpha shadow 512.png')}
						style={{
							marginTop: 40,
							height: this.state.height,
							width: this.state.width,
							transform: [{rotate: interpolatedValue}]
						}}
					/>
					<Animated.View style={[{opacity: this.state.opacity, marginTop: this.state.margin}, styles.container]}>
						<TextInput
							style={styles.input}
							keyboardType="email-address"
							ref="email"
							returnKeyType={"next"}
							onChangeText={(email) => this.setState({email})}
							autoCapitalize="none"
							autoCorrect={false}
							placeholder="Email"
							onSubmitEditing={() => this.refs.password.focus()}
						/>
						<TextInput
							style={styles.input}
							secureTextEntry={true}
							ref="password"
							returnKeyType={"go"}
							onChangeText={(password) => this.setState({password})}
							autoCapitalize="none"
							autoCorrect={false}
							placeholder="Password"
							onSubmitEditing={() => this.login()}
						/>
						<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
							<Button loading={this.state.loading} onPress={() => this.login()} text="Log in" width={width/2.5} height={60}/>
							<View style={{width: width/9}}/>
							<Button onPress={() => this.createAccount()} text="Create Account" width={width/2.5} height={60}/>
						</View>
						<Text style={styles.error}>{this.state.error}</Text>
					</Animated.View>
				</TouchableOpacity>
			</Animated.View>
		);
	}
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flex: 1,
	},
	input: {
		height: 40,
		width: 8*width/9,
		marginHorizontal: width/18,
		padding: 10,
		marginBottom: 10,
		backgroundColor: 'white',
		borderColor: 'gray',
		borderWidth: 1,
	},
	error: {
		margin: 10,
		fontSize: 16,
		fontWeight: 'bold',
		color: 'red',
		backgroundColor: 'transparent'
	},
	forgotPassword: {
		position: 'absolute',
		bottom: 0,
		backgroundColor: 'transparent',
		fontStyle: 'italic',
		paddingBottom: 25,
		fontSize: 16,
		fontWeight: 'bold',
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
	}
}

export default connect(mapStateToProps, actions)(Init);



