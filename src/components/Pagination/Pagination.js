import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import PaginationLink from './PaginationLink';
import { rhythm } from '../../utils/typography';

const LinkU = styled(Link)`
  border-bottom: none;
  box-shadow: none;
  height: 100%;
  width: auto;
  margin: 1rem;
  &:hover {
    background: inherit;
  }
`;

const Pagination = styled.div`
  grid-column: 2/-2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${rhythm(1)};
`;
const PaginationNumber = styled.span`
  padding: ${rhythm(1 / 2)};
  border-radius: 5px;
  color: ${props => (props.current ? '#333' : null)};
  border: 2px solid ${props => props.theme.primaryLighter};
  background: ${props => (props.current ? props.theme.primaryLighter : '#f5f5f5')};
`;

export default ({ paginationObj }) => {
  const { numPages, pageIndex, isFirst, isLast } = paginationObj;
  const prevPageNum = pageIndex - 1 === 1 ? '' : pageIndex - 1;
  const nextPageNum = pageIndex + 1;
  const prevPageLink = isFirst ? null : `/blog/${prevPageNum}`;
  const nextPageLink = isLast ? null : `/blog/${nextPageNum}`;
  return (
    <Pagination>
      <PaginationLink to={prevPageLink}>Previous Page</PaginationLink>
      {Array.from({ length: numPages }, (_, i) => (
        <LinkU to={`blog/${i === 0 ? '' : i + 1}`} key={`pagination-number${i + 1}`}>
          <PaginationNumber current={i + 1 === pageIndex}>{i + 1}</PaginationNumber>
        </LinkU>
      ))}
      <PaginationLink to={nextPageLink}>Next Page</PaginationLink>
    </Pagination>
  );
};
