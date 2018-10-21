import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import NewMessageForm from '../components/NewMessageForm';
import NewMessageFullForm from '../components/NewMessageFullForm';

import { CREATE_MESSAGE_MUTATION } from '../graphql/message';


class NewChannelMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isFullOptionsOpen: false,
            isFullFormOpen: false,
        };
    }

    onToggleHandler = (target) => {
        this.setState(prevState => ({
            [target]: !prevState[target],
        }));
    }

    onChangeHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { text } = this.state;
        const { channelId, mutate } = this.props;
        if (!text || !text.trim()) return;
        try {
            await mutate({
                variables: {
                    channelId,
                    text,
                },
            });
            this.setState({
                text: '',
                isFullFormOpen: false,
            });
        } catch (err) {
            // TODO:
        }
    }

    render() {
        const { mutate, ...otherProps } = this.props;
        return (
            <React.Fragment>
                <NewMessageForm
                    {...this.state}
                    {...otherProps}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}
                    onToggle={this.onToggleHandler}
                />
                <NewMessageFullForm
                    {...this.state}
                    {...otherProps}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}
                    onClose={this.onToggleHandler}
                />
            </React.Fragment>
        );
    }
}

NewChannelMessage.propTypes = {
    channelId: PropTypes.number.isRequired,
    mutate: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default graphql(CREATE_MESSAGE_MUTATION)(NewChannelMessage);
