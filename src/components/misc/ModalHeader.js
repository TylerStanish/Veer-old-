import React, {Component} from 'react';
import {View, Platform, Dimensions, TouchableOpacity, StyleSheet, Text} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

class ModalHeader extends Component{
	
	render() {

		return(
			<View style={[{backgroundColor: this.props.references.color, height: this.props.references.globalMarginTop}, styles.container]}>
				<Text style={styles.text}>{this.props.title}</Text>
				<TouchableOpacity activeOpacity={0.8} onPress={() => this.props.close()}>
					<Icon name="times" color="white" size={30} />
				</TouchableOpacity>
			</View>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		zIndex: 9,
		width,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		padding: 10,
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.4,
		elevation: (Platform.OS == 'android') ? 2 : 0,
	},
	text: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 20,
		position: 'absolute',
		left: 10,
		bottom: 5,
		width: width*0.8
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references
	}
}

export default connect(mapStateToProps)(ModalHeader);