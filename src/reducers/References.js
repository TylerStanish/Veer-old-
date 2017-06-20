const initialState = {
	color: '#4cd964',
	globalMarginTop: 0,
	globalMarginBottom: 0,
	atLogoutPage: false,

	backStyle: {
		color: 'white',
		backgroundColor: 'transparent',
		fontWeight: 'bold'
	}
};

export default (state = initialState, action) => {
	switch(action.type){
		case 'setGlobalMarginTop': 
			return{
				...state,
				globalMarginTop: action.payload,
			};
		case 'setAtLogoutPage':
			return{
				...state,
				atLogoutPage: action.payload,
			}
		default:
			return state;
	}
};