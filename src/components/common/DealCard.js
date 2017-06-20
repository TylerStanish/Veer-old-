import React, {Component} from 'react';
import {
	View, 
	Text, 
	TouchableOpacity, 
	Dimensions, 
	Image, 
	StyleSheet,
	Platform,
	Alert,
	Modal,
	Animated,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import Meteor, {createContainer} from 'react-native-meteor';
import {Actions} from 'react-native-router-flux';

import InfoColumn from './InfoColumn';
import Loading from '../misc/Loading';
import Button from '../misc/Button';

class DealCard extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			height: new Animated.Value(0),
			visible: false,
		}
	}

	upvote(){
		console.log('tyring to upvote');
		Meteor.call('profile.book', this.props.deal._id, (error) => {
			if(error){
				Alert.alert('There was an error');
			}
		});
	}

	removeDeal(){
		// check this segment for argument errors in runtime. I'm not sure if this method accepts 
		// an array or an object as the third parameter
		Alert.alert(
			'Are you sure you wish to remove this deal?',
			'',
			[
				{text: 'Yes', onPress: () => {
					setTimeout(() => {
						Meteor.call('deal.deleteDeal', this.props.deal._id, (err) => {
							if(err){
								console.log(err);
								Alert.alert(err.reason);
							}else{
								console.log('success');
							}
						});
					}, 1);
					Animated.timing(
						this.state.height,
						{
							toValue: 0,
						}
					).start();
				}},
				{text: 'No'}
			]
		);
	}

	setTotalHeight(event){
		var height = event.nativeEvent.layout.height;
		if(this.state.height != height){
			this.setState({height});
			this.state.height.setValue(height);
		}
	}

	render() {

		if(!this.props.deal){
			return <Loading/>
		}

		var uri;
		if(this.props.deal.picture.substring(0,1) == '/'){
			uri = 'https://www.veeroption.com' + this.props.deal.pageImage;
		}else{
			uri = this.props.deal.picture;
		}

		var deleteCard;
		if(this.props.removingDeals){
			deleteCard = (
				<View>
					<TouchableOpacity activeOpacity={0.8} onPress={() => this.removeDeal()} style={[styles.removing]}>
						<Text style={styles.removingText}>Remove Deal</Text>
					</TouchableOpacity>
				</View>
			);
		}

		console.log(this.props.removingDeals);

		return(
			<View style={{alignItems: 'center'}}>
				<TouchableOpacity onPress={() => Actions.DealView({id: this.props.deal._id, backTitle: (this.props.orgNameForBack) ? this.props.orgNameForBack : 'Specials', backButtonTextStyle: this.props.references.backStyle})} style={styles.container}>
					<Image
						source={{uri}}
						style={[{zIndex: 5, width: width/4, height: width/4}, styles.image]}
						
					/>
					<InfoColumn deal={this.props.deal}/>
					<TouchableOpacity activeOpacity={0.8} onPress={() => this.upvote()}>
						<Icon name="thumbs-up" color={(this.props.fromBook) ? this.props.references.color : "black"} size={20}/>
						<Text>{this.props.deal.upvotes.length}</Text>
					</TouchableOpacity>
				</TouchableOpacity>
				{deleteCard}
				<Modal animationType="slide" visible={this.state.visible}>
					<View style={{flex: 1,}}>
						<View style={{padding: 15, backgroundColor: this.props.references.color, justifyContent: 'flex-end', alignItems: 'flex-end', height: this.props.references.globalMarginTop, width: width}}>
							<TouchableOpacity onPress={() => this.setState({visible: false})}>
								<Icon name="times" size={30} color="white"/>
							</TouchableOpacity>
						</View>
						<Image
							source={{uri: this.props.deal.picture}}
						/>
						<TouchableOpacity activeOpacity={0.8} onPress={() => this.upvote()}>
							<Icon name="thumbs-up" color={(this.props.fromBook) ? this.props.references.color : "black"} size={20}/>
							<Text>{this.props.deal.upvotes.length}</Text>
						</TouchableOpacity>
						<InfoColumn deal={this.props.deal}/>
					</View>
				</Modal>
			</View>
		);
	}
}

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		marginBottom: 0,
		width: width-10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		shadowOffset: {width: 2, height: 2},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		backgroundColor: 'white'
	},
	image: {

	},
	removing: {
		backgroundColor: 'red',
		justifyContent: 'center',
		alignItems: 'center',
		width: width-10,
		shadowOffset: {width: 2, height: 3},
		shadowOpacity: 0.4,
		elevation: (Platform.OS == 'android') ? 2 : 0,
		padding: 3,
		opacity: 0.9,
		borderRadius: 5,
	},
	removingText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
	}
}



export default connect(mapStateToProps)(DealCard);

