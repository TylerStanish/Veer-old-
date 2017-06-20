import React, {Component} from 'react';
import {
	View, 
	Text, 
	StyleSheet, 
	TextInput,
	Dimensions,
	ScrollView,
	Alert,
	Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import Meteor from 'react-native-meteor';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'react-native-image-picker';

import Button from '../misc/Button';

class UpdateInfo extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			pageName: props.page.pageName,
			email: props.page.email,
			ownerName: props.page.ownerName,
			address: props.page.address,
			website: props.page.website,
			phone: props.page.phone,
			about: props.page.about,
		}
	}

	save(){
		var {pageName, email, ownerName, address, phone, website, about} = this.props.page;
		if(pageName != this.state.pageName){
			Meteor.call('page.updatePageName', pageName, (error, data) => {
				if(error){
					Alert.alert('There was an error. Error code: 010');
				}else{
					console.log('updated page name');
				}
			});
		}
		if(email != this.state.email){
			Meteor.call('page.updateEmail', email, (error, data) => {
				if(error){
					Alert.alert('There was an error. Error code: 011');
				}else{
					console.log('updated email');
				}
			});
		}
		if(ownerName != this.state.ownerName){
			Meteor.call('page.updateOwnerName', ownerName, (error, data) => {
				if(error){
					Alert.alert('There was an error. Error code: 012');
				}else{
					console.log('updated owner name');
				}
			});
		}
		if(address != this.state.address){
			Meteor.call('page.updateAddress', address, (error, data) => {
				if(error){
					Alert.alert('There was an error. Error code: 013');
				}else{
					console.log('updated address');
				}
			});
		}
		if(phone != this.state.phone){
			Meteor.call('page.updatePhone', phone, (error, data) => {
				if(error){
					Alert.alert('There was an error. Error code: 014');
				}else{
					console.log('updated phone');
				}
			});
		}
		if(website != this.state.website){
			Meteor.call('page.updateWebsite', website, (error, data) => {
				if(error){
					Alert.alert('There was an error. Error code: 015');
				}else{
					console.log('updated website');
				}
			});
		}
		if(about != this.state.about){
			Meteor.call('page.updateAbout', about, (error, data) => {
				if(error){
					Alert.alert('There was an error. Error code: 016');
				}else{
					console.log('updated about');
				}
			});
		}
		if(this.state.bImage){
			Meteor.call('page.addImage', {image: this.state.bImage}, (error) => {
				if(error){
					Alert.alert('There was an error uploading the image');
					return;
				}
			});
		}
		Alert.alert('Updated information');
	}

	getImage(){
		var options = {
		  title: 'Select Photo',
		  storageOptions: {
		    skipBackup: true,
		    path: 'images'
		  }
		};
		ImagePicker.showImagePicker(options, (response) => {
			console.log(response);
			var image = response.uri;
			var data = response.data;
			this.setState({image});
			this.setState({bImage: data});
		});
	}

	render(){

		console.log(this.props.page);

		return(
			<KeyboardAwareScrollView contentContainerStyle={{alignItems: 'center'}}>
				<Text onPress={() => this.save()} style={{fontWeight: 'bold', padding: 15, fontSize: 20, top: 0, right: 0, color: this.props.references.color, position: 'absolute'}}>Save</Text>
				<Text style={styles.title}>Update info</Text>
				<Text style={[{fontStyle: 'italic'}, styles.text]}>* is optional</Text>
				<ScrollView horizontal={true}>	
					<TextInput
						defaultValue={this.props.page.pageName}
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
						defaultValue={this.props.page.email}
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
						defaultValue={this.props.page.ownerName}
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
						defaultValue={this.props.page.address}
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
						defaultValue={this.props.page.phone}
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
						defaultValue={this.props.page.website}
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
				<ScrollView horizontal={true}>
					<TextInput
						defaultValue={this.props.page.about}
						style={styles.input}
						ref="about"
						returnKeyType={"next"}
						onChangeText={(about) => this.setState({about})}
						autoCapitalize="sentences"
						autoCorrect={false}
						placeholder="*About"
						onSubmitEditing={() => this.createPage()}
					/>
				</ScrollView>
				<Image
					source={{uri: this.state.image}}
					style={{width: width-10, height: width-10}}
				/>
				<Button text="Upload image" onPress={() => this.getImage()} width={width-10}/>
				<View style={{height: 20, width}}/>
			</KeyboardAwareScrollView>
		);
	}
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
	input: {
		height: 40,
		width: width-10,
		marginHorizontal: 5,
		//paddingBottom: 10,
		paddingLeft: 10,
		marginBottom: 10,
		backgroundColor: 'white',
		borderColor: 'gray',
		borderWidth: 1,
	},
	text: {
		textAlign: 'center',
		marginVertical: 8
	},
	title: {
		textAlign: 'center',
		marginVertical: 10,
		fontWeight: 'bold',
		fontSize: 22
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
		main: state.main
	}
}

export default connect(mapStateToProps)(UpdateInfo);


