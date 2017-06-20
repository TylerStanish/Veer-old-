import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

import {connect} from 'react-redux';

import Loading from './Loading';

class Button extends Component{
	
	constructor(props) {
		super(props);
		var height;
		var width;
		if(props.height){
			height = props.height;
		}else{
			height = 50;
		}
		if(props.width){
			width = props.width;
		}else{
			width = 100;
		}
		this.state = {
			height,
			width,
		}
	}

	render() {

		var color = this.props.references.color;
		if(this.props.color){
			color = this.props.color;
		}

		var content = <Text style={[styles.text, {fontSize: (this.state.height)/4, color}]}>{this.props.text}</Text>
		if(this.props.loading){
			content = <Loading height={30} width={30}/>
		}

		return(
			<TouchableOpacity activeOpacity={0.8} onPress={this.props.onPress} style={[styles.button, {height: this.state.height, width: this.state.width,}]}>
				{content}
			</TouchableOpacity>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		borderColor: '#aaa',
		borderWidth: 0.5,
		backgroundColor: 'white'
	},
	text: {
		textAlign: 'center',
		fontWeight: 'bold',
		padding: 10,
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
	}
}

export default connect(mapStateToProps)(Button);


