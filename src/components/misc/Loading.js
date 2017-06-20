import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

import {connect} from 'react-redux';

class Loading extends Component{

	constructor(props) {
		super(props);
		var size;
		if(!props.size){
			size = 'small';
		}else{
			size = props.size;
		}
		this.state = {
			size
		}
	}

	render() {
		return(
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<ActivityIndicator color={this.props.references.color} size={this.props.size}/>
			</View>
		);
	}

}

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references
	}
}

export default connect(mapStateToProps)(Loading);