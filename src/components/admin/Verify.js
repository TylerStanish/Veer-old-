import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableHightlight,
	TextInput,
	Picker,
	TouchableOpacity,
	ScrollView,
	Alert,
	Animated,
} from 'react-native';

import {connect} from 'react-redux';
import Meteor from 'react-native-meteor';
import dismissKeyboard from 'react-native-dismiss-keyboard';

import Button from '../misc/Button';

class Verify extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			p1: 1,
			p2: 2017,
			accepted: false,
			opacity: new Animated.Value(1)
		}
	}

	viewTOS(){

	}

	accept(){
		this.setState({accepted: true});
		Animated.timing(
			this.state.opacity,
			{
				toValue: 0
			}
		).start();
	}

	verify(){
		this.setState({loading: true});

		if(!this.state.number || !this.state.p1 || !this.state.p2 || !this.state.cvc){
			Alert.alert('Missing field(s)!');
			this.setState({loading: false});
			return;
		}

		var stripe_url = 'https://api.stripe.com/v1/'
		// add this to meteor settings
		var secret_key = 'pk_test_MERz5Ospcty9rFsrNQCZMVP1'
		var cardDetails = {
			"card[number]": this.state.number,
			"card[exp_month]": this.state.p1,
			"card[exp_year]": this.state.p2,
			"card[cvc]": this.state.cvc
		};

		var formBody = [];
		for (var property in cardDetails) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(cardDetails[property]);
			formBody.push(encodedKey + "=" + encodedValue);
		}
		formBody = formBody.join("&");
		// try 'tokens' and 'customers' below
		return fetch(stripe_url + 'tokens', {
			method: 'post',
			headers: {
			 	'Accept': 'application/json',
			 	'Content-Type': 'application/x-www-form-urlencoded',
			 	'Authorization': 'Bearer ' + secret_key
			},
			body: formBody
		}).then(res => {
			res.json().then(resp => {
				console.log(resp.id);
				var id = resp.id;
				if(res.status != 200){
					this.setState({loading: false});
					Alert.alert('Oops! There was an error', '', [{text: 'OK'}]);
					return;
				}
				Meteor.call('profile.businessVerify', id, (error, data) => {
					if(error){
						console.log(error);
						this.setState({loading: false});
						Alert.alert('There was an error', '', [{text: 'OK'}]);
						return;
					}
					console.log(error);
					console.log(data);
					this.setState({loading: false});
				});
			});
		}).catch(err => {
			console.log(err);
			this.setState({loading: false});
		})
	}

	render() {

		var which = <Button color="red" loading={this.state.loading} width={width-30} height={70} text="PRESS TO ACCEPT" onPress={() => this.accept()} />
		if(this.state.accepted){
			which = <Button loading={this.state.loading} width={width-30} height={70} text="Verify Business" onPress={() => this.verify()} />
		}

		return(
			<ScrollView style={{marginTop: this.props.references.globalMarginTop + 5}}>
				<Text style={[styles.text, {color: this.props.references.color, fontSize: 28}]}>Business Verification</Text>
				<Text style={styles.text}>We want to know if you really are a business and not an imposter</Text>
				<Text style={styles.text}>We at Veer take pride in building strong communities and protecting the confidence our app provides.</Text>
				<Text style={styles.text}>Our verification process requires you to sign up using a credit card and to agree to our terms of service. Veer is free to use and there are no monthly subscription charges.</Text>
				<View>
					<TextInput
						secureTextEntry={true}
						style={styles.input}
						ref="number"
						keyboardType="numeric"
						returnKeyType={"next"}
						onChangeText={(number) => this.setState({number})}
						autoCapitalize="words"
						autoCorrect={false}
						placeholder="Credit Card Number"
						onSubmitEditing={() => this.refs.cvc.focus()}
					/>
					<TextInput
						secureTextEntry={true}
						style={styles.input}
						ref="cvc"
						keyboardType="numeric"
						returnKeyType={"next"}
						onChangeText={(cvc) => this.setState({cvc})}
						autoCapitalize="none"
						autoCorrect={false}
						placeholder="CVC"
						onSubmitEditing={() => dismissKeyboard()}
					/>
					<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
						<Picker 
				        	ref="pick1"
				        	style={styles.picker}
				        	selectedValue={this.state.p1}
				        	onValueChange={(num) => this.setState({p1: num})}
				        >
				        	<Picker.Item label={"1"} value={1}/>
				        	<Picker.Item label={"2"} value={2}/>
				        	<Picker.Item label={"3"} value={3}/>
				        	<Picker.Item label={"4"} value={4}/>
				        	<Picker.Item label={"5"} value={5}/>
				        	<Picker.Item label={"6"} value={6}/>
				        	<Picker.Item label={"7"} value={7}/>
				        	<Picker.Item label={"8"} value={8}/>
				        	<Picker.Item label={"9"} value={9}/>
				        	<Picker.Item label={"10"} value={10}/>
				        	<Picker.Item label={"11"} value={11}/>
				        	<Picker.Item label={"12"} value={12}/>
				        </Picker>
				        <Picker 
				        	style={styles.picker}
				        	selectedValue={this.state.p2}
				        	onValueChange={(num) => this.setState({p2: num})}
				        >
				        	<Picker.Item label={"2017"} value={2017}/>
				        	<Picker.Item label={"2018"} value={2018}/>
				        	<Picker.Item label={"2019"} value={2019}/>
				        	<Picker.Item label={"2020"} value={2020}/>
				        	<Picker.Item label={"2021"} value={2021}/>
				        	<Picker.Item label={"2022"} value={2022}/>
				        	<Picker.Item label={"2023"} value={2023}/>
				        	<Picker.Item label={"2024"} value={2024}/>
				        	<Picker.Item label={"2025"} value={2025}/>
				        </Picker>
					</View>
				</View>
				<View style={{alignItems: 'center', marginBottom: 20}}>
					<Text style={styles.text}>To view the terms of service, go to https://veeroption.com/tos</Text>
					<Animated.Text style={[{opacity: this.state.opacity}, styles.text]}>Accept Terms of Service</Animated.Text>
					{which}
				</View>
			</ScrollView>
		);
	}
}

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		margin: 5,
	},
	picker: {
		width: 100,
		padding: 0,
		margin: 0,
	},
	input: {
		height: 40,
		width: width-10,
		marginHorizontal: 5,
		padding: 10,
		marginBottom: 10,
		backgroundColor: 'white',
		borderColor: 'gray',
		borderWidth: 1,
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references
	}
}

export default connect(mapStateToProps)(Verify);



