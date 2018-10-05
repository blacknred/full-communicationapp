import React from 'react';
import PropTypes from 'prop-types';

import NewMessageForm from '../components/NewMessageForm';

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
        const { submit } = this.props;
        if (!text || !text.trim()) return;
        try {
            await submit(text);
            this.setState({ text: '' });
        } catch (err) {
            // return null;
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
    submit: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default NewChannelMessage;
