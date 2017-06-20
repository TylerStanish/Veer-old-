import React, {Component} from 'react';
import {Dimensions, Platform, ScrollView, Text, View, StyleSheet} from 'react-native';

import Loading from '../../misc/Loading';

class ReviewsList extends Component{
	
	renderReviews(){
		return this.props.reviews.map(rev => {
			console.log(rev);
			return(
				<View key={rev._id} style={styles.card}>
					<Text style={styles.text}>{rev.name} - {rev.createdAt}</Text>
					<Text style={[styles.text, styles.message]}>"{rev.message}"</Text>
				</View>
			);
		});
	}

	render() {

		if(!this.props.reviews){
			return <Loading/>
		}

		return(
			<ScrollView>
				{this.renderReviews()}
			</ScrollView>
		);

	}
}

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
	card: {
		width: width-10,
		marginVertical: 5,
		padding: 5,
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
	},
	text: {
		textAlign: 'center',
	},
	message: {
		fontWeight: 'bold'
	}
});

export default ReviewsList;



