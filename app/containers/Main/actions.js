import {
  FETCH_VIDEO,
} from './constants';

export function fetchVideo(payload) {
  return {
    type: FETCH_VIDEO,
    payload,
  };
}
