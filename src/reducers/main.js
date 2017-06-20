const initialState = {
	threshold: 40,
	userTab: 'User',
	userType: 'Deals',
	adminType: 'Deals',
};

export default (state = initialState, action) => {
	switch(action.type){
		case 'setTestThreshold': 
			return {
				...state,
				threshold: action.payload
			};
		case 'whichTab':
			return{
				...state,
				userTab: action.payload,
			}
		case 'setUserType':
			return{
				...state,
				userType: action.payload
			}
		case 'setAdminType':
			return{
				...state,
				adminType: action.payload
			}
		default:
			return state;
	}
};