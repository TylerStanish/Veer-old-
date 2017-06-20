import {Actions} from 'react-native-router-flux';

// For the main.js reducer
export const whichTab = (t) => {
	return{
		type: 'whichTab',
		payload: t
	}
}

export const setUserType = (t) => {
	
	if(t == 'Deals'){
		Actions.refresh({title: 'Specials'});
	}
	if(t == 'Pages'){
		Actions.refresh({title: 'Businesses'});
	}else{
		Actions.refresh({title: t});
	}

	return{
		type: 'setUserType',
		payload: t
	}
}

// For the References.js reducer
export const setGlobalMarginTop = (g) => {
	return{
		type: 'setGlobalMarginTop',
		payload: g
	}
};

export const setGlobalMarginBottom = (b) => {
	return{
		type: 'setGlobalMarginBottom',
		payload: b
	}
};

export const setStatusBarHeight = (h) => {
	return{
		type: 'setStatusBarHeight',
		payload: h,
	}
}

export const setAdminType = (t) => {
	return{
		type: 'setAdminType',
		payload: t
	}
}

export const setAtLogoutPage = (b) => {
	return{
		type: 'setAtLogoutPage',
		payload: b,
	}
}
