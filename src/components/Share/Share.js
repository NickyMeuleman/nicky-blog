import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import styled from 'styled-components';
import { TABLET_WIDTH, MOBILE_WIDTH } from 'typography-breakpoint-constants';
import { rhythm } from '../../utils/typography';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  [role='button'] {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: ${rhythm(1 / 2)};
    padding: ${rhythm(1 / 4)};
    border-radius: 3px;
    min-width: 45px;
  }
  svg {
    height: ${rhythm(11 / 10)};
    width: auto;
    margin: 0 auto;
  }
  span {
    display: none;
    margin-left: ${rhythm(1 / 4)};
  }
  @media (min-width: ${TABLET_WIDTH}) {
    [role='button'] {
      margin-left: ${rhythm(1)};
    }
    span {
      display: inline;
    }
  }
  @media (min-width: ${MOBILE_WIDTH}) {
    svg {
      height: ${rhythm(4 / 3)};
    }
  }
`;

const Facebook = styled(FacebookShareButton)`
  color: #3b5998;
  &:hover {
    background: #3b5998;
    color: #fff;
  }
`;

const Twitter = styled(TwitterShareButton)`
  fill: #1da1f2;
  color: #1da1f2;
  &:hover {
    fill: #fff;
    background: #1da1f2;
    color: #fff;
  }
`;

const Reddit = styled(RedditShareButton)`
  fill: #ff4500;
  color: #ff4500;
  &:hover {
    fill: hsla(0, 0%, 0%, 0.9);
    background: #ff4500;
    color: #fff;
  }
