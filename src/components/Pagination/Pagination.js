import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { MOBILE_WIDTH } from 'typography-breakpoint-constants';
import PaginationLink from './PaginationLink';
import { rhythm } from '../../utils/typography';

const Pagination = styled.div`
  grid-column: 2/-2;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${rhythm(2)};
  flex-direction: column;
  @media (min-width: ${MOBILE_WIDTH}) {
    flex-direction: row;
  }
`;

const Links = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
  justify-content: space-between;
  margin-bottom: ${rhythm(1 / 2)};
  @media (min-width: ${MOBILE_WIDTH}) {
    width: 15rem;
  }
`;

const PaginationLinkS = styled(PaginationLink)`
  border-bottom: none;
  box-shadow: none;
  height: 100%;
  width: auto;
  &:hover {
    background: inherit;
  }
  color: ${props => props.theme.primary};
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const PaginationPicker = styled.select`
  appearance: none;
  border: none;
  padding: 0.5ch 2ch 0.5ch 0.5ch;
  color: ${props => props.theme.primary};
  font-weight: bold;
`;

const Arrow = styled.svg`
  position: relative;
  right: 1.5ch;
  fill: ${props => props.theme.primary};
  pointer-events: none;
`;

class PaginationClass extends React.Component {
  changePage = e => {
    navigate(`/blog/${e.target.value}`);
  };

  render() {
    const { numPages, currentPage } = this.props.context;
    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPageNum =
      currentPage - 1 === 1 ? `` : (currentPage - 1).toString();
    const nextPageNum = (currentPage + 1).toString();
    const prevPageLink = isFirst ? null : `/blog/${prevPageNum}`;
    const nextPageLink = isLast ? null : `/blog/${nextPageNum}`;
    return (
      <Pagination>
        <Links>
          <PaginationLinkS to={prevPageLink}>← Newer posts</PaginationLinkS>
          <PaginationLinkS to={nextPageLink}>Older posts →</PaginationLinkS>
        </Links>
        <Info>
          <span>Showing page &nbsp;</span>
          <PaginationPicker
            onChange={this.changePage}
            value={currentPage === 1 ? '' : currentPage.toString()}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <option
                value={`${i === 0 ? '' : i + 1}`}
                key={`pagination-number${i + 1}`}
              >
                {i + 1}
              </option>
            ))}
          </PaginationPicker>
          <Arrow width="10" height="5" viewBox="0 0 10 5">
            <path d="M0 0l5 4.998L10 0z" fillRule="evenodd" />
          </Arrow>
          <span>of &nbsp;</span>
          <span style={{ fontWeight: 'bold' }}>{numPages}</span>
        </Info>
      </Pagination>
    );
  }
}

export default PaginationClass;
