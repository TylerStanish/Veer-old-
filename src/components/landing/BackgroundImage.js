import React, {Component} from 'react';
import {
	Image, 
	View, 
	Text, 
	StyleSheet, 
	findNodeHandle,
	Platform,
	Dimensions
} from 'react-native';

import {BlurView} from 'react-native-blur';
import {Actions} from 'react-native-router-flux';

class BackgroundImage extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			viewRef: null
		}
	}

	imageLoaded(){
		this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
	}

	render() {

		console.log(this.props.children);
		console.log(Actions);

		var alwaysRenderedHopefully;
		if(this.props.children[this.props.children.length - 2]){
			//alwaysRenderedHopefully = React.createElement(this.props.children[this.props.children.length - 2]);
		}

		return(
			<View style={{flex: 1}}>
				<Image
					ref={(img) => this.backgroundImage = img}
					source={require('../../../assets/city.jpg')}
					style={{position: 'absolute', height: height, width: width}}
					onLoadEnd={this.imageLoaded.bind(this)}
				/>
				<BlurView
					style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
					viewRef={this.state.viewRef}
					blurType="light"
					blurAmount={(Platform.OS == 'android') ? 5 : 5}
					viewRef={this.state.viewRef}
				/>
				{/* This is where we go wrong... */}
				{/*this.props.children.map(scene => React.createElement(scene.component))*/}
				
				{React.createElement(this.props.children[this.props.children.length - 1].component)}
			</View>
		);
	}
}

const {height, width} = Dimensions.get('window');

export default BackgroundImage;



