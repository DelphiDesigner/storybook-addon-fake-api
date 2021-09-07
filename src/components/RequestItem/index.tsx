import React from 'react';
import PropTypes from 'prop-types';
import JSONInput from 'react-json-editor-ajrm';
import enLocale from './js'
import { Checkbox, Row, Container, Select } from './styled';
import { Field } from '../Field';
import statusTextMap from '../../utils/statusMap';

const statusCodes = Array.from(statusTextMap.keys());

interface  Props {
        url: string,
        skip: boolean,
        method: string,
        status: number,
        response: any,
        onToggle: any,
        onStatusChange: any,
        onResponseChange: any,
}

export const RequestItem = (props: Props) => {
    return (
        <Container>
            <Row>
                <Field label="URL"> {props.url} </Field>
                <Field label="Enable mock">
                    <Checkbox
                        type="checkbox"
                        checked={!props.skip}
                        onChange={props.onToggle}
                    />
                </Field>
            </Row>
            <Row>
                <Field label="Method"> {props.method} </Field>
                <Field label="Status">

                <Select onChange={props.onStatusChange} value={props.status.toString()}>
                        {statusCodes.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
                    </Select>
                </Field>
            </Row>

            <Field label="Response">
                <JSONInput
                    locale={enLocale}
                    onBlur={props.onResponseChange}
                    placeholder={props.response}
                    colors={{
                        default: 'black',
                        background: 'white',
                        string: 'black',
                        number: 'black',
                        colon: 'black',
                        keys: 'black'
                    }}
                    style={{
                        warningBox: {
                            background: 'white',
                        },
                        body: {
                            fontFamily: 'inherit',
                            fontSize: '12px',
                        },
                    }}
                    waitAfterKeyPress={1000}
                    height="120px"
                />
            </Field>
        </Container>
    );
};

RequestItem.propTypes = {
    url: PropTypes.string,
    skip: PropTypes.bool,
    method: PropTypes.string,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    response: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onToggle: PropTypes.func,
    onStatusChange: PropTypes.func,
    onResponseChange: PropTypes.func,
};
