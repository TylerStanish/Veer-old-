import React, {Component} from 'react';
import {
	View, 
	StyleSheet, 
	Text, 
	TouchableOpacity, 
	Platform,
	Alert,
	Dimensions,
	TextInput,
	Modal,
	Animated,
	ScrollView,
} from 'react-native';

import MapView from 'react-native-maps';
import {connect} from 'react-redux';
import Meteor, {createContainer} from 'react-native-meteor';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import Geocoder from 'react-native-geocoding';

import Button from '../misc/Button';
import OrgModal from '../common/OrgModal';
import Loading from '../misc/Loading';
import ModalHeader from '../misc/ModalHeader';


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// Increase performance! This is where the app is not looking good!
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


class Map extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			region: new MapView.AnimatedRegion({
				latitude: props.profile.lat,
				longitude: props.profile.long,
				latitudeDelta: 0.03,
				longitudeDelta: 0.03,
			}),

			popup: false,
			visible: false,
			orgId: null,
			org: null,

			opacity: new Animated.Value(0),
			top: new Animated.Value(height),

			loadingSearch: false,
		}
		this.fine = false;
	}

	componentDidMount(){
		setTimeout(() => {
			this.fine = true;
		},1000);
		console.log('timeout set to one second');
	}

	componentWillUnmount(){
		navigator.geolocation.clearWatch(this.watchID);
	}

	goToSearch(){
		var duration = 500;
		this.setState({popup: true}, () => {
			Animated.parallel([
				Animated.timing(this.state.opacity, {toValue: 0.9, duration: duration}),
				Animated.timing(this.state.top, {toValue: height/2 - 112.5, duration: duration}),
			]).start();
			setTimeout(() => {
				this.refs.search.focus(); 
			}, duration);
		});
	}

	exitSearch(){
		var duration = 500;
		Animated.parallel([
			Animated.timing(this.state.opacity, {toValue: 0, duration: duration}),
			Animated.timing(this.state.top, {toValue: height, duration: duration}),
		]).start();
		setTimeout(() => {
			this.setState({popup: false});
		}, duration);
	}

	goToCurrentLocation(){

		navigator.geolocation.getCurrentPosition((position) => {
			//var pos = JSON.stringify(position);
			
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			this.setState({region: {
				latitude: lat,
				longitude: lon,
				latitudeDelta: 0.05,
				longitudeDelta: 0.05
			}});
			
		},(error) => Alert.alert('There was an error in retrieving your location. Try turning on location services.'),
			{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		);
	}

	search(){
		if(!this.state.search){
			Alert.alert('Missing location');
			return;
		}
		this.setState({loadingSearch: true});
		Geocoder.getFromLocation(this.state.search.toString()).then(res => {
			
			var latitude = res.results[0].geometry.location.lat;
			var longitude = res.results[0].geometry.location.lng;
			var region = {
				latitude, longitude, latitudeDelta: 0.03, longitudeDelta: 0.03
			}
			Meteor.call('profile.newLocation', [longitude, latitude], (error) => {
				if(!error){
					this.exitSearch();
					Meteor.call('profile.newLocation', {long: longitude, lat: latitude}, (error) => {
						if(error){
							console.log(error);
							Alert.alert('Error code 051');
						}else{
							Meteor.subscribe('localPages');
							Meteor.subscribe('localDeals');
							if(this.state.region.setValue){	
								this.state.region.setValue(region);
							}else{
								this.setState({region});
							}
						}
					});
					this.setState({loadingSearch: false});
				}else{
					console.log(error);
					this.setState({loadingSearch: false});
				}
			});
		}, error => {
			console.log(error);
			Alert.alert('Invalid address!');
			this.setState({loadingSearch: false});
		});
	}

	backToList(){
		Actions.Main({type: 'reset'});
	}

	setVisible(bool){
		this.setState({visible: bool});
	}

	close(){
		this.setState({visible: false});
	}

	renderMarkers(){
		return this.props.pages.map(page => {
			console.log(page);
			console.log(this.props.profile);
			if((this.props.main.userType == 'Deals') || (this.props.main.userType == 'Pages')){	
				var color = 'black';
				this.props.localDeals.map(deal => {
					if(deal.pageID == page._id){
						color = this.props.references.color;
					}
				});
				return(
					<MapView.Marker
						pinColor={color}
						key={page._id}
						coordinate={{latitude: page.lat, longitude: page.long}}
						onSelect={() => Actions.PageView({title: page.pageName, orgId: page._id, profile: this.props.profile, backTitle: 'Map', backButtonTextStyle: this.props.references.backStyle})}
						onPress={() => Actions.PageView({title: page.pageName, orgId: page._id, profile: this.props.profile, backTitle: 'Map', backButtonTextStyle: this.props.references.backStyle})}
					/>
				);
			}
			if(this.props.main.userType == 'Jobs'){
				var color = 'black';
				this.props.localJobs.map(job => {
					if(job.pageID == page._id){
						color = 'blue';
					}
				});
				
				return(
					<MapView.Marker
						pinColor={color}
						key={page._id}
						coordinate={{latitude: page.lat, longitude: page.long}}
						onSelect={() => Actions.PageView({title: page.pageName, orgId: page._id, profile: this.props.profile, backTitle: 'Map', backButtonTextStyle: this.props.references.backStyle})}
						onPress={() => Actions.PageView({title: page.pageName, orgId: page._id, profile: this.props.profile, backTitle: 'Map', backButtonTextStyle: this.props.references.backStyle})}
					/>
				);
			}
		});
	}

	onRegionChange(region){
		if(!this.fine){
			return;
		}
		//console.log(region);
		if(this.state.region.setValue){	
			this.state.region.setValue(region);
		}else{
			this.setState({region});
		}
		Meteor.call('profile.newLocation', {long: region.longitude, lat: region.latitude}, err => {
			if(!err){
				Meteor.subscribe('localDeals');
				Meteor.subscribe('localPages');
			}
		});
	}

	render(){

		if(!this.props.profile){
			return <Loading/>
		}

		var popup;
		if(this.state.popup){
			popup = (
				<Animated.View style={{
					opacity: this.state.opacity, 
					alignItems: 'center', 
					justifyContent: 'space-around', 
					zIndex: 9, 
					backgroundColor: 'white', 
					position: 'absolute', 
					//height: 225, 
					padding: 12,
					width: 225, 
					top: this.state.top, 
					right: width/2 - 112.5,
					borderRadius: 5,
				}}>
					<Text style={styles.title}>Search</Text>
					<Text style={styles.text}>Pick a new location</Text>
					<ScrollView horizontal={true}>
						<TextInput
							style={styles.input}
							ref="search"
							returnKeyType={"search"}
							onChangeText={(search) => this.setState({search})}
							autoCorrect={false}
							placeholder="Location"
							onSubmitEditing={() => this.search()}
						/>
					</ScrollView>
					<View style={{flexDirection: 'row', justifyContent: 'space-around', width: 225,}}>
						<Button loading={this.state.loadingSearch} text="Search" onPress={() => this.search()}/>
						<Button text="Close" onPress={() => this.exitSearch()}/>
					</View>
				</Animated.View>
			);
		}

		return(
			<View style={[ styles.container]}>
				{/* Insert map here */}
				<MapView.Animated 
					onRegionChange={(region) => this.onRegionChange(region)}
					style={styles.map} 
					showsUserLocation={true}
					region={this.state.region}
				>
					{this.renderMarkers()}
				</MapView.Animated>

				<TouchableOpacity activeOpacity={0.8} onPress={() => this.backToList()} style={[{right: 10, backgroundColor: this.props.references.color}, styles.button]}>
					<Icon style={styles.icon} name="list" color="white" size={20}/>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} onPress={() => this.goToSearch()} style={[{right: 70, backgroundColor: 'yellow'}, styles.button]}>
					<Icon style={styles.icon} name="search" color="white" size={20}/>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} onPress={() => this.goToCurrentLocation()} style={[{right: 130, backgroundColor: 'blue'}, styles.button]}>
					<Icon style={styles.icon} name="location-arrow" color="white" size={20}/>
				</TouchableOpacity>
				{popup}
				<Modal animationType="slide" visible={this.state.visible}>
					<ModalHeader title={(this.state.org) ? this.state.org.pageName : " "} close={this.close.bind(this)} />
					<OrgModal profile={this.props.profile} orgId={this.state.orgId} setVisible={this.setVisible.bind(this)}/>
				</Modal>
			</View>
		);
	}
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		elevation: (Platform.OS == 'android') ? 2 : 0,
	},
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
	},
	text: {
		textAlign: 'center',
		fontSize: 18
	},
	input: {
		height: 40,
		width: height/2 - 112.5 - 12.5 - 24,
		marginHorizontal: 10,
		paddingLeft: 10,
		marginVertical: 5,
		backgroundColor: 'white',
		borderColor: 'gray',
		borderWidth: 1,
	},
	button: {
		position: 'absolute',
		bottom: 10,
		height: 50,
		width: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		shadowOffset: {width: 3, height: 5},
		shadowOpacity: 0.4,
		elevation: (Platform.OS == 'android') ? 2 : 0,
	},
	icon: {
		backgroundColor: 'transparent',
		shadowOpacity: 0.4,
		shadowOffset: {width: 3, height: 5},
		elevation: (Platform.OS == 'android') ? 2 : 0,
	},
	/*map: {
		flex: 1
	}*/
	container: {
    	position: 'absolute',
    	top: 0,
    	left: 0,
    	right: 0,
    	bottom: 0,
    	justifyContent: 'flex-end',
    	alignItems: 'center',
  	},
  	map: {
    	position: 'absolute',
    	top: 0,
    	left: 0,
    	right: 0,
    	bottom: 0,
  	},
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
		main: state.main,
	}
}

const MeteorContainer = createContainer(props => {
	
	var subscription = Meteor.subscribe("profile");
	Meteor.subscribe('localPages');
	Meteor.subscribe("localDeals");
	Meteor.subscribe("localJobs");

	var profile = Meteor.collection('profile').findOne({});
	var localDeals = Meteor.collection('deal').find({});
	

	var loading = !subscription.ready();

	return{
		profile,
		pages: Meteor.collection('page').find({}),
		localDeals,
		localJobs: Meteor.collection('job').find({}),
		loading,
	}
}, Map);

export default connect(mapStateToProps)(MeteorContainer);


