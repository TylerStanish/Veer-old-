import React, {Component} from 'react';
import {
	View, 
	Text, 
	StyleSheet, 
	ScrollView,
	TouchableOpacity,
	Modal,
	Platform,
	Dimensions
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Meteor, {createContainer} from 'react-native-meteor';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import Button from '../misc/Button';
import DealsList from '../common/lists/DealsList';
import JobsList from '../common/lists/JobsList';
import UpdateInfo from './UpdateInfo';
import CreateDeal from './CreateDeal';
import CreateJob from './CreateJob';
import MakePage from './MakePage';
import ModalHeader from '../misc/ModalHeader';
import Verify from './Verify';
import ViewFeedback from './ViewFeedback';
import ManageFeedback from './ManageFeedback';

class AdminMain extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			dealVisible: false,
			jobVisible: false,
			removingDeals: false,
			removingJobs: false,
			visible: false,
			viewFeedbackVisible: false,
			manageFeedbackVisible: false,
			createJobVisible: false,
		}
	}

	createDeal(){
		this.setState({dealVisible: true});
	}

	toggleRemoveDeals(){
		this.setState({removingDeals: !this.state.removingDeals});
	}

	createJob(){
		this.setState({createJobVisible: true});
	}

	toggleRemoveJobs(){
		this.setState({removingJobs: !this.state.removingJobs});
	}

	setCreateDealVisible(dealVisible){
		this.setState({dealVisible});
	}

	setCreateJobVisible(jobVisible){
		this.setState({createJobVisible: jobVisible});
	}

	close(){
		this.setState({visible: false});
	}

	closeManageFeedback(){
		this.setState({manageFeedbackVisible: false});
	}

	closeViewFeedback(){
		this.setState({viewFeedbackVisible: false});
	}	

	closeCreateJob(){
		this.setState({createJobVisible: false});
	}

	render() {

		//console.log(this.props.profile);
		if(!this.props.profile.page || !this.props.page){
			return(
				<View style={{alignItems: 'center', marginTop: this.props.references.globalMarginTop}}>
					<Text style={[styles.text, styles.title]}>Welcome, Make A Page!</Text>
					<Text style={styles.text}>If you own or represent a business you can sign that business up with Veer by clicking this button and following the form.</Text>
					<Button width={width-10} text="Make a page" onPress={() => this.setState({visible: true})}/>
					<Modal visible={this.state.visible} animationType="slide">	
						<ModalHeader close={this.close.bind(this)}/>
						<MakePage close={this.close.bind(this)}/>
					</Modal>
				</View>
			);
		}

		if(!this.props.profile.businessCard){
			return(
				<Verify/>
			);
		}

		var which;
		var buttons;
		if(this.props.main.adminType == 'Deals'){
			var text = 'My deals offered';
			if(!this.props.deals.length){
				text = 'You are currently offering no deals';
			}
			which = (
				<View style={{alignItems: 'center'}}>
					<Text style={styles.title}>{text}</Text>
					<DealsList profile={this.props.profile} admin={true} removingDeals={this.state.removingDeals} deals={this.props.deals}/>
				</View>
			);
			buttons = (
				<View>
					<TouchableOpacity 
						activeOpacity={0.8} 
						style={styles.plus}
						onPress={() => this.createDeal()}
					>
						<Icon name="plus-circle" color="white" size={20}/>
					</TouchableOpacity>
					<TouchableOpacity 
						activeOpacity={0.8} 
						style={styles.minus}
						onPress={() => this.toggleRemoveDeals()}
					>
						<Icon name="minus-circle" color="white" size={20}/>
					</TouchableOpacity>
				</View>
			);
		}
		if(this.props.main.adminType == 'Feedback'){
			console.log(this.props.page);
			which = (
				<View style={{alignItems: 'center'}}>
					<Text style={styles.title}>Feedback</Text>
					<Button height={70} width={width-20} text={"View messages - " + this.props.messages.length} onPress={() => this.setState({viewFeedbackVisible: true})}/>
					<View style={{height: 10}}/>
					<Button height={70} width={width-20} text={"Manage reviews - " + this.props.page.selectedMessages.length} onPress={() => this.setState({manageFeedbackVisible: true})}/>
					<Modal visible={this.state.viewFeedbackVisible} animationType="slide">
						<ModalHeader close={this.closeViewFeedback.bind(this)}/>
						<ViewFeedback feedback={this.props.messages}/>
					</Modal>
					<Modal visible={this.state.manageFeedbackVisible} animationType="slide">
						<ModalHeader close={this.closeManageFeedback.bind(this)}/>
						<ManageFeedback feedback={this.props.page.selectedMessages}/>
					</Modal>
				</View>
			);
		}
		if(this.props.main.adminType == 'Jobs'){
			which = (
				<View>
					<Text style={styles.title}>Jobs that you offer</Text>
					<JobsList removingJobs={this.state.removingJobs} jobs={this.props.jobs}/>
				</View>
			);
			buttons = (
				<View>
					<TouchableOpacity 
						activeOpacity={0.8} 
						style={styles.plus}
						onPress={() => this.createJob()}
					>
						<Icon name="plus-circle" color="white" size={20}/>
					</TouchableOpacity>
					<TouchableOpacity 
						activeOpacity={0.8} 
						style={styles.minus}
						onPress={() => this.toggleRemoveJobs()}
					>
						<Icon name="minus-circle" color="white" size={20}/>
					</TouchableOpacity>
				</View>
			);
		}
		if(this.props.main.adminType == 'UpdateInfo'){
			which = <UpdateInfo page={this.props.page}/>
		}

		return(
			<View style={{flex: 1}}>
				<View style={{flex: 1, alignItems: 'center',}}>
					<ScrollView style={{marginTop: this.props.references.globalMarginTop, paddingTop: 5,}}>
						{which}
					</ScrollView>
				</View>
				{buttons}
				<Modal visible={this.state.dealVisible} animationType="slide">
					<CreateDeal setCreateDealVisible={this.setCreateDealVisible.bind(this)} />
				</Modal>
				<Modal visible={this.state.createJobVisible} animationType="slide">
					<ModalHeader close={this.closeCreateJob.bind(this)}/>
					<CreateJob setCreateJobVisible={this.setCreateJobVisible.bind(this)}/>
				</Modal>
			</View>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	plus: {
		backgroundColor: 'blue',
		position: 'absolute',
		bottom: 60,
		right: 5,
		padding: 5,
		height: 50,
		width: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		shadowOffset: {width: 3, height: 5},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
	},
	minus: {
		backgroundColor: 'red',
		position: 'absolute',
		right: 5,
		bottom: 5,
		padding: 5,
		borderRadius: 25,
		height: 50,
		width: 50,
		justifyContent: 'center',
		alignItems: 'center',
		shadowOffset: {width: 3, height: 5},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
	},
	text: {
		textAlign: 'center',
		margin: 5,
		marginBottom: 10
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

const MeteorContainer = createContainer(props => {
	Meteor.subscribe('profile');
	Meteor.subscribe('ownPage');
	Meteor.subscribe('ownDeals');
	Meteor.subscribe('ownJobs');
	Meteor.subscribe('pageMessages');

	var profile = Meteor.collection('profile').findOne({});
	var page = Meteor.collection('page').findOne({_id: profile.page});

	return{
		profile,
		page,
		deals: Meteor.collection('deal').find({pageID: profile.page}),
		jobs: Meteor.collection('job').find(),
		messages: Meteor.collection('message').find()
	}	
}, AdminMain);

export default connect(mapStateToProps)(MeteorContainer);



