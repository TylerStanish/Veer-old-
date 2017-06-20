import React, {Component} from 'react';
import {
	Text, 
	StyleSheet, 
	View, 
	Modal, 
	TouchableOpacity,
	Dimensions,
	Platform,
	ScrollView,
	Alert,
} from 'react-native';

import {connect} from 'react-redux';
import Meteor from 'react-native-meteor';

import Loading from '../misc/Loading';

class ViewFeedback extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		}
	}

	remove(f){
		Meteor.call('message.deleteMessage', f._id, (err, data) => {
			if(err){
				Alert.alert('There was an error. Error code 003');
			}
		});
	}

	post(f){
		Meteor.call('page.selectedMessageAdd', f._id, (err, data) => {
			if(err){
				Alert.alert('There was an error. Error code 004');
			}
		});
	}

	renderFeedback(){
		return this.props.feedback.map(f => {
			console.log(f);
			return(
				<View style={styles.card} key={f._id}>
					<View style={{flexDirection: 'row', justifyContent: 'center'}}>
						<TouchableOpacity activeOpacity={0.7} style={[styles.buttonDelete, styles.button]} onPress={() => this.remove(f)}>
							<Text style={styles.buttonText}>DELETE</Text>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.7} style={[styles.button, {backgroundColor: this.props.references.color}]} onPress={() => this.post(f)}>
							<Text style={styles.buttonText}>POST REVIEW</Text>
						</TouchableOpacity>
					</View>
					<View style={{alignItems: 'center'}}>
						<Text style={styles.text}>{f.name} - {f.createdAt}</Text>
						<Text style={styles.text, styles.message}>{f.message}</Text>
					</View>
				</View>
			);
		});
	}

	render() {

		if(!this.props.feedback){
			return <Loading/>
		}

		if(!this.props.feedback.length){
			return(
				<Text style={[styles.text, {marginTop: 15}]}>You have no messages</Text>
			);
		}

		return(
			<ScrollView contentContainerStyle={{alignItems: 'center'}}>
				{this.renderFeedback()}
			</ScrollView>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	card: {
		width: width-10,
		marginVertical: 10,
		shadowOffset: {width: 2, height: 3},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		paddingBottom: 5
	},
	button: {
		height: 40,
		width: (width-10)/2,
		borderRadius: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonDelete: {
		backgroundColor: 'red'
	},
	text: {
		textAlign: 'center',
		margin: 5
	},
	message: {
		fontWeight: 'bold'
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold'
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references
	}
}

export default connect(mapStateToProps)(ViewFeedback);


