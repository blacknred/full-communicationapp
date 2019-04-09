import DataLoader from 'dataloader';

import models from './models';
import loaders from './loaders';

/* data loaders */

const regularLoaders = {
    file: new DataLoader(ids => loaders.file(ids, models)),
    sender: new DataLoader(ids => loaders.sender(ids, models)),
    admin: new DataLoader(ids => loaders.admin(ids, models)),
    member: new DataLoader(ids => loaders.member(ids, models)),
    membersCount: new DataLoader(ids => loaders.membersCount(ids, models)),
    participant: new DataLoader(ids => loaders.participant(ids, models)),
    channelFilesCount: new DataLoader(ids => loaders.channelFilesCount(ids, models)),
    channelMessagesCount: new DataLoader(ids => loaders.channelMessagesCount(ids, models)),
    participantsCount: new DataLoader(ids => loaders.participantsCount(ids, models)),
};

const subscriptionLoaders = {
    sender: new DataLoader(ids => loaders.sender(ids, models)),
    file: new DataLoader(ids => loaders.file(ids, models)),
};

const getRegularLoaders = req => ({
    ...regularLoaders,
    channel: new DataLoader(ids => loaders.channel(ids, models, req.user)),
    teamUpdatesCount: new DataLoader(ids => loaders.teamUpdatesCount(ids, models, req.user)),
    channelUpdatesCount: new DataLoader(ids => loaders.channelUpdatesCount(ids, models, req.user)),
});

export {
    getRegularLoaders,
    subscriptionLoaders,
};
