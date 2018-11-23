import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { graphql } from 'react-apollo';

import { CREATE_FILE_MESSAGE_MUTATION } from '../graphql/message';

const style = {
    height: '100%',
    minHeight: 0,
};

const FileUpload = ({
    children, disableClick, channelId, mutate,
}) => (
    <Dropzone
        style={style}
        className="ignore"
        onDrop={async ([file]) => {
            // const response = await mutate({
            //     variables: {
            //         channelId,
            //         file,
            //     },
            // });
            console.log(file);
        }}
        disableClick={disableClick}
    >
        {children}
    </Dropzone>
);

FileUpload.propTypes = {
    children: PropTypes.element.isRequired,
    disableClick: PropTypes.bool,
    channelId: PropTypes.number.isRequired,
    mutate: PropTypes.func.isRequired,
};

export default graphql(CREATE_FILE_MESSAGE_MUTATION)(FileUpload);
