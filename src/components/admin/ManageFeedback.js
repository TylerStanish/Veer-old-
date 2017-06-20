import React, {Component} from 'react';
import { 
	View, 
	Text, 
	StyleSheet, 
	Dimensions,
	Platform,
	TouchableOpacity,
	ScrollView,
	Alert,
} from 'react-native';

import Loading from '../misc/Loading';
import Meteor from 'react-native-meteor';

class ManageFeedback extends Component{
	
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	remove(f){
		Meteor.call('page.selectedMessageRemove', f._id, (err, data) => {
			if(err){
				Alert.alert('There was an error');
			}
		});
	}

	renderFeedback(){
		return this.props.feedback.map(f => {
			return(
				<View style={styles.card} key={f._id}>
					<TouchableOpacity activeOpacity={0.7} style={[styles.buttonDelete, styles.button]} onPress={() => this.remove(f)}>
						<Text style={styles.buttonText}>REMOVE REVIEW</Text>
					</TouchableOpacity>
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
				<Text style={[{marginTop: 15}, styles.text]}>You have no published reviews</Text>
			);
		}

		return(
			<ScrollView contentContainerStyle={{flex: 1, alignItems: 'center'}}>
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
		width: width-10,
		borderRadius: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonDelete: {
		backgroundColor: 'red'
	},
	text: {
		textAlign: 'center',
		margin: 5,
	},
	message: {
		fontWeight: 'bold'
	},
});

export default ManageFeedback;


