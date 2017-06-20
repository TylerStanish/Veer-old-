import React, {Component} from 'react';
import {
	View, 
	ScrollView, 
	StyleSheet,
	Text
} from 'react-native';

import Loading from '../misc/Loading';

class Info extends Component{
	render() {

		if(!this.props.org){
			return <Loading/>
		}

		

		return(
			<View>
				<Text style={[styles.title, styles.text]}>{this.props.org.pageName}</Text>
				<Text style={styles.text}>{this.props.org.address}</Text>
				<Text style={styles.text}>{this.props.org.phone}</Text>
				<Text style={styles.text}>{this.props.org.email}</Text>
				<Text style={styles.text}>{this.props.org.about}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		marginVertical: 15,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 20
	}
});

export default Info;


