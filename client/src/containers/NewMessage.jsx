import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { observer, inject } from 'mobx-react';

import audioFile from '../assets/file-sounds-967-what.wav';

import NewMessageForm from '../components/NewMessageForm';
import NewMessageFullForm from '../components/NewMessageFullForm';

import { CREATE_MESSAGE_MUTATION } from '../graphql/message';

const AUDIO_URL = 'https://notificationsounds.com/soundfiles/577bcc914f9e55d5e4e4f82f9f00e7d4/file-sounds-967-what.wav';

class NewChannelMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isFullOptionsOpen: false,
            isFullFormOpen: false,
        };
        this.audio = new Audio(audioFile);
    }

    onToggleHandler = (target) => {
        this.setState(prevState => ({
            [target]: !prevState[target],
        }));
    }

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { text } = this.state;
        const {
            channelId, mutate, store: { createNotification, isSoundsOn },
        } = this.props;
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
            if (isSoundsOn) {
                // this.audio.crossOrigin = 'anonymous';
                // this.audio.type = 'audio/mp3';
                // this.audio.src = sound;
                this.audio.play();
                // const playPromise = this.audio.play();
                // if (playPromise === undefined) return;
                // playPromise.then(() => {
                //     console.log('yay!');
                // }).catch((err) => {
                //     console.log('Error: ' + err);
                // });
            }
        } catch (err) {
            createNotification(err.message);
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

export default graphql(CREATE_MESSAGE_MUTATION)(
    inject('store')(observer(NewChannelMessage)),
);
