import React, {Component} from 'react';
import {
	View, 
	Text, 
	StyleSheet
} from 'react-native';

class JobInfoColumn extends Component{
	render() {
		return(
			<View style={{flex: 1}}>
				<Text numberOfLines={2} style={styles.title}>{this.props.job.title}</Text>
				<Text numberOfLines={1} style={styles.text}>{this.props.job.pageName}</Text>
				<Text numberOfLines={1}>Date posted: {this.props.job.datePosted}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 18
	},
	text: {
		textAlign: 'center',
	}
});

export default JobInfoColumn;



