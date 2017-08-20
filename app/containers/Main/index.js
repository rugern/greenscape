/*
 *
 * Main
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectMain from './selectors';
import styled from 'styled-components';
import VideoContext from 'videocontext';

import {
  selectVideos,
} from './selectors';
import {
  fetchVideo,
} from './actions';
import shia from '../../assets/shia.mp4';
import cats from '../../assets/cats.mp4';
import SelectVideo from '../../components/SelectVideo';

const Column = styled.div`
display: flex;
flex-direction: column;
width: auto;
align-items: flex-start;
`;

function createNode(ctx, src, options) {
  options = Object.assign({
    offset: 0,
    greenscreen: false,
    show: true,
    title: ':/',
    volume: 0,
  }, options);

  const node = ctx.video(src, options.offset, 4, { volume: options.volume, loop: true });
  node.start(0);
  return {
    node,
    ...options,
  };
}

export class Main extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      ctx: null,
      greenscreen: null,
      videos: [],
    };
  }

  componentDidMount() {
    const ctx = new VideoContext(this.canvas);
    const greenscreen = ctx.effect(VideoContext.DEFINITIONS.COLORTHRESHOLD);
    const videos = [];

    videos.push(createNode(ctx, cats, { title: 'cats', offset: 100 }));
    videos.push(createNode(ctx, shia, { title: 'shia', greenscreen: false, volume: 1 }));

    this.setState({
      ctx,
      greenscreen,
      videos,
    });

    this.connectNodes(videos, ctx, greenscreen);
  }

  play() {
    if (this.state.ctx) {
      this.state.ctx.play();
    }
  }

  pause() {
    if (this.state.ctx) {
      this.state.ctx.pause();
    }
  }

  connectNodes(videos, ctx = this.state.ctx, greenscreen = this.state.greenscreen) {
    greenscreen.disconnect();
    videos.forEach((video) => {
      video.node.disconnect();

      if (!video.show) {
        return;
      } else if (video.greenscreen) {
        video.node.connect(greenscreen);
      } else {
        video.node.connect(ctx.destination);
      }
    });

    greenscreen.connect(ctx.destination);
  }

  toggleGreenscreen(video) {
    video.greenscreen = !video.greenscreen;
    this.connectNodes(this.state.videos);
    this.forceUpdate();
  }

  toggleShow(video) {
    video.show = !video.show;
    this.connectNodes(this.state.videos);
    this.forceUpdate();
  }

  render() {
    const list = this.state.videos.map((video, index) => 
      <div key={index}>
        <h5>{video.title}</h5>
        <input id='show' type="checkbox" checked={video.show} onChange={this.toggleShow.bind(this, video)} />
        <label htmlFor='show'>Show</label>
        <input id='greenscreen' type="checkbox" checked={video.greenscreen} onChange={this.toggleGreenscreen.bind(this, video)} />
        <label htmlFor='greenscreen'>Greenscreen</label>
      </div>
    );

    return (
      <Column>
        <div>
          {list}
        </div>

        <canvas width="1100px" height="600px" ref={(canvas) => this.canvas = canvas}></canvas>

        <div>
          <button onClick={this.play.bind(this)}>Play</button>
          <button onClick={this.pause.bind(this)}>Pause</button>
        </div>
      </Column>
    );
  }
}

Main.propTypes = {
  fetchVideo: PropTypes.func.isRequired,
  videos: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  Main: makeSelectMain(),
  videos: selectVideos(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchVideo: (payload) => dispatch(fetchVideo(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
