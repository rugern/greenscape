/*
 *
 * Main reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_VIDEO,
  REMOVE_VIDEO,
} from './constants';


const initialState = fromJS({
  videos: {},
});

function mainReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIDEO:
      return state.setIn(['videos', action.payload.title], action.payload);
    case REMOVE_VIDEO:
      return state.deleteIn(['videos', action.payload.title]);
    default:
      return state;
  }
}

export default mainReducer;
