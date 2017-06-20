import React, {Component} from 'react';
import {
	Dimensions, 
	TouchableOpacity, 
	View, 
	Text, 
	Modal, 
	StyleSheet,
	TextInput,
	ScrollView,
	Alert,
} from 'react-native';

import Meteor from 'react-native-meteor';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from '../misc/Button';
import Loading from '../misc/Loading';

class MakePage extends Component{

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
		}
	}

	createPage(){
		this.setState({loading: true});
		var {name, email, owner, address, city, state, phone, website, about} = this.state;
		if(!name || !email || !owner || !address || !city || !state || !phone || !about){
			Alert.alert('Missing information');
			this.setState({loading: false});
			return;
		}
		var data = {
			address: address + " " + city + " " + state,
			pageName: name,
			email,
			ownerName: owner,
			about,
			phone,
			website,
		}
		Meteor.call('page.makePage', data, (error, data) => {
			if(!error){
				this.props.close();
			}else{
				this.setState({loading: false});
				Alert.alert(error.reason);
			}
		});
	}

	render() {

		var text = <Text onPress={() => this.createPage()} style={{fontSize: 20, color: this.props.references.color}}>Create</Text>
		if(this.state.loading){
			text = <Loading height={30} width={30}/>
		}

		if(this.props.profile){
			console.log(this.props.profile);
		}else{
			console.log('no profile');
		}

		// add in the keyboard aware scroll view
		return(
			<KeyboardAwareScrollView style={{paddingTop: 10}}>
				<View style={{zIndex: 9, position: 'absolute', top: 10, right: 10}}>
					{text}
				</View>
				<Text style={[styles.text, styles.title]}>Make Page</Text>
				<Text style={styles.text}>* required</Text>
				<ScrollView horizontal={true}>
					<TextInput
						style={styles.input}
						ref="name"
						returnKeyType={"next"}
						onChangeText={(name) => this.setState({name})}
						autoCapitalize="words"
						autoCorrect={false}
						placeholder="*Business Name"
						onSubmitEditing={() => this.refs.email.focus()}
					/>
				</ScrollView>
				<ScrollView horizontal={true}>
					<TextInput
						style={styles.input}
						ref="email"
						keyboardType="email-address"
						returnKeyType={"next"}
						onChangeText={(email) => this.setState({email})}
						autoCapitalize="none"
						autoCorrect={false}
						placeholder="*Business Email"
						onSubmitEditing={() => this.refs.owner.focus()}
					/>
				</ScrollView>
				<ScrollView horizontal={true}>
					<TextInput
						style={styles.input}
						ref="owner"
						returnKeyType={"next"}
						onChangeText={(owner) => this.setState({owner})}
						autoCapitalize="words"
						autoCorrect={false}
						placeholder="*Owner Name"
						onSubmitEditing={() => this.refs.address.focus()}
					/>
				</ScrollView>
				<ScrollView horizontal={true}>
					<TextInput
						style={styles.input}
						ref="address"
						returnKeyType={"next"}
						onChangeText={(address) => this.setState({address})}
						autoCapitalize="words"
						autoCorrect={false}
						placeholder="*Address"
						onSubmitEditing={() => this.refs.city.focus()}
					/>
				</ScrollView>
				<ScrollView horizontal={true}>
					<TextInput
						style={styles.input}
						ref="city"
						returnKeyType={"next"}
						onChangeText={(city) => this.setState({city})}
						autoCapitalize="words"
						autoCorrect={false}
						placeholder="*City"
						onSubmitEditing={() => this.refs.state.focus()}
					/>
				</ScrollView>
				<ScrollView horizontal={true}>
					<TextInput
						style={styles.input}
						ref="state"
						returnKeyType={"next"}
						onChangeText={(state) => this.setState({state})}
						autoCapitalize="characters"
						autoCorrect={false}
						placeholder="*State"
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
						placeholder="*Phone"
						onSubmitEditing={() => this.refs.website.focus()}
					/>
				</ScrollView>
				<ScrollView horizontal={true}>
					<TextInput
						style={styles.input}
						ref="website"
						returnKeyType={"next"}
						onChangeText={(website) => this.setState({website})}
						autoCapitalize="none"
						autoCorrect={false}
						placeholder="Website"
						onSubmitEditing={() => this.refs.about.focus()}
					/>
				</ScrollView>
				<ScrollView>
					<TextInput
						multiline={true}
						style={[styles.input, styles.multiline]}
						ref="about"
						returnKeyType={"next"}
						onChangeText={(about) => this.setState({about})}
						autoCapitalize="sentences"
						autoCorrect={false}
						placeholder="*About"
						onSubmitEditing={() => this.createPage()}
					/>
				</ScrollView>
			</KeyboardAwareScrollView>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		marginTop: 10,
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
	},
	multiline: {
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
	},
	text: {
		textAlign: 'center',
		margin: 5
	},
	title: {
		fontWeight: 'bold',
		fontSize: 24
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
	}
}

export default connect(mapStateToProps)(MakePage);

