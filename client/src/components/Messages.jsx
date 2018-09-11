import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
});

const Messages = ({ classes }) => (
    <main className={classes.content}>
        <div className={classes.toolbar} />
        <p>Lorem, ipsum.</p>
        <p>Reiciendis, voluptatibus.</p>
        <p>Eum, doloremque!</p>
        <p>Ad, cupiditate.</p>
        <p>Quae, eligendi.</p>
        <p>Omnis, quae.</p>
        <p>Dolores, ipsam.</p>
        <p>Beatae, quae.</p>
        <p>Sint, culpa!</p>
        <p>A, deleniti.</p>
        <p>Pariatur, totam!</p>
        <p>Nemo, et.</p>
        <p>Rerum, esse.</p>
        <p>Tenetur, excepturi.</p>
        <p>Porro, enim?</p>
        <p>Repellendus, voluptatum.</p>
        <p>Soluta, nostrum.</p>
        <p>Eos, beatae!</p>
        <p>Natus, quis.</p>
        <p>Voluptate, architecto.</p>
        <p>Vitae, cumque?</p>
        <p>Laborum, assumenda!</p>
        <p>Earum, eos.</p>
        <p>Sequi, pariatur.</p>
        <p>Architecto, magnam.</p>
        <p>Excepturi, aspernatur.</p>
        <p>Earum, voluptatem.</p>
        <p>Eaque, ullam.</p>
        <p>Voluptatem, magni.</p>
        <p>Ab, perferendis.</p>
        <p>Aperiam, vel!</p>
        <p>Dolore, cumque.</p>
        <p>Aspernatur, inventore.</p>
        <p>Ipsam, veritatis.</p>
        <p>Tempora, amet.</p>
        <p>Exercitationem, quod?</p>
        <p>Animi, exercitationem.</p>
        <p>Quis, sunt!</p>
        <p>Eos, quaerat.</p>
        <p>Enim, doloribus.</p>
        <p>Recusandae, illum!</p>
        <p>Exercitationem, maxime!</p>
        <p>Qui, ab?</p>
        <p>Rerum, animi.</p>
        <p>Quos, sapiente!</p>
        <p>Nihil, accusantium.</p>
        <p>Explicabo, illo.</p>
        <p>Porro, beatae?</p>
        <p>Quidem, numquam.</p>
        <p>Ipsum, natus!</p>
    </main>
);

Messages.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(Messages);
