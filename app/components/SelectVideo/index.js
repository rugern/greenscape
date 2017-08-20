/**
*
* SelectVideo
*
*/

import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Container = styled.div`
`;

const TextField = styled.input`
`;

class SelectVideo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
    };
  }

  onChange(evt) {
    this.setState({
      url: evt.target.value,
    });
  }

  render() {
    return (
      <Container>
        <TextField
          type='text' value={this.state.url} onChange={this.onChange.bind(this)}
        />
        <button onClick={() => this.props.buttonHandler(this.state.url)}>Fetch</button>
      </Container>
    );
  }
}

SelectVideo.propTypes = {
  buttonHandler: PropTypes.func.isRequired,
};

export default SelectVideo;
