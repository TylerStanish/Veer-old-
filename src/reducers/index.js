import {combineReducers} from 'redux';
import main from './main';
import references from './References';

export default combineReducers({
	main: main,
	references: references
});