import React, {Component} from 'react';
import {
	View, 
	Text, 
	StyleSheet, 
	Dimensions, 
	Platform,
	Image,
	TouchableOpacity,
	ScrollView,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Meteor, {createContainer} from 'react-native-meteor';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import Loading from '../misc/Loading';

class DealView extends Component{
	
	upvote(){
		console.log('tyring to upvote');
		Meteor.call('profile.book', this.props.deal._id, (error) => {
			if(error){
				Alert.alert('There was an error');
			}
		});
	}

	render() {

		if(!this.props.deal){
			return <Loading/>
		}

		var color = 'black';
		this.props.deal.upvotes.map(ids => {
			if(ids == Meteor.userId()){
				color = this.props.references.color;
			}
		});

		var uri;
		if(this.props.deal.picture.substring(0,1) == '/'){
			uri = 'https://www.veeroption.com' + this.props.deal.pageImage;
		}else{
			uri = this.props.deal.picture;
		}

		return(
			<ScrollView contentContainerStyle={{alignItems: 'center'}} style={{flex: 1, marginTop: this.props.references.globalMarginTop}}>
				<View style={styles.imageWrapper}>
					<Image
						source={{uri}}
						style={{
							marginTop: 5, 
							width: width-10, 
							height: width-10,
						}}
					/>
				</View>
				<View style={styles.textWrapper}>
					<Text style={[styles.text, styles.title]}>{this.props.deal.title}</Text>
					<Text onPress={() => Actions.PageView({orgId: this.props.deal.pageID, profile: this.props.profile, backTitle: this.props.deal.title, backButtonTextStyle: this.props.references.backStyle})} style={[{fontWeight: 'bold', color: this.props.references.color}, styles.text]}>{this.props.deal.pageName}</Text>
					<Text style={styles.text}>{this.props.deal.date}</Text>
					<Text style={styles.text}>{this.props.deal.address}</Text>
				</View>
				<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', position: 'absolute', padding: 15, left: 0, top: width-5}} activeOpacity={0.8} onPress={() => this.upvote()}>
					<Text style={{marginRight: 5}}>{this.props.deal.upvotes.length}</Text>
					<Icon name="thumbs-up" color={color} size={20}/>
				</TouchableOpacity>
			</ScrollView>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	imageWrapper: {
		shadowOffset: {width: 3, height: 5},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		backgroundColor: 'white'
	},
	textWrapper: {
		marginVertical: 15,
		marginLeft: 20,
		width: width - 50,
		alignItems: 'flex-end'
	},
	text: {
		textAlign: 'right',
		marginVertical: 7,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 20,
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
	}
}

const MeteorContainer = createContainer(props => {
	//Meteor.subscribe('localDeals');
	//Meteor.subscribe('bookDeals');
	if(props.fromBook){
		Meteor.subscribe('bookDeals');
	}else{
		Meteor.subscribe('localDeals');
	}
	Meteor.subscribe('profile');

	return{
		deal: Meteor.collection('deal').findOne({_id: props.id}),
		profile: Meteor.collection('profile').findOne({})
	}
}, DealView);

export default connect(mapStateToProps)(MeteorContainer);



