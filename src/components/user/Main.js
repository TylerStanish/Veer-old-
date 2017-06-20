import React, {Component} from 'react';
import {
	View,
	ScrollView, 
	TouchableOpacity, 
	Platform, 
	Text, 
	//Navigator, 
	StyleSheet, 
	Dimensions, 
	NativeModules
} from 'react-native';

import Loading from '../misc/Loading';
import TabBar from '../misc/TabBar';

import Icon from 'react-native-vector-icons/FontAwesome';
import Meteor, {createContainer} from 'react-native-meteor';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {Actions} from 'react-native-router-flux';
import moment from 'moment';

import DealCard from '../common/DealCard';
import DealsList from '../common/lists/DealsList';
import JobsList from '../common/lists/JobsList';
import PagesList from '../common/lists/PagesList';

const {StatusBarManager} = NativeModules;

class Main extends Component{

	constructor(props) {
		super(props);
		this.state = {
			tab: 'Today',
			loading: true
		}
	}

	changeTab(i){
		this.setState({tab: i});
	}

	componentDidMount() {
		var statusHeight;

		var navHeight;
		if(Platform.OS == 'ios'){ 
			//navHeight = Navigator.NavigationBar.Styles.General.NavBarHeight;
			navHeight = 64;
		}else if(Platform.OS == 'android'){
			navHeight = 54;
		}
		this.props.setGlobalMarginTop(navHeight);
		return;

		if(Platform.OS == 'android'){
			StatusBarManager.currentHeight(h => {

			});
		}
		StatusBarManager.getHeight(h => {
			if(h.height){
				
				statusHeight = Number(h.height);
			}else{
				statusHeight = 1;
			}

			var navHeight;
			
			if(Platform.OS == 'ios'){ 
				//navHeight = Navigator.NavigationBar.Styles.General.NavBarHeight;
				navHeight = 64;
			}else if(Platform.OS == 'android'){
				navHeight = 54;
			}

			if(!this.props.references.globalMarginTop && statusHeight && navHeight){
				
				this.props.setGlobalMarginTop(navHeight);
			}
			this.setState({loading: false});
		});	
	}

	render() {

		

		if(!this.props.profile || this.state.loading || !Array.isArray(this.props.bookDeals) || !Array.isArray(this.props.deals)){
			console.log(this.props.profile);
			console.log(this.state.loading);
			console.log(this.props.bookDeals);
			console.log(this.props.deals);
			
		}

		var which;
		if(this.props.main.userType == 'Deals'){

			// you still need to sort by upvotes in the list component

			which = (
				<View>
					<View style={{alignItems: 'center', marginTop: 5,}}>	
						<Text style={styles.title}>Liked Specials</Text>
						<DealsList profile={this.props.profile} fromBook={true} deals={this.props.bookDeals}/>
					</View>
					<View style={styles.bar}/>
					<View style={{alignItems: 'center'}}>
						<DealsList profile={this.props.profile} deals={this.props.deals}/>
					</View>
				</View>
			);
		}
		if(this.props.main.userType == 'Pages'){
			
			which = (
				<View>
					<View style={{alignItems: 'center', marginTop: 5,}}>
						<Text style={styles.title}>Favorite Businesses</Text>
						<PagesList fromBook={true} pages={this.props.bookPages} />
					</View>
					<View style={styles.bar}/>
					<View style={{alignItems: 'center'}}>
						<Text style={styles.title}>Local Businesses</Text>
						<PagesList pages={this.props.pages}/>
					</View>
				</View>
			);
		}
		if(this.props.main.userType == 'Jobs'){
			which = (
				<View style={{alignItems: 'center', marginTop: 5,}}>
					<Text style={styles.title}>Jobs</Text>
					<JobsList jobs={this.props.jobs}/>
				</View>
			);
		}

		return(
			<View style={{flex: 1, alignItems: 'center',}}>
				<ScrollView style={{marginTop: this.props.references.globalMarginTop}}>
					{which}
				</ScrollView>
				<TouchableOpacity onPress={() => Actions.Map({type: 'reset', title: 'Map' /*mapType: this.props.main.userType*/})} activeOpacity={0.8} style={[styles.map, {backgroundColor: this.props.references.color}]}>
					<Icon name="map" color="white" size={20}/>
				</TouchableOpacity>
			</View>
		);
	}
}

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
	bar: {
		width: width-10,
		height: 1,
		backgroundColor: 'black',
		marginVertical: 10,
	},
	map: {
		padding: 15, 
		position: 'absolute', 
		bottom: 10, 
		right: 10, 
		width: 50, 
		height: 50, 
		borderRadius: 25,
		shadowOffset: {width: 3, height: 5},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
	},
	title: {
		textAlign: 'center',
		marginVertical: 10,
		fontWeight: 'bold',
		fontSize: 20
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
		main: state.main
	}
}

const MeteorContainer = createContainer((props) => {
	Meteor.subscribe('localDeals');
	Meteor.subscribe('bookDeals');
	Meteor.subscribe('localPages');
	Meteor.subscribe('localJobs');

	Meteor.subscribe('profile');

	var profile = Meteor.collection('profile').findOne({});

	/*
	if(!profile){
		return{
			deals: Meteor.collection('deal').find({upvotes: {$not:Meteor.userId()}}),
			bookDeals: Meteor.collection('deal').find({upvotes:Meteor.userId()}),
			jobs: Meteor.collection('job').find(),
		}
	}
	*/

	// perhaps try a setTimeout to wait for the profile?

	return{
		deals: Meteor.collection('deal').find({upvotes: {$not:Meteor.userId()}}),
		bookDeals: Meteor.collection('deal').find({upvotes:Meteor.userId()}),
		pages: Meteor.collection('page').find({_id: {$nin: profile.favorite}}),
		bookPages: Meteor.collection('page').find({_id: {$in: profile.favorite}}),
		jobs: Meteor.collection('job').find(),
		profile
	}
}, Main);

export default connect(mapStateToProps, actions)(MeteorContainer);




