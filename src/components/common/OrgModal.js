import React, {Component} from 'react';
import {
	View, 
	StyleSheet, 
	Text, 
	Modal, 
	Dimensions,
	TouchableOpacity,
	Platform,
	Image,
	ScrollView,
	Alert,
} from 'react-native';

import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Meteor, {createContainer} from 'react-native-meteor';

import Loading from '../misc/Loading';
import TabBar from '../misc/TabBar';
import DealsList from './lists/DealsList';
import JobsList from './lists/JobsList';
import ReviewsList from './lists/ReviewsList';
import Button from '../misc/Button';
import Reviews from '../user/Reviews';
import Info from '../user/Info';

class OrgModal extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			tab: 'Deals',
			tab2: 'Today',
			reviewModal: false,
		}
	}

	changeTab(t){
		this.setState({tab: t});
	}

	changeTab2(t){
		this.setState({tab2: t});
	}

	dropNote(){
		this.setState({reviewModal: true});
	}

	upvote(){
		Meteor.call('page.favorite', this.props.org._id, (err, data) => {
			if(err){
				Alert.alert('There was an error');
			}
		});
	}

	render() {

		if(!this.props.org || !this.props.deals || !this.props.jobs){
			return(
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<Loading/>
				</View>
			);
		}

		var uri;
		if(this.props.org.image.substring(0,1) == '/'){
			uri = 'https://www.veeroption.com' + this.props.org.image;
		}else{
			uri = this.props.org.image;
		}

		var which;
		if(this.state.tab == 'Deals'){
			if(!this.props.deals.length){
				which = <Text>There are currently no deals at {this.props.org.pageName}</Text>
			}else{
				which = <DealsList profile={this.props.profile} deals={this.props.deals}/>
			}
		}
		if(this.state.tab == 'Reviews'){
			which = <Reviews org={this.props.org} reviews={this.props.org.selectedMessages} />
		}
		if(this.state.tab == 'Jobs'){
			which = <JobsList jobs={this.props.jobs}/>
		}
		if(this.state.tab == 'Info'){
			which = <Info org={this.props.org}/>
		}

		return(
			<ScrollView style={{marginTop: 5}} contentContainerStyle={{alignItems: 'center',}}>
				<View style={styles.container}>	
					<Image
						source={{uri}}
						style={styles.image}
					/>
					<TouchableOpacity 
						onPress={() => this.upvote()}
						activeOpacity={0.8} 
						style={
							{
								flexDirection: 'row',
								alignItems: 'center',
								position: 'absolute', 
								left: 5, 
								top: height/3 - 30,
							}
						}
					>
						<Text style={{backgroundColor: 'transparent', padding: 5, fontSize: 20, fontWeight : 'bold'}}>{this.props.org.favorites}</Text>
						<Icon style={{backgroundColor: 'transparent', shadowOpacity: 0.8, shadowOffset: {width: 2, height: 3}}} name="star" color="blue" size={30}/>
					</TouchableOpacity>
				</View>
				<TabBar icons={['Deals', 'Reviews', 'Jobs', 'Info']} changeTab={this.changeTab.bind(this)} isText={true} />
				{which}
			</ScrollView>
		);
	}
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		shadowOffset: {width: 5, height: 5},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		backgroundColor: 'white'
	},
	image: {
		width: width-10,
		height: height/3,
		marginTop: 5,
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references
	}
}

const MeteorContainer = createContainer(props => {
	Meteor.subscribe('singleLocalDeals', props.orgId);
	Meteor.subscribe('localJobs');
	Meteor.subscribe('localPages');
	return{
		deals: Meteor.collection('deal').find({pageID: props.orgId}),
		jobs: Meteor.collection('job').find({pageID: props.orgId}),
		org: Meteor.collection('page').findOne({_id: props.orgId}),
	}
}, OrgModal);

export default connect(mapStateToProps)(MeteorContainer);


