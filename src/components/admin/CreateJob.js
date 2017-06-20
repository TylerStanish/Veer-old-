import React,{Component} from 'react';
import {View, ScrollView, StyleSheet, TextInput, Text, Dimensions} from 'react-native';

import Meteor from 'react-native-meteor';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from '../misc/Button';

class CreateJob extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
		}
	}
	
	createJob(){
		this.setState({loading: true});
		var {name, phone, email, description, requirements, benefits} = this.state;
		if(!name || !phone || !email || !description|| !requirements || !benefits){
			Alert.alert('Missing field(s)');
			this.setState({loading: false});
		}
		var data = {
			title: name.trim(),
			phone: phone.trim(),
			email: email.trim(),
			description: description.trim(),
			requirements: requirements.trim(),
			benefits: benefits.trim()
		}
		Meteor.call('job.makeJob', data, (error, data) => {
			if(error){
				Alert.alert('There was an error! Error code 050');
				this.setState({loading: false});
			}else{
				this.props.setCreateJobVisible(false);
			}
		});
	}

	render() {
		return(
			<KeyboardAwareScrollView>
				<View style={{zIndex: 8, position: 'absolute', right: 0, top: 0, padding: 10}}>
					<Button loading={this.state.loading} width={80} height={40} text="Create" onPress={() => this.createJob()} />
				</View>
				<Text style={styles.text}>Create Job</Text>
				<ScrollView horizontal={true}>	
					<TextInput
						style={styles.input}
						ref="name"
						returnKeyType={"next"}
						onChangeText={(name) => this.setState({name})}
						autoCapitalize="words"
						autoCorrect={false}
						placeholder="Job Title"
						onSubmitEditing={() => this.refs.phone.focus()}
					/>
				</ScrollView>
				<ScrollView horizontal={true}>
					<TextInput
						style={styles.input}
						ref="phone"
						returnKeyType={"next"}
						onChangeText={(phone) => this.setState({phone})}
						autoCapitalize="none"
						autoCorrect={false}
						placeholder="Contact Phone"
						onSubmitEditing={() => this.refs.email.focus()}
					/>
				</ScrollView>
				<ScrollView horizontal={true}>
					<TextInput
						keyboardType="email-address"
						style={styles.input}
						ref="email"
						returnKeyType={"next"}
						onChangeText={(email) => this.setState({email})}
						autoCapitalize="none"
						autoCorrect={false}
						placeholder="Contact Email"
						onSubmitEditing={() => this.refs.description.focus()}
					/>
				</ScrollView>
				<ScrollView>
					<TextInput
						placeholderTextColor="#aaa"
						multiline={true}
						style={[styles.input, styles.multiline]}
						ref="description"
						returnKeyType={"next"}
						onChangeText={(description) => this.setState({description})}
						autoCapitalize="sentences"
						autoCorrect={false}
						placeholder="Job Description"
						onSubmitEditing={() => this.refs.requirements.focus()}
					/>
				</ScrollView>
				<ScrollView>
					<TextInput
						placeholderTextColor="#aaa"
						style={[styles.input, styles.multiline]}
						ref="requirements"
						multiline={true}
						returnKeyType={"next"}
						onChangeText={(requirements) => this.setState({requirements})}
						autoCapitalize="sentences"
						autoCorrect={false}
						placeholder="Job Requirements"
						onSubmitEditing={() => this.refs.benefits.focus()}
					/>
				</ScrollView>
				<ScrollView>
					<TextInput
						placeholderTextColor="#aaa"
						style={[styles.input, styles.multiline, {marginBottom: 15}]}
						ref="benefits"
						multiline={true}
						returnKeyType={"next"}
						onChangeText={(benefits) => this.setState({benefits})}
						autoCapitalize="sentences"
						autoCorrect={false}
						placeholder="Job Benefits"
						onSubmitEditing={() => this.createJob()}
					/>
				</ScrollView>
			</KeyboardAwareScrollView>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
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
	multiline: {
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
	},
	text: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
		marginBottom: 20,
		marginTop: 20,
	}
});

export default CreateJob;



