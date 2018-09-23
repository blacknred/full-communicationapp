import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import NewMessageForm from '../components/NewMessageForm';

import { CREATE_MESSAGE_MUTATION } from '../graphql/message';

class SendMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }

    onChangeHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { channelId, mutate } = this.props;
        const { text } = this.state;
        if (!text || !text.trim()) return;
        try {
            await mutate({
                variables: {
                    channelId,
                    text,
                },
            });
            this.setState({ text: '' });
        } catch (err) {
            // return;
        }
        // const { ok, errors } = res.data.createMessage;
        // if (ok) {
        //     this.setState({ text: '' });
        // } else {
        //     const err = {};
        //     errors.forEach((e) => {
        //         err[`${e.path}Error`] = e.message;
        //     });
        //     // this.setState({ errors: err });
        // }
    }

    render() {
        const { text } = this.state;
        const { channelName } = this.props;
        return (
            <NewMessageForm
                channelName={channelName}
                message={text}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

SendMessage.propTypes = {
    channelId: PropTypes.number.isRequired,
    channelName: PropTypes.string.isRequired,
};

export default graphql(CREATE_MESSAGE_MUTATION)(SendMessage);
