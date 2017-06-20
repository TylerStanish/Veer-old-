import React, {Component} from 'react';
import {Image, View, Text, StyleSheet, ScrollView, Platform, Dimensions} from 'react-native';

import Meteor, {createContainer} from 'react-native-meteor';

import PageCard from '../../common/PageCard';

class PagesList extends Component{

	renderList(){
		console.log(this.props.pages);
		return this.props.pages.map(page => {
			return(
				<View key={page._id}>
					<PageCard profile={this.props.profile} fromBook={this.props.fromBook} page={page}/>
				</View>
			);
		});
	}

	render() {

		return(
			<View>
				{this.renderList()}
			</View>
		);
	}
}

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
	card: {
		marginVertical: 5, 
		width,
		shadowOffset: {width: 2, height: 3},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 3 : 0,
	}
});

const MeteorContainer = createContainer(props => {
	
	Meteor.subscribe('profile');
	
	return{
		profile: Meteor.collection('profile').findOne({})
	}
}, PagesList);

export default MeteorContainer;



