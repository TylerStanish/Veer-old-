import React, {Component} from 'react';
import {StatusBar, AppState} from 'react-native';
import Meteor, {connectMeteor} from 'react-native-meteor';
import {Router, Scene, Actions} from 'react-native-router-flux';

import Init from './components/landing/Init';
import Main from './components/user/Main';
import Loading from './components/misc/Loading';
import Map from './components/user/Map';
import AdminMain from './components/admin/AdminMain';
import CreateAccount from './components/landing/CreateAccount';
import BackgroundImage from './components/landing/BackgroundImage';
import DealView from './components/common/DealView';
import PageView from './components/common/PageView';

import {connect} from 'react-redux';
import * as actions from './actions';

@connectMeteor
class App extends Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log('called');
		if(nextState.loading !== this.state.loading){
			console.log('returned true because loading state was different');
			return true;
		}
		return false;
	}

	componentWillMount() {
		const url = 'wss://veeroption.meteorapp.com/websocket';
		Meteor.connect(url);

		AppState.addEventListener('change', state => {
			console.log(state);
			if((this.props.main.userTab == 'User') && Actions.Main){
				Actions.Main({type: 'reset'});
			}else if(Actions.AdminMain){
				Actions.AdminMain({type: 'reset'});
			}
		});
	}

	getMeteorData(){	
		return {
			user: Meteor.user()
		};
	}

	render(){

		console.log('-------------rendered root-------------');

		var bool;
		if(Meteor.loggingIn() && !this.props.references.atLogoutPage){
			
			return <Loading size="large"/>;
		}

		if(!this.props.references.statusBarHeight){
			//console.log(StatusBar);
			//this.props.setStatusBarHeight(StatusBar.currentHeight);
		}

		if(Meteor.userId()){
			bool = true;
		}else{
			bool = false;
		}

		const scenes = Actions.create(
			<Scene key="root">
				{/*navigationBarTitleImageStyle={{width: 40, height: 40}} navigationBarTitleImage={require('../assets/veer.png')}*/}
				<Scene initial={bool} key="tabbar" tabs={true} tabBarStyle={{backgroundColor: 'white'}}>
					<Scene leftButtonIconStyle={{tintColor: 'white'}} key="MainScene">
						<Scene key="Main" component={Main} title="Specials" />
						<Scene key="Map" component={Map}/>
						<Scene key="AdminMain" component={AdminMain}/>
						<Scene key="DealView" component={DealView}/>
						<Scene key="PageView" component={PageView}/>
					</Scene>
				</Scene>
				<Scene initial={!bool} component={BackgroundImage} hideNavBar={true} key="LoggedOut">
					<Scene key="LoogedOutMain" component={Init}/>
					<Scene key="CreateAccount" component={CreateAccount}/>
				</Scene>
			</Scene>
		);

		return(
			<Router scenes={scenes} titleStyle={{color: 'white', fontWeight: 'bold'}} style={{borderTopWidth: 0.5, borderColor: '#999999', backgroundColor: 'white'}} navigationBarStyle={{backgroundColor: '#4cd964', opacity: 0.95, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.4,}} />
		);
	}

}

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
		main: state.main,
	}
}

export default connect(mapStateToProps, actions)(App);



