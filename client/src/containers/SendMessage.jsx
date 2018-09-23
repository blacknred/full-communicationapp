import React from 'react';
import PropTypes from 'prop-types';

import NewMessageForm from '../components/NewMessageForm';

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
        const { onSubmit } = this.props;
        const { text } = this.state;
        if (!text || !text.trim()) return;
        try {
            await onSubmit(text);
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

SendMessage.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default SendMessage;