`;
const Share = ({ url, title }) => (
  <Container>
    <Facebook url={url} quote={title}>
      {/* Icon from fontawesome, https://fontawesome.com/license */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        viewBox="0 0 264 512"
      >
        <path
          fill="currentColor"
          d="M76.7 512V283H0v-91h76.7v-71.7C76.7 42.4 124.3 0 193.8 0c33.3 0 61.9 2.5 70.2 3.6V85h-48.2c-37.8 0-45.1 18-45.1 44.3V192H256l-11.7 91h-73.6v229"
        />
      </svg>
      <span>Facebook</span>
    </Facebook>
    <Twitter url={url} title={title} via="NMeuleman">
      {/* Icon from https://github.com/konpa/devicon/blob/158fbb74b56f26b37c63c5118d58f6f6d6121e6a/icons/twitter/twitter-original.svg */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        viewBox="0 0 126.24 102.59"
      >
        <path
          d="M40.58,115.3c47.64,0,73.69-39.47,73.69-73.69,0-1.12,0-2.24-.07-3.35a52.7,52.7,0,0,0,12.92-13.41,51.7,51.7,0,0,1-14.87,4.08A26,26,0,0,0,123.63,14.6a51.9,51.9,0,0,1-16.45,6.29A25.92,25.92,0,0,0,63.05,44.51,73.53,73.53,0,0,1,9.67,17.45a25.92,25.92,0,0,0,8,34.58A25.71,25.71,0,0,1,6,48.78c0,.11,0,.22,0,.33A25.91,25.91,0,0,0,26.73,74.5a25.86,25.86,0,0,1-11.7.44,25.93,25.93,0,0,0,24.2,18A52,52,0,0,1,7.06,104a52.72,52.72,0,0,1-6.18-.36,73.32,73.32,0,0,0,39.7,11.63"
          transform="translate(-0.88 -12.7)"
        />
      </svg>
      <span>Twitter</span>
    </Twitter>
    <Reddit url={url} title={title}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        viewBox="-4.771 0.104 53.521 44.858"
      >
        <path
          fill="#fff"
          d="M29.909 35.89c-1.999 1.997-5.218 2.382-7.921 2.382-2.7 0-5.922-.385-7.918-2.382M36.021 4.276L25.899 1.894l-3.93 11.996L25.9 1.894m18.241 3.201a3.99 3.99 0 1 1-7.98 0 3.991 3.991 0 0 1 7.98 0zm.661 23.906c0 8.262-10.263 14.961-22.922 14.961-12.66 0-22.922-6.698-22.922-14.961 0-8.262 10.262-14.961 22.922-14.961 12.659 0 22.922 6.698 22.922 14.961zM-.744 26.676a5.061 5.061 0 0 1-3.027-4.636 5.06 5.06 0 0 1 8.935-3.257m33.568.103a5.061 5.061 0 0 1 9.018 3.154 5.064 5.064 0 0 1-3.23 4.72"
        />
        <path d="M21.879 44.963c-13.191 0-23.922-7.16-23.922-15.961 0-.608.051-1.21.151-1.801a6.066 6.066 0 0 1-2.879-5.161 6.068 6.068 0 0 1 6.06-6.061c1.493 0 2.916.546 4.017 1.522 4.149-2.663 9.73-4.339 15.887-4.455L25.235.71l.882.208.021.005 9.421 2.218A5 5 0 0 1 40.151.105a4.996 4.996 0 0 1 4.99 4.991 4.996 4.996 0 0 1-4.99 4.99 4.995 4.995 0 0 1-4.99-4.984l-8.596-2.024-3.273 9.99c5.933.231 11.291 1.912 15.291 4.517a6.028 6.028 0 0 1 4.108-1.605 6.068 6.068 0 0 1 6.061 6.061 6.019 6.019 0 0 1-3.08 5.28c.087.553.132 1.113.132 1.681-.002 8.801-10.734 15.961-23.925 15.961zM.157 27.11a9.05 9.05 0 0 0-.2 1.892c0 7.699 9.834 13.961 21.922 13.961 12.088 0 21.922-6.263 21.922-13.961 0-.612-.062-1.215-.183-1.807a1.003 1.003 0 0 1-.099-.435c-.669-2.627-2.494-5.012-5.13-6.934a.992.992 0 0 1-.429-.304c-4.007-2.755-9.732-4.482-16.081-4.482-6.285 0-11.961 1.693-15.962 4.401a1.022 1.022 0 0 1-.401.279C2.823 21.643.951 24.044.256 26.694a.992.992 0 0 1-.084.384c-.005.011-.009.022-.015.032zm40.097-8.319c2.319 1.855 4.021 4.064 4.891 6.488a4.033 4.033 0 0 0 1.605-3.239 4.065 4.065 0 0 0-4.061-4.061 4.04 4.04 0 0 0-2.435.812zm-38.965-.812a4.065 4.065 0 0 0-4.06 4.061c0 1.213.54 2.34 1.436 3.1.899-2.405 2.618-4.596 4.946-6.433a4.066 4.066 0 0 0-2.322-.728zM40.15 2.104c-1.648 0-2.99 1.342-2.99 2.991s1.342 2.99 2.99 2.99 2.99-1.341 2.99-2.99-1.341-2.991-2.99-2.991zM21.988 39.271c-4.005 0-6.827-.875-8.626-2.675a1 1 0 0 1 1.415-1.414c1.405 1.405 3.763 2.089 7.211 2.089 3.447 0 5.807-.684 7.214-2.089a.999.999 0 1 1 1.413 1.414c-1.801 1.8-4.622 2.675-8.627 2.675z" />
        <path
          fill="#FF4500"
          d="M30.097 22.35c-2.038 0-3.749 1.707-3.749 3.745 0 2.037 1.711 3.688 3.749 3.688s3.688-1.651 3.688-3.688c0-2.038-1.651-3.745-3.688-3.745zm-16.158 0c-2.036 0-3.745 1.709-3.745 3.745s1.708 3.688 3.745 3.688 3.688-1.652 3.688-3.688-1.652-3.745-3.688-3.745z"
        />
      </svg>
      <span>Reddit</span>
    </Reddit>
  </Container>
);

export default Share;
