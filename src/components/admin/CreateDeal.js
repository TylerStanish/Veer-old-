import React, {Component} from 'react';
import {
	Alert, 
	Image, 
	TouchableOpacity, 
	View, 
	StyleSheet, 
	Text, 
	TextInput, 
	Dimensions,
	ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import Meteor from 'react-native-meteor';
import Calendar from 'react-native-calendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
console.log(ImagePicker);
import moment from 'moment';
import dismissKeyboard from 'react-native-dismiss-keyboard';

import Button from '../misc/Button';
import ModalHeader from '../misc/ModalHeader';

class CreateDeal extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			selectedDate: null,
			loading: false,
		}
		this.picture = null;
	}

	createDeal(){
		this.setState({loading: true});
		var d;
		if(this.state.selectedDate){
			d = this.state.selectedDate;
		}else{
			d = moment().format("ll");
		}
		var data = {
			pic: this.state.bImage,
			title: this.state.title,
			date: d,
		}
		if(!data.title || !data.date){
			Alert.alert('Missing information!');
			this.setState({loading: false});
			return;
		}
		Meteor.call('deal.makeDeal', data, (error, data) => {
			if(error){
				Alert.alert(error.reason);
				this.setState({loading: false});
			}else{
				this.props.setCreateDealVisible(false);
			}
		});
	}

	onDateChange(date){
		var d = moment(date).format("ll");
		console.log(d);
		this.setState({selectedDate: d});
	}

	getImage(){
		this.setState({loadingImage: true});
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
			this.setState({bImage: data, image, loadingImage: false});
		});
	}

	render() {

		var dim = 0;
		if(this.state.image){
			dim = width/3;
		}

		return(
			<ScrollView style={{flex: 1}}>
				<ModalHeader close={() => this.props.setCreateDealVisible(false)}/>
				<TouchableOpacity onPress={() => dismissKeyboard()} activeOpacity={1} style={[styles.container]}>
					<TextInput
						style={styles.input}
						ref="title"
						returnKeyType={"next"}
						onChangeText={(title) => this.setState({title})}
						autoCapitalize="words"
						autoCorrect={false}
						placeholder="Deal name"
						onSubmitEditing={() => dismissKeyboard()}
					/>
					<Calendar onDateSelect={(date) => this.onDateChange(date)}/>
					<Button loading={this.state.loadingImage} onPress={() => this.getImage()} width={width-10} height={70} text="Upload Image"/>
					<Image source={{uri: this.state.image}} style={{margin: 10, height: dim, width: dim}}/>
					<Button loading={this.state.loading} onPress={this.createDeal.bind(this)} text='Create'/>
					<View style={{height :10}}/>
				{/* Implement the image uploader */}
				</TouchableOpacity>
			</ScrollView>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		//justifyContent: 'space-around',
		alignItems: 'center',
		marginTop: 10,
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
});

const mapStateToProps = (state, ownProps) => {
	return {
		references: state.references,
	}
}

export default connect(mapStateToProps)(CreateDeal);


