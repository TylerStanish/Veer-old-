import React, {Component} from 'react';
import {
	Modal, 
	TouchableOpacity, 
	View, 
	Text, 
	StyleSheet, 
	Image, 
	Dimensions, 
	Platform,
	ScrollView,
	Alert,
} from 'react-native';

import Loading from '../misc/Loading';
import ModalHeader from '../misc/ModalHeader';
import InfoColumn from './InfoColumn';

import Meteor from 'react-native-meteor';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

class JobsCard extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		}
	}

	setHeight(event){
		return;
		var height = event.nativeEvent.layout.height;
		if(height && (this.state.height != height)){
			this.setState({height});
		}
	}

	remove(){
		// also check this segment for the argument error.
		Alert.alert(
			'Are you sure you wish to remove this job?',
			'',
			[
				{text: 'Yes', onPress: () => {
					Meteor.call('job.deleteJob', this.props.job._id, (err) => {
						if(err){
							Alert.alert('There was an error');
						}
					});
				}},
				{text: 'No'}
			]
		);
	}

	render() {

		if(!this.props.job){
			return <Loading/>
		}

		console.log(this.props.job);

		var uri;
		if(this.props.job.picture.substring(0,1) == '/'){
			uri = 'https://www.veeroption.com' + this.props.job.picture
		}else{
			uri = this.props.job.picture;
		}

		var deleteCard;
		if(this.props.removingJobs){
			deleteCard = (
				<View>
					<TouchableOpacity activeOpacity={0.8} onPress={() => this.remove()} style={[styles.removing]}>
						<Text style={styles.removingText}>Remove Deal</Text>
					</TouchableOpacity>
				</View>
			);
		}

		return(
			<View>
				<View style={{alignItems: 'center'}} onLayout={(event) => this.setHeight(event)}>
					<TouchableOpacity onPress={() => this.setState({visible: true})} activeOpacity={0.8} style={[{height: this.state.height}, styles.card]}>
						<Image
							source={{uri}}
							style={{marginRight: 5, width: width/4, height: width/4}}
						/>
						<InfoColumn job={this.props.job}/>
					</TouchableOpacity>
					{deleteCard}
				</View>
				<Modal visible={this.state.visible} animationType='slide'>
					<ModalHeader close={() => this.setState({visible: false})}/>
					<ScrollView contentContainerStyle={{alignItems: 'center'}}>
						<View style={styles.imageWrapper}>
							<Image
								source={{uri}}
								style={styles.bigImage}
							/>
						</View>
						<Text style={styles.title}>{this.props.job.title}</Text>
						<Text style={styles.text}>{this.props.job.pageName}</Text>
						<Text style={styles.title}>Date posted</Text>
						<Text style={styles.text}>{this.props.job.datePosted}</Text>
						<Text style={styles.title}>Description</Text>
						<Text style={styles.text}>{this.props.job.description}</Text>
						<Text style={styles.title}>Benefits</Text>
						<Text style={styles.text}>{this.props.job.benefits}</Text>
						<Text style={styles.title}>Requirements</Text>
						<Text style={styles.text}>{this.props.job.requirements}</Text>
						<Text style={styles.title}>Contact Information</Text>
						<Text style={styles.text}>{this.props.job.contactEmail}</Text>
						<Text style={[{marginBottom: 20}, styles.text]}>{this.props.job.contactPhone}</Text>
					</ScrollView>
				</Modal>
			</View>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 18,
		marginVertical: 10
	},
	text: {
		fontSize: 16,
		margin: 5,
	},
	card: {
		marginVertical: 5, 
		flexDirection: 'row', 
		alignItems: 'center',
		width: width-10,
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		backgroundColor: 'white'
	},
	bigImage: {
		height: width-10,
		width: width-10,
	},
	imageWrapper: {
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		margin: 5,
		marginBottom: 10,
		backgroundColor: 'white'
	},
	removing: {
		backgroundColor: 'red',
		justifyContent: 'center',
		alignItems: 'center',
		width: width-10,
		shadowOffset: {width: 2, height: 3},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		padding: 3,
		opacity: 0.9,
		borderRadius: 5,
	},
	removingText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references
	}
}

export default connect(mapStateToProps)(JobsCard);


