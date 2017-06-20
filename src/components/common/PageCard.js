import React, {Component} from 'react';
import {
	View, 
	TouchableOpacity, 
	Text, 
	StyleSheet, 
	Image, 
	Dimensions, 
	Platform,
	Modal,
	TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import Meteor from 'react-native-meteor';
import {connect} from 'react-redux';

import Loading from '../misc/Loading';
import Button from '../misc/Button';
import ModalHeader from '../misc/ModalHeader';
import OrgModal from './OrgModal';

class PageCard extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		}
	}

	setHeight(event){
		var height = event.nativeEvent.layout.height;
		if(height && (this.state.height != height)){
			this.setState({height});
		}
	}

	addToFavorites(){
		Meteor.call('page.favorite', this.props.page._id, (error) => {
			if(error){
				console.log(error);
			}
		});
	}

	setVisible(b){
		this.setState({visible: b});
	}

	render() {

		if(!this.props.page || !this.props.profile){
			return <Loading/>
		}

		console.log(this.props.page);

		var uri;
		if(this.props.page.image.substring(0,1) == '/'){
			uri = 'https://www.veeroption.com' + this.props.page.image;
		}else{
			uri = this.props.page.image;
		}

		var text;
		if(this.props.fromBook){
			text = "Remove from favorites";
		}else{
			text = "Add to favorites";
		}

		return(
			<View>
				<TouchableOpacity onPress={() => Actions.PageView({orgId: this.props.page._id, profile: this.props.profile, backTitle: 'Businesses', backButtonTextStyle: this.props.references.backStyle})} activeOpacity={0.8} onLayout={(event) => this.setHeight(event)} style={[{height: this.state.height}, styles.card]}>
					<Image
						source={{uri}}
						style={{marginRight: 5, width: width/4, height: (!this.state.height) ? width/4 : this.state.height}}
					/>
					<View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
						<Text numberOfLines={1} style={styles.title}>{this.props.page.pageName}</Text>
						<Text numberOfLines={3} style={styles.text}>{this.props.page.about}</Text>
						<Button text={text} onPress={this.addToFavorites.bind(this)} width={width - width/4 - 10}/>
						<View style={{height: 8, width}}/>
					</View>
				</TouchableOpacity>
				<Modal visible={this.state.visible} animationType="slide">
					<ModalHeader close={() => this.setState({visible: false})}/>
					<OrgModal profile={this.props.profile} orgId={this.props.page._id} setVisible={this.setVisible.bind(this)}/>
				</Modal>
			</View>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	title: {
		fontWeight: 'bold',
		fontSize: 18,
		width: width*0.75 - 10
	},
	text: {
		fontSize: 16,
		marginVertical: 7,
		width: width*0.75 - 10
	},
	card: {
		marginVertical: 5, 
		flexDirection: 'row', 
		width,
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		backgroundColor: 'white'
	},
	bigImage: {
		height: width-10,
		width: width-10,
	},
	imageWrapper: {
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		margin: 5,
		marginBottom: 10,
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references
	}
}

export default connect(mapStateToProps)(PageCard);


