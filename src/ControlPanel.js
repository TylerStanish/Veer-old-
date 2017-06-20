import React, {Component} from 'react';
import {
	View, 
	Text, 
	StyleSheet, 
	Dimensions,
	TouchableOpacity,
	Platform
} from 'react-native';

import {connect} from 'react-redux';
import Meteor, {createContainer} from 'react-native-meteor';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as actions from './actions';

import Loading from './components/misc/Loading';
import Button from './components/misc/Button';

class ControlPanel extends Component{
	
	constructor(props) {
		super(props);
	}

	logout(){
		Meteor.logout();
		Actions.LoggedOut({type: 'reset'});
		this.props.closeDrawer();
		this.props.setUserType('Deals');
		this.props.setAdminType('Deals');
		this.props.whichTab('User');
	}

	setTitle(){
		if(this.props.main.userType == 'Deals'){
			return 'Specials';
		}
		if(this.props.main.userType == 'Pages'){
			return 'Business';
		}
		return 'Jobs';
	}

	render() {
		
		if(!this.props.profile){
			return <Loading/>
		}

		var which;
		var toggle;
		if(this.props.main.userTab == 'User'){
			which = (
				<View>
					<TouchableOpacity onPress={() => {this.props.setUserType('Deals'); this.props.closeDrawer()}} activeOpacity={0.8} style={[{borderTopWidth: 1}, styles.button]}>
						<Icon name="star" style={styles.icon} size={30}/>
						<Text style={styles.title}>Daily Specials</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {this.props.setUserType('Jobs'); this.props.closeDrawer()}} style={styles.button} activeOpacity={0.8}>	
						<Icon name="briefcase" style={styles.icon} size={30}/>
						<Text style={styles.title}>Jobs</Text>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => {this.props.setUserType('Pages'); this.props.closeDrawer()}}>
						<Icon name="building" style={styles.icon} size={30}/>
						<Text style={styles.title}>Businesses</Text>
					</TouchableOpacity>
				</View>
			);
			toggle = (
				<TouchableOpacity onPress={() => {Actions.AdminMain({type: 'reset', title: 'My Business'}); this.props.whichTab('Admin')}} activeOpacity={0.8} style={[{borderTopWidth: 1}, styles.button]}>
					<Icon name="home" style={styles.icon} size={30}/>
					<Text style={styles.title}>My Business</Text>
				</TouchableOpacity>
			);
		}else if(this.props.main.userTab == 'Admin'){
			if(!this.props.profile.page){
				which = null;
			}else{
				which = (
					<View>
						<TouchableOpacity onPress={() => {this.props.setAdminType('Deals'); this.props.closeDrawer()}} style={[{borderTopWidth: 1}, styles.button]} activeOpacity={0.8}>	
							<Icon name="star" style={styles.icon} size={30}/>
							<Text style={styles.title}>Specials</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {this.props.setAdminType('Feedback'); this.props.closeDrawer()}} style={styles.button} activeOpacity={0.8}>		
							<Icon name="comment" style={styles.icon} size={30}/>
							<Text style={styles.title}>Feedback</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {this.props.setAdminType('Jobs'); this.props.closeDrawer()}} style={styles.button} activeOpacity={0.8}>		
							<Icon name="briefcase" style={styles.icon} size={30}/>
							<Text style={styles.title}>Jobs</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {this.props.setAdminType('UpdateInfo'); this.props.closeDrawer()}} style={styles.button} activeOpacity={0.8}>		
							<Icon name="info" style={styles.icon} size={30}/>
							<Text style={styles.title}>Update Info</Text>
						</TouchableOpacity>
					</View>
				);
			}
			toggle = (
				<TouchableOpacity onPress={() => {Actions.Main({type: 'reset', title: this.setTitle()}); this.props.whichTab('User')}} style={[{borderTopWidth: 1}, styles.button]} activeOpacity={0.8}>
					<Icon name="user" style={styles.icon} size={30}/>
					<Text style={styles.title}>Back to User</Text>
				</TouchableOpacity>
			);
		}

		

		return(
			<View style={{alignItems: 'center', flex: 1,}}>
				<View style={[styles.shadow, {justifyContent: 'flex-end', alignItems: 'flex-end', height: this.props.references.globalMarginTop + 1, width: width*0.8, backgroundColor: this.props.references.color}]}>
					<TouchableOpacity style={{padding: 15}} onPress={() => this.props.closeDrawer()}>
						<Icon name="times" size={30} color="white"/>
					</TouchableOpacity>
				</View>
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
					<Text style={{backgroundColor: 'transparent'}}>Hello {this.props.profile.name}</Text>
					{which}
					<Text style={{textAlign: 'center'}}>Veer Copyright 2017</Text>
					{toggle}
					<Button width={width*0.8 - 10} height={height/10} text="Log out" onPress={() => this.logout()}/>
				</View>
			</View>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	icon: {
		marginLeft: 20,
		marginRight: 20,
	},
	button: {
		height: height/8,
		width: width*0.8,
		flexDirection: 'row',
		alignItems: 'center',
		//borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#aaa'
	},
	plain: {
		fontSize: 20,
		textAlign: 'center',
		color: 'red',
		width: width*0.8
	},
	shadow: {
		shadowOffset: {width: 3, height: 5},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
	}
})

const mapStateToProps = (state, ownProps) => {
	return{
		main: state.main,
		references: state.references,
	}
}

const MeteorContainer = createContainer(props => {
	Meteor.subscribe('profile');

	return{
		profile: Meteor.collection('profile').findOne({})
	}
}, ControlPanel);

export default connect(mapStateToProps, actions)(MeteorContainer);


