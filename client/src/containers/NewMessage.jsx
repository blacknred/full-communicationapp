import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import NewMessageForm from '../components/NewMessageForm';
import NewMessageFullForm from '../components/NewMessageFullForm';

class NewChannelMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isFullOptionsOpen: false,
            isFullFormOpen: false,
            isFileUploadFormOpen: false,
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
        const { submit } = this.props;
        if (!text || !text.trim()) return;
        try {
            await submit(text);
            this.setState({ text: '', isFullFormOpen: false });
        } catch (err) {
            // return null;
        }
    }

    render() {
        const { placeholder } = this.props;
        return (
            <React.Fragment>
                <NewMessageForm
                    {...this.state}
                    placeholder={placeholder}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}
                    onToggle={this.onToggleHandler}
                />
                <NewMessageFullForm
                    {...this.state}
                    placeholder={placeholder}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}
                    onClose={this.onToggleHandler}
                />
                <Dropzone>
                    +
                </Dropzone>
            </React.Fragment>

        );
    }
}

NewChannelMessage.propTypes = {
    submit: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default NewChannelMessage;
