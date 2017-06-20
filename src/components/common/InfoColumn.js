import React, {Component} from 'react';
import {Dimensions, View, Text, StyleSheet} from 'react-native';

class InfoColumn extends Component{
	render(){

		if(this.props.job){
			return(
				<View>
					<Text numberOfLines={1} style={styles.title}>{this.props.job.title}</Text>
					<Text numberOfLines={2} style={styles.text}>{this.props.job.pageName}</Text>
					<Text numberOfLines={1} style={styles.text}>Posted on: {this.props.job.datePosted}</Text>
				</View>
			);
		}
		
		return(
			<View>
				<Text numberOfLines={1} style={styles.title}>{this.props.deal.title}</Text>
				<Text numberOfLines={2} style={styles.text}>{this.props.deal.pageName}</Text>
				<Text numberOfLines={1} style={styles.text}>{this.props.deal.date}</Text>
			</View>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	title: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 20,
		marginVertical: 7,
		width: width*0.75 - 10 - 40,
	},
	text: {
		textAlign: 'center',
		fontSize: 18,
		width: width*0.75 - 10 - 40,
		marginVertical: 5,
	}
});

export default InfoColumn;