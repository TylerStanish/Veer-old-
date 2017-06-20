import React, {Component} from 'react';
import {View, StyleSheet, Text, Modal} from 'react-native';

import moment from 'moment';
import {connect} from 'react-redux';

import DealCard from '../DealCard';
import Loading from '../../misc/Loading';
import TabBar from '../../misc/TabBar';
import ModalHeader from '../../misc/ModalHeader';

class DealsList extends Component{
	
	constructor(props) {
		super(props);
		this.state = {
			tab: 'Today',
			visible: false
		}
	}

	renderList(){

		/* 
		
		var arr = this.props.deals.sort(function(b,a) {
			return parseFloat(a.upvotes.length) - parseFloat(b.upvotes.length);
		}); 
		
		*/

		if(!this.props.deals.length && !this.props.fromBook && !this.props.admin){
			return(
				<View>
					<Text style={styles.text}>There are currently no specials near your saved location</Text>
					<Text onPress={() => this.setState({visible: true})} style={[styles.text, {padding: 15, color: this.props.references.color, fontStyle: 'italic'}]}>What constitues my 'saved location?'</Text>
				</View>
			);
		}

		var arr = [];
		if(this.props.admin){
			arr = this.props.deals;
		}else{
			if(!this.props.fromBook){
				if(this.state.tab == 'Today'){
					var d = new Date();
					var today = moment(d).format("ll");
					this.props.deals.map(deal => {
						if(deal.date == today){
							arr.push(deal);
						}
					});
				}
				if(this.state.tab == 'Tomorrow'){
					var d = new Date();
					var tomorrow = moment(d).add(1,"day").format("ll");
					this.props.deals.map(deal => {
						if(deal.date == tomorrow){
							arr.push(deal);
						}
					});
				}
			}else{
				arr = this.props.deals;
			}
		}
		
		return arr.map(deal => {
			console.log(deal); // remove this
			return(
				<View key={deal._id}>
					<DealCard profile={this.props.profile} removingDeals={this.props.removingDeals} fromBook={this.props.fromBook || (this.props.profile.book.indexOf(deal._id) > -1)} deal={deal} orgNameForBack={this.props.orgNameForBack}/>
				</View>
			);
		});
	}

	changeTab(t){
		this.setState({tab: t});
	}

	render() {
		
		if(!this.props.deals){
			return <Loading/>
		}

		var tabs;
		if(!this.props.fromBook && !this.props.admin){
			tabs = <TabBar changeTab={this.changeTab.bind(this)} isText={true} icons={['Today', 'Tomorrow']} />
		}

		return(
			<View style={{alignItems: 'center'}}>
				{tabs}
				{this.renderList()}
				<Modal visible={this.state.visible} animationType="slide">
					<ModalHeader close={() => this.setState({visible: false})}/>
					<View>
						<Text style={styles.title}>Last Saved Location Help</Text>
						<Text style={styles.explanation}>Your last saved location is the last location that you were on your map. In order to change your viewing location, go to the map and either search for the location you wish to view or cursor manually to the location you wish to view. If location services are enabled, you can automatically snap to your current location by tappping the blue button at the bottom.</Text>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		margin: 10
	},
	explanation: {
		textAlign: 'center',
		fontSize: 18,
		margin: 5
	},
	title: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 22,
		margin: 10
	}
});

const mapStateToProps = (state, ownProps) => {
	return{
		references: state.references,
	}
}

export default connect(mapStateToProps)(DealsList);


