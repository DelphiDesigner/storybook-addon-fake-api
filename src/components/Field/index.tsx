import React from 'react';
import PropTypes from 'prop-types';
import { FieldContainer, Label, FieldItem } from './styled';

interface Props {
    label: string;
    children: PropTypes.ReactNodeLike;
}
export const Field = (props: Props) => (
    <FieldContainer>
        <Label>{props.label}</Label>
        <FieldItem> {props.children} </FieldItem>
    </FieldContainer>
);

Field.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
};

Field.defaultProps = {
    label: '',
    children: null,
};
