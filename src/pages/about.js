import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout/Layout';
import { rhythm } from '../utils/typography';
import syncSVG from '../assets/in_sync.svg';
import codingSVG from '../assets/coding_headphones.svg';

const Container = styled.div`
  flex: 1 0 auto;
  display: grid;
  justify-content: center;
  grid-template-columns: minmax(5vw, 1fr) fit-content(60rem) minmax(5vw, 1fr);
  grid-template-rows: 15vh 1fr minmax(${rhythm(1)}, 1fr);
`;

const Triangle = styled.div`
  grid-column: 1/-1;
  grid-row: 1/-1;
  background: ${props => `linear-gradient(120deg, ${props.theme.primary} 5%, ${props.theme.secondary})`};
  clip-path: polygon(0 0, 0% 50vh, 70vw 0);
  z-index: 2;
  position: relative;
  h1 {
    margin: 0;
    position: absolute;
    top: 5vh;
    left: 5vw;
    color: #f5f5f5;
  }
`;

const Content = styled.div`
  grid-column: 2/-2;
  grid-row: 2/-2;
  align-self: start;
  z-index: 3;
  box-shadow: 0px 3px 25px #333;
  background-color: #fff;
  border-radius: 5px;
  padding: ${rhythm(1)};
  img {
    margin: 0;
    height: 30vh;
  }
  img[alt='responsive'] {
    float: right;
    margin-top: -20vh;
    shape-outside: polygon(-2.16% -31.67%, 103.01% -41.97%, 103.99% 49.05%, 93.43% 94.58%, 4.22% 98.57%, 2.28% 28.55%);
  }
  img[alt='coding'] {
    float: left;
    shape-outside: polygon(
      60.99% 2.23%,
      107.38% 16.49%,
      90.99% 27.5%,
      103.99% 49.05%,
      82.81% 54.5%,
      110.24% 73.86%,
      102.23% 104.22%,
      -4.28% 102.94%,
      -1.32% 20.22%,
      32.71% -3.69%
    );
  }
`;

const AboutPage = () => (
  <Layout>
    <Container>
      <Triangle>
        <h1>Hi</h1>
      </Triangle>
      <Content>
        <img src={syncSVG} alt="responsive" />
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati dicta mollitia dolores deleniti officiis
        autem laboriosam sequi delectus laborum, nesciunt ab adipisci, illo aliquam, fuga debitis. Sunt quod aliquam
        adipisci voluptatem libero vitae, modi optio. Aut ipsam beatae voluptatem suscipit assumenda ratione dolor.
        <img src={codingSVG} alt="coding" />
        Rerum odit fuga doloribus sit, corporis exercitationem commodi ullam totam cupiditate pariatur facere eos porro
        debitis alias ad voluptate! Assumenda vero maiores quasi sint ducimus nobis a qui eum non possimus, molestiae
        eaque temporibus ipsam beatae! Magnam vero repudiandae repellat, ullam nesciunt quod ad exercitationem explicabo
        ipsum voluptate dolorum maxime labore similique amet debitis eum obcaecati officia fuga ea, architecto, expedita
        animi esse. Possimus, soluta velit! Rem pariatur nobis doloremque, odit alias repellat! Id debitis at
        architecto!
      </Content>
    </Container>
  </Layout>
);

export default AboutPage;
