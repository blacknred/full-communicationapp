import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import NewMessageForm from '../components/NewMessageForm';

import { CREATE_CHANNEL_MESSAGE_MUTATION } from '../graphql/message';

class NewChannelMessage extends React.Component {
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
        const { text } = this.state;
        const { mutate, channelId } = this.props;
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
    }

    render() {
        const { text } = this.state;
        const { placeholder } = this.props;
        return (
            <NewMessageForm
                placeholder={placeholder}
                message={text}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

NewChannelMessage.propTypes = {
    mutate: PropTypes.func.isRequired,
    channelId: PropTypes.number.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default graphql(CREATE_CHANNEL_MESSAGE_MUTATION)(NewChannelMessage);
