import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import Meteor from 'react-native-meteor';

import Loading from '../../misc/Loading';
import JobsCard from '../../common/JobsCard';

class JobsList extends Component{
	
	renderJobs(){

		if(!this.props.jobs.length){
			return <Text style={styles.text}>There are currently no jobs being offered near your saved position</Text>
		}

		return this.props.jobs.map(job => {
			return(
				<View key={job._id}>
					<JobsCard removingJobs={this.props.removingJobs} job={job}/>
				</View>
			);
		});
	}

	render() {

		if(!this.props.jobs){
			return <Loading/>
		}

		return(
			<View>
				{this.renderJobs()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		margin: 5,
	}
});

export default JobsList;