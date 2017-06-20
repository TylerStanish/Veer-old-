import React, {Component} from 'react';
import {
	View, 
	Text, 
	StyleSheet, 
	Modal, 
	Dimensions, 
	TouchableOpacity, 
	TextInput,
	Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Meteor from 'react-native-meteor';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from '../misc/Button';
import ReviewsList from '../common/lists/ReviewsList';
import ModalHeader from '../misc/ModalHeader';
import Loading from '../misc/Loading';

class Reviews extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			loading: false,
		}
	}

	close(){
		this.setState({visible: false});
	}

	dropNote(){
		this.setState({loading: true});
		if(!this.state.note){
			Alert.alert('Missing message');
			return;
		}
		data = {
			pageID: this.props.org._id,
			message: this.state.note.trim()
		}
		Meteor.call('message.makeMessage', data, (error, data) => {
			if(error){
				console.log(error);
				this.setState({loading: false});
				Alert.alert(error.reason);
			}else{
				this.setState({visible: false, loading: false});
			}
		});
	}

	render() {
		
		if(!this.props.org || !this.props.reviews){
			return <Loading/>
		}
		
		return(
			<View style={{flex: 1, alignItems: 'center'}}>
				<Button width={width-10} text="Drop a note" onPress={() => this.setState({visible: true})}/>
				<ReviewsList reviews={this.props.reviews}/>
				<Modal visible={this.state.visible} animationType="slide">
					<ModalHeader close={this.close.bind(this)}/>
					<KeyboardAwareScrollView contentContainerStyle={{flex: 1, alignItems: 'center'}} style={{marginTop: 10, marginBottom: 10}}>
						<Text style={styles.text}>Send a message to {this.props.org.pageName}. After reviewing it, {this.props.org.pageName} may choose to post it to their page under reviews. It is not anonymous.</Text>
						<TextInput
							placeholderTextColor="#aaa"
							multiline={true}
							style={styles.input}
							ref="note"
							returnKeyType={"go"}
							onChangeText={(note) => this.setState({note})}
							autoCorrect={false}
							placeholder="Review"
							onSubmitEditing={() => this.dropNote()}
						/>
						<Button loading={this.state.loading} text="Submit" onPress={() => this.dropNote()} />
					</KeyboardAwareScrollView>
				</Modal>
			</View>
		);
	}
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		marginVertical: 8
	},
	input: {
		//flex: 1,
		fontSize: 20,
		width: width-10,
		height: height/2,
		marginHorizontal: 5,
		padding: 10,
		marginBottom: 10,
		backgroundColor: 'white',
		borderColor: 'gray',
		borderWidth: 1,
	},
});

export default Reviews;


