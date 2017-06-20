import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

class TabBar extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			icons: props.icons,

			selected: props.icons[0],
		}
	}

	changeTab(i){
		this.setState({selected: i});
		this.props.changeTab(i);
	}

	renderButtons(){
		return this.state.icons.map(i => {
			var color;
			var borderBottomWidth;
			var borderColor;
			var backgroundColor;
			if(this.state.selected == i){
				color = 'white';
				// borderBottomWidth = 5;
				borderColor = 'green';
				backgroundColor = this.props.references.color;
			}else{
				color = this.props.references.color;
				// borderBottomWidth = 1;
				borderColor = 'black';
				backgroundColor = 'white';
			}
			if(this.props.isText){
				return(
					<View style={{marginHorizontal: 0,}} key={i}>
						<TouchableOpacity activeOpacity={1} onPress={() => this.changeTab(i)} style={[{width: width/this.state.icons.length - 10, backgroundColor, borderColor, borderBottomWidth}, styles.button]}>
							<Text style={{color, fontSize: 16}}>{i}</Text>
						</TouchableOpacity>
					</View>
				);
			}
			return(
				<View style={{marginHorizontal: 5}} key={i}>
					<TouchableOpacity activeOpacity={1} onPress={() => this.changeTab(i)} style={[{width: width/this.state.icons.length - 10, backgroundColor, borderColor, borderBottomWidth}, styles.button]}>
						<Icon name={i.toString()} color={color} size={30}/>
					</TouchableOpacity>
				</View>
			);
		});
	}

	render() {
		return(
			<View style={styles.container}>
				{this.renderButtons()}
			</View>
		);
	}
};


const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		width: width-20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 5,
		borderRadius: 4,
		
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
	}
}

export default connect(mapStateToProps)(TabBar);


