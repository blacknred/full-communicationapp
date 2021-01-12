# Swoy/Huber docs

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://blacknred.github.io/)

IM and voice cloud platform to communicate and work together.

Why?

- Twitter is a messy and only public.
- Slack is only corporate email with integrations aesthetically but the ability use one workspace as an app and do not be distracted by other notifications is a cool.
- Discord is very good but we need more timeline feeds since the multiple space switching between is tiresome, despites Discord dont use feeds and feed algos ideologically. Also we need more lightweight ui & ux i think.
- Youtube text content/discussions is not represented as well as video

- channel based twitter with private subscriptions
  - good for influencers, not so good for streamers
  - same algo feed based schema for insta, tiktok
- media chat with spaces for friends and coworkers
  - influencers are only channels & communities, good for streamers
  - for example, discord is a chat, not a feed, it’s also free of the algorithms that creators so often bemoan. If influencers want to announce that they have a new video out, or promote a merch sale, they can post a message to everyone in the #announcements channel of their Discord server instead of posting about it on Instagram and hoping the post gets served to a wide enough portion of their audience.

Feeds are async while chats are instant.

- user-world relation, not like group-groups in discord or user-group in slack
- user can in one click(messender ui/ux)
  - participate in discussions and read news in text channels
  - watch streamed audio/video content(podcasts, lives, misic, studying/lections, movies) from user or sourced outside in stream channels
  - get instant notifications
- public/private channels
- creators need to create a channel to broadcast
- there are lists(channel folders, family etc) and public/private spaces(communities of channels with own integrations & rules)
- teams/organizations need to create a private space/office, community - a public one
- dms/calls the same level threads, lists, spaces
- webhooks(channel relation, space relation)

## Features

- no password 2FA
- offline access
- **public and private Spaces**
- corporate domain based Space access__
- guest Space access__
- Space participant groups__
- participant/thread/message lifetime
- public and private channels
- **text and audio channels**
- channels sharing between Spaces__
- separate message threads
- DM, DM groups up to 8 users
- **trend channels feed**
- custom thread categories
- Space verification__
- Space analitics__
- slash commands
- smart search in Space
- 10,000 messages, 10GB of files and 20 users per call per Space
- keyword notification list
- message formatting
- one-click emoji reactions
- polls
- system bots features:
  - Space member rating
  - stopword lists
  - assistent bot
  - events and tasks
  - audio and video calls with record saving
  - routine meetings with screen sharing
  - email and rss integrations
- custom integrations

## Application

### User

#### Authentication

For every client app and every time you sign in you need to enter auth source(?email/phone) and use a short digit confirmation code from it. After local confirmation the APP creates an access token(x-token) and a refresh token(x-refresh-token) that client app will store both locally.\
Requests with access token will use quick auth by memory cache session.\
Despite APP not use passwords at all, there is kinda a 2FA(two-factor authentication) is used since access token includes some info about initial client device as well that server will check by comparing with request metadata from actual device. This way stolen access token will be useless on another device.

#### Restore access

In case you lost access to auth source(?email/phone) you can restore access with one of two ways:

- if you are member of any Space you can ask advanced user of that Space get you special access link
- after first login you can generate a disposable restoration token from profile settings page, save it and use in such a cases. The next time you will need preliminarily generate a new one.

Set the new auth source right after restoration.

#### Data

User data represented by username, fullname, description, contacts, avatar, email, phone and timezone.
Timezone is used for for summary and notification emails, reminders and times in activity feeds.\
Within the space user also has role and optional ones: description, inactivity status and inactivity schedule.\
Common profile data and some Space related data can be changed in profile settings.

### Space

Space is an entity to host your community or organization.\
Space has own name, description and avatar. Space can be private which will be your option for organization or team.\
The main entities of Space are participants and threads.

#### Participants

Every user can create a new Space, join existed one and switch between available ones.
Joining public Space is free but for private one there are three ways:

- advanced Space user can directly add an existing APP user
- new APP user will automatically be joined the Space after registration by approved corporate domain email
- advanced Space user can create a short-lived invitation link that can be publicly shared anywhere or privately sent to certain email.

User can be joined with auto deactivation after time. This could be useful case for Space guests.\
Every user except owner can leave Space and delete data at will.

`Invitations`

Private personal invitation will become invalid after the first successful registration from the email. This way it cant be reused. Public invitations can be used multiple times. Advanced Space users can observe all created invitations with the participants that have been joined through them and manage these invitations as well: extend life time or delete.

`Roles`

Within the Space a user has a one of composite role:

- Guests: clients, freelancers, interns. They can post and make calls only in channels they have been invited.
- Members: common users. Can post and make calls in all joined threads and also create and manage own threads.
- Admins: super members. Members that have access to Space administration.
- Owner: creator or delegated user. A person with extra Space administration including Space deletion.

The admins and owner are advanced Space users.\
Admins can ban the members and owner can ban the admins.\

Full actions map:

| Action                                          | Command                  | guest | member | admin | owner |
| ----------------------------------------------- | ------------------------ | ----- | ------ | ------| ----- |
| use slash commands                              | /                        | +     | +      | +     | +     |
| search in Space                                 | /s to:me hi during:2020  | -     | +      | +     | +     |
| mute thread                                     | /mute(unmute) 3min       | +     | +      | +     | +     |
| leave Space                                     |                          | +     | +      | +     | -     |
| **Thread**                                      |                          |       |        |       |       |
| create dm                                       | new @ @                  | -     | +      | +     | +     |
| manage dm members                               | who/add/remove @         | -     | +      | +     | +     |
| join any available channel                      |                          | -     | +      | +     | +     |
| could be joined any available channel           |                          | +     | +      | +     | +     |
| create a channel                                | new #                    | -     | +      | +     | +     |
| leave channel(except default, data remains)     | leave                    | -     | +      | +     | +     |
| send/edit/delete messages/files in threads      |                          | +     | +      | +     | +     |
| delete other people's messages in channels      |                          | -     | -      | +     | +     |
| create a poll in available threads              | poll                     | -     | +      | +     | +     |
| pin/unpin messages/files in available threads   |                          | -     | +      | +     | +     |
| save messages/files to saved list               |                          | -     | +      | +     | +     |
| **Channel administration(creator)**             |                          |       |        |       |       |
| manage channel members                          | who/add/remove @         | -     | -      | +     | +     |
| edit channel data and settings                  | edit                     | -     | -      | +     | +     |
| share channel to another Space                  | share                    | -     | -      | -     | +     |
| confirm channel sharing from another Space      |                          | -     | -      | -     | +     |
| archive channel(except default, data remains)   | archive/unarchive        | -     | -      | +     | +     |
| delete channel(except default, data lost)       |                          | -     | -      | +     | +     |
| **Space settings**                              |                          |       |        |       |       |
| edit Space user position                        |                          | -     | +      | +     | +     |
| edit Space common data                          |                          | -     | -      | -     | +     |
| verificate Space                                |                          | -     | -      | -     | +     |
| add/invite/manage Space users                   |                          | -     | -      | +     | +     |
| create/manage user group                        |                          | -     | -      | +     | +     |
| can be added to user group                      |                          | -     | +      | +     | +     |
| promote/demote an member role(from guest)       |                          | -     | -      | +     | +     |
| promote/demote an admin role                    |                          | -     | -      | -     | +     |
| promote/demote a owner role                     |                          | -     | -      | -     | +*    |
| add/remove corporate domain                     |                          | -     | -      | -     | +     |
| ban Space user                                  | /block(unblock) @user 4h | -     | -      | +     | +     |
| block stoplist word                             | /block(unblock) word     | -     | -      | +     | +     |
| toggle user ratings usage                       |                          | -     | -      | -     | +     |
| manage user created channels                    |                          | -     | +      | +     | +     |
| leave user available channels                   |                          | -     | +      | +     | +     |
| manage custom thread folders                    |                          | -     | +      | +     | +     |
| view all public threads                         |                          | -     | -      | +     | +     |
| archive/unarchive any public thread             |                          | -     | -      | -     | +     |
| delete any public long archived(3mon) thread    |                          | -     | -      | -     | +     |
| manage default public channels                  |                          | -     | -      | -     | +     |
| manage Space integrations                       |                          | -     | -      | +     | +     |
| access to analitics section                     |                          | -     | -      | +     | +     |
| export analitics section data                   |                          | -     | -      | -     | +     |
| delete a Space                                  |                          | -     | -      | -     | +     |

`Groups`

Group is a collection of users within a Space for easy notification and invitation. Groups, like users, can be mentioned anyplace in APP like @relatives @designers etc.

#### Threads

The thread can be a channel or DM.\
Important threads can be starred for later quick access.\
Thread can be created with auto deletion with the all content after specific period.

`Channel`

Channel is a topic-centered thread with optional description and avatar.\
Channels can be public which you can join just by click or private in which case you need an invitation to join. Public channels can be converted to private but not vice versa due the privacy reasons. You can also restrict channel access to readonly for certain or most users for cases like announcement, broadcast or stream channels.\
There are text and audio channels in terms of content. Text channels allow to post messages and files, like any general message discussion, while audio ones are for meetings and streams. You can use camera and screen sharing for audio channels as well.\
Due the unlimited count of participants the text channels use focused and organized side conversations for message replies. Messages with more than 3 replies will display them as a separate thread.\

There are additional channel options:

- Default - default public channels will automatically join all existed and new users. Cannot be leaved.
- Sharing - channel can be shared between Spaces. After the initiator selects Spaces to be connected and get confirmation from them the sharing will coming. Connected Spaces or initiator can break a channel sharing anytime.

The unwanted channels except default can be archived or completely deleted. Archived channels can be unarchived by creator.

`DM`

DM is a direct conversation that limited up to 8 members. With an increase in the number of participants it have to be converted to a private channel.\
In DM you can post messages, files and make calls with camera and screen sharing as well. Message replies in DM are not threaded.\
Personal DM can be used as a notepad and file saver.

`Default thread categories`

In common all available threads are organised in default categories:

- Starred - all user starred threads appear in pinned folder for quick access.
- Channels - all user available channels, sorted by most frequently usage or recent activity.
- Direct - DMs user use most frequently.

All items in default folders support notification counting. Threads with unread messages will have bold font name and the counter badge will be incremented with all new messages or only by DM, mentions, reactions and keywords.

`Custom thread categories`

User can create and manage custom categories for available thread organization within the Space. Category includes name and optional icon.\
The thread included in custom category will not be listed in default ones.

`Feeds`

There are some feeds(virtual threads) available to user in Space:

- Drafts - unsent messages from all threads are listed here. Hidden if there are no any of them.
- Pulse - mentions, reactions and keywords user has from all threads including not joined ones. Supports notification counting.
- Trending - channels that algorithmically rated as hot by criterias like new, not default, most viewed and active etc. Notification channel suggestions from time to time based on user activity.
- Saved items - all user bookmarked messages and files.

`Updates`

- Within the session user may has some pubsub clients(web, desktop, mobile), __timezone__ and last activity time(__lat__).
- The __client activity__ is based on detecting cursor and keyboard activity.
- User can change __thread notification politic__ - to notify about:
  - all updates
  - only main updates: DM, reactions, mentions and keywords
  - no updates: muting channels and direct messages you only need to check occasionally.
- Inactivity status & schedule
  Within Space an user can set up optional inactivity status: dnd, away, on call and active. 
  
  The last one (to receive notifications during your working hours, also based on user timezone).\
 and .\
  
  inactivity schedule: work and rest hours for a week. In inactivity times updates will going on but notifications will be not shown/alert.\
  In case status was not setted up it will be represented as user LAT translations:
  - up to 10sec: 'active'
  - up to 5min: 'was recently'
  - over 5 min: 'was active n time ago'
  - over 30 min: 'away'
  User can set up dnd status for a specific amount of time:
  /dnd 15 mins
  /dnd until 5pm
  /dnd off

With initial Space loading the thread unread activity are counted based on __lat__.
Realtime thread unread activity are processed by next steps:

- backend
  - create/update/delete message in thread
    - if pubsub client subscribed on thread broadcast message to it
    - if pubsub client not subscribed on thread
      - fetch all thread users with allowed __thread notification politic__(?cached)
      - if such users includes pubsub client and if update is required broadcast update flag to it
  - get thread read signal from client
    - find all user pubsub clients and send them __thread read signal__
  - feeds
    - pulse
    - trending
- frontend
  - thread updating on client
    - active thread
      - concat all new messages. Use sound notifications based on __thread notification politic__
      - if __client active__ and __last message in viewport__ then auto scroll unread messages
      - if __client not active__ or __last message not in viewport__ then disable autoscroll and update __counter badge__  based on __thread notification politic__. __counter badge__  will be throwed off by scrolling.
      - if __client not active__ show push notifications with update preview based on __thread notification politic__
    - not active threads
      - update __counter badge__ or __live status__ with sound notifications.
    - __counter badge__  will be throwed when thread stands active.
    - when all updates are read client notifies other user clients about it through the service
  - get thread read signal
    - clear __counter badge__ updates

?To prevent notifications on all user clients at time in case of there are a few user pubsub clients, try send updates to minimal __lat__ client at first. After timeout other pubsub clients will be updated also with notifications(by flag) or without if the first client returned __thread read signal__ before timeout.

`Moderation`

Owner can archive public channel with unwanted content and remove it completly after 6 monthes of inactivity. If such a thread will be unarchived by creator the owner or admin can ban member temporary or remove him from Space completely.

#### Messaging

User can send message and edit or delete own messages within the text threads and DMs.
There are extra operations with message:

- Mark unread
- Save - message can be bookmarked for yourself within the Space.
- Share - message can be forwarded to other threads.
- Pin - message can be pinned to thread for every thread member.
- Reply - message can be replied by another one. Text channels include the reply messages in separate threads.
- Add a reaction - user can react to message with one-click emoji reactions or any suitable ones.

Conversations are marked as read on thread opening, starting where you left off by default. It can be changed to auto scrolling to the bottom.\
All unsent messages are automatically saving as a drafts.\
The current message typing information is also shown.\
Message can be deleted after specified time. Related files will be deleted also.\
Space is limited by most recent 10,000 messages and 10 gb space for files. When the limit is reached, old messages and files will begin to be deleted to free up space for new ones.

`Formatting`

To format a message you can:

- use the formatting toolbar in the message field
- surround text with the symbols associated with each format

| Formatting    | Toolbar                               | Symbols                                      |
| --------------| ------------------------------------- | -------------------------------------------- |
| Bold          | Select text and click the **B** icon  | Surround text with asterisks: `*text*`       |
| Italic        | Select text and click the *I* icon    | Surround text with underscores: `_text_`     |
| Underline     | Select text and click the U icon      | Surround text with 2 underscores: `__text__` |
| Strikethrough | Select text and click the ~~S~~ icon  | Surround text with tildes: `~text~`          |
| Inline code   | Select text and click the </> icon    | Surround text with backticks: `` `text` ``   |
| Blockquote    | Select text and click the Q icon      | Begin text with angled brackets: `> text`    |
| Ordered list  | Select text and click the order icon  | Begin text with period and shift: `1. text`  |
| Bullet list   | Select text and click the bullet icon | Begin text with asterics and shift: `* text` |

`Emoji`

App uses Unicode emoji menu and emoticons cheat sheet.\
By default common emoticons will be changed to an equivalent emoji.\
If your message doesn't have any text and only contains emoji, the emoji will appear larger.

`Reactions`

Emoji reactions are a one-click way to respond to any message. They can replace the need for follow-up messages.\
To see who’s reacted to a message, hover over or tap and hold the reaction. The reactions you add will be highlighted. If you’d like to remove a reaction you’ve added, simply click or tap the reaction from the message.\
One-click emoji reactions set can be changed anytime by advanced members.

`Links`

Links can be added simply by copy paste. App will detect link and load a content or page preview inside the message.

`Files`

You can drag and drop or attach up to 10 files into the message, up to 1gb per file.\
Message will include a preview of the files.\
Gifs, audio, video and emoji are not auto played in thread by default.\
All available files from available threads will be able to found in File browser feed.\
Audio and video can be recorded for message with commands /voice /video as well.

`Polls`

You can attach a common one or multiselect poll or quiz poll to the message. Poll will be active before presetted period or until it would be manually stopped.

`Keywords`

With keywords you can get notified whenever someone mentions a word or phrase that matters to you, like your fullname, username, project, customer, area of interest, or any other conversation you want to stay plugged into. Keywords list available for every member of Space.\

`Mentions`

Participants or user groups can be notified by mentions:

- @everyone - every thread participants
- @here - all active thread participants
- @username and @group - personaly or by group. They will receive notification whatever they have joined the thread or not.

Mentioned public channels #channel and keywords will be highlighted.\
By clicking the public #channel or @username you will join the channel or start a DM respectively.

#### Audio & video streaming

User can make audio, video and screen sharing calls in DM and streams in audio channels.\
Audio channel can stream music, podcasts, discussions, lives, movies etc.
The public and private IP addresses of a device may be shared with other devices while on the same call.
Optionally the Space inactivity status can be automatically set to 📞 On a call|mic when you're on a call|stream.
The calls and audio channels are available in every new Space by default but they can be turn off.

Restrictions:

- Participants count: up to 20
- Audio stream: 16kHz
- Camera stream: 1280x760 and 15 frames/sec
- Screen sharing: 1280x720 and 3 frames/sec

Bandwidth requirements:

- Voice call: 200 kbps DOWN and 100 kbps UP
- Video call with 2 participants: 600 kbps DOWN and 600 kbps UP
- Video call with 3 participants: 1.2 Mbps DOWN and 600 kbps UP
- Video cal with 5+ participants: 2 Mbps DOWN and 600 kbps UP

Make calls in DM:

1. click the phone icon or type the command /call, then select Start Call to confirm.
2. Your call will start right away and the member(s) you're calling will receive a pop-up notification to join the call.
3. if you'd like, you can click the camera icon to turn on your video.

Stream in audio channel:

1. click the stream icon or type the /stream <!-- 2. app will post a message to the channel letting others know that you've started a call. Up to 20 people can join the call by choosing Join. -->
2. if you'd like, you can click the  camera icon to turn on your video.
3. you can hang lock audio channel and go to other channels while the active audio stream in the same time

On the call window you can:

- switch video mode(starter)
- invite other people to a call(starter)
- end call(starter)
- record call(starter)
- mute own audio/video
- leave call
- send emoji reaction
- see all particapants window previews
- share your screen. only one person can share their screen at a time.
- draw on your screen and let others draw on your screen

#### Other

`Commands`

Some actions in Space can be executed both in gui and by slash command in message form. Available slash commands according to roles are highlighted on typing.

`Search`

Everything shared in APP within DMs and available channels is searchable by using smart search.
The last search results will be cached for search suggestions.
Available filters: Messages, Files, Channels, and People.
Available modifiers:

- from:@name: messages sent from a particular person
- from:me: messages sent by you
- in:#channelname: messages and files in a specific channel
- in:@name: your direct messages with a particular person
- to:me: direct messages sent to you
- has:link: messages that include a URL
- has:files: messages that include a file
- has:reaction: messages that have received reactions
- before:[date], after:[date], on:[date/month/year], during:[month/year]: messages from a specific timeframe
- "reports": use quotation marks to only see results for a specific word or phrase
- rep*: add an asterisk to a partial word with at least three characters to see results(reply or report)
- -report: add a dash in front of a specific word to see search results without that word

1. from:me has:link during:2020 - every message you sent with a URL in 2020 year.
2. from:@a.trebek Jeopardy on:yesterday - to see every message your coworker Alexis Trebek sent about Jeopardy yesterday.

`Verification`

Space can be verified as official by admin request. It takes some time before request will be accepted or rejected by APP administration.

`Analitics`

Space analitics section includes:

- Limits: messages(common, per private channels vs public etc), file storage
- Metrics: members activity, channels activity, Space activity in charts and graphs
- Export: public channels(html, json), users, access logs, call logs

Access logs fields:

- the time and date of each new sign in
- the IP address of each device that has accessed each account
- a list of devices that have accessed each account
- LAT per user

Most recent logs are stored in service database and write to log files from time to time.

## Integrations



New functionality can be integrated with external services. Service is something that computes and return/send data by request or schedule. External service can offer own functionality or connect existed services.\
To accept data from external service App needs to register it as webhook - a "reverse API" approach that brings client the new data without polling it.\
There are system and custom webhooks in the App. The system webhooks are public to all Spaces. The custom ones can be public or private - restricted to the . Advanced users of the Space can add or remove Space available webhooks.\

Webhook functionality can be available via shortcuts menu and slash commands.
Bot will hook mentions from any channel or bot DM.
Currently the only available event is message push and payload content-type is json
? Setting up
<https://logz.io/blog/elasticsearch-tutorial/>
<https://www.codeclouds.com/blog/the-differences-between-mongodb-and-sqlite/>
Implementation with custom ttl thread:
<http://hassansin.github.io/working-with-mongodb-ttl-index>
<https://stackoverflow.com/questions/49389459/mongodb-is-it-possible-to-capture-ttl-events-with-change-stream-to-emulate-a-sc>
<https://stackoverflow.com/questions/29497175/does-mongodb-expireafterseconds-has-callback-and-how-to-catch-it-with-nodejs>
<https://stackoverflow.com/questions/25297742/mongoose-mongodb-ttl-notification>

App shortcuts and slash commands:
Add someone to a channel
-Archive the current channel
-Edit the current channel’s description
Create a new channel
?Browse services
?Browse channels in your Space
?Browse files in your Space
Find people in your Space
Leave the current channel
Manage notifications for a channel or DM
Mute or unmute a conversation
Remove someone from the current channel
Rename the current channel
Set a reminder for yourself
Set the current channel topic
Set your status to away or active
Start a Slack call
Turn dark mode on or off
Turn Do Not Disturb (DND) on or off
View your draft messages
View your mentions & reactions
View your saved items


- Set a reminder - user can set a reminder for message.

intergate email/rss/twitter/youtube/other threads(channels)

### System webhooks

#### Assistant bot

- Description: multitasking assistant bot
- Permissions: message posting
- Implementation: Service stores and process context data and reminders for tasks and events
- Usage:

1. Human like dialogs by processing message keywords/context: 'What events are coming up this week?', 'when are holidays' etc. Advanced users of Space can provide Space related knowledge base to cover topics and issues for rest members: 'who is in the office today?', 'what is the password for the office Wi-Fi?' etc.
2. User can set a reminder within the Space for himself, a co-member or channel about any event or task with text topic and optionally releted message or thread. The reminder time can be setted up to minutes as timeout or interval. Assistant bot will send a DM with the reminder description at the preferred time.
Reminder can be also setted by slash commands:

/remind me|@arcadio|@frontend|#sells Submit report May 30
/remind list(reminder can be deleted from here)

#### Moderator bot

There are user rating and stopwords list options that can be enabled in Space. User rating is based on count of positive reaction he had in all public channels.\
Stopwords are used to filter unwanted content within the Space. To set a keyword list you have to have advanced role

18+
rudeness
violence
flood

#### Stats bot?

#### Tasks bot
status + priority

Hubs

#### Email Service

- Description: email forwarding to any channel or DM
- Permissions: message posting
- Implementation: Service handles emails, formats and sends them as messages to the thread.
- Usage:

1. Request an email address for thread. Use the address directly or set up automatic forwarding from email provider(gmail, ms outlook): <https://support.google.com/mail/answer/10957?hl=en>, <https://support.microsoft.com/en-us/office/turn-on-automatic-forwarding-in-outlook-on-the-web-7f2670a1-7fff-4475-8a3c-5822d63b0c8e?ui=en-us&rs=en-us&ad=us%20*/>
2. All emails sent to this address will be forwarded to the thread

the webhook which handles and stores emails and sends them as messages to thread.

#### RSS feed service

- Description: RSS and Atom feed forwarding to any channel or DM
- Permissions: message posting
- Implementation: Service periodically fetches updates from rss feeds, filters by keywords, formats and sends them as messages to the thread.
- Usage:

1. Add a feed/feeds to thread and set optionally an update period and keywords(to get only related content). If you get an error with feed adding, try validating the feed at <http://validator.w3.org/feed/>
2. Channel will be periodically updated with rss feeds messages

### Custom webhooks

Any user can add new webhook. User can delegate webhook ownership to another user.
The common use cases for new webhooks are services that:

- route notifications from other services
- show data by request: sales statistics, reports, leads, calls, etc
- implements lexical analysis for study app or something
- do experimental stuff like a bot that can open or close doors, or turn on a coffee machine via a slash command

`Create webhook`

1. provide a name and description and avatar by optional
2. provide service url(http://4ds23d1.ngrok.io/hook) and secret to authenticate request to your service
3. provide event to trigger the hook and permissions. Currently the only available event is message push and payload content-type is json. Available permissions are message posting and file saving.
4. Provide aprivateness
5. test webhook with a ping button to complete creation
6. save the access token and use it for authenticate webhook service requests. Access tokens are used for authenticate to the Swoy API over basic authentication.

`The external service requirements`

Trigger and send event payload to service
The external service you choose to create and configure your webhook needs to provide you with the ability to make an HTTP request to back to Swoy.
Before payload processing it is important to respond quickly with a HTTP HEAD 2xx (200, 201, 202, etc.) status code.
After processing you have options:

- webhook request can have fallback and callback to back the result of processing
- app will generate a unique request URL your service can back the result of processing by POST/use an access token

Example message event handling workflow:

- add webhook to app
- add webhook to Space
- 

- outcoming api request(+secret)

- incoming webhook request(+token)


- message-service: received a message obj evnt via ws
- message-service: if isBot get related webhook endpoint from db else put message in db
- message-service: send to webhook headers[] body{} { payload with request signature(token + timestamp)}
- bot: send back 200ok status
- message-service: if no 200 status during 5sec send error else put message in db
- bot: parse command with NLP and process request(use keywords as event names)
- bot: send body message to message-server

## Clients

GTEestiPro font
updates` detection(traffic light, 72-hours)
giphy integration
translator integration
text-to-speech notifications
entire state in indexedDB, offline
detecting cursor activity

### Start(auth) page

`start(Auth)`

- web/desktop: #get-started + #check + #confirm + #profile(for new users) + #recovery(optional)
- mobile: #get-started + #check + #confirm + #names(for new users) + #recovery(optional)

For new account the next page after code confirmation will be the new profile form, and new Space form or Spaces dashboard in case of invitation link usage.
For existing users successfull authentication goes to Spaces dashboard.

### Add(create) Space page

`add(Create a Space)`

- web/desktop: #teamname + #teamtype + #channel + #invites
- mobile:  #teamname + #teamtype + #channel + #invites

the first channel will be default

### Spaces page

`/:SpaceId/?:threadId`

- web/desktop:
- mobile:

#### Modals

`add/edit channel`

- avatar
- name
- description
- privatness(from public to private only)
- type
  - readonly
- archived
- default
- share

### Settings page

`settings/profile`

- common
  - avatar
  - name*
  - fullname
  - description
  - email
  - phone*(with confirmation)
- 2fa
  - switch(off, need password + email for recovery)
  - password(null)  
- sessions
  - devices list:(last activity + session turn off except current)
  - sign out
  - sign out from all devices
  - clear cache
- deleting
  - self destruction period(null)
  - delete my account

<!-- - Space
  - description
  - inactivity status
  - inactivity schedule -->
- access tokens

`settings/app`

- interface
  - color theme(light)
  - dark mode(false)
  - automatic dark mode at sunset
  - compact mode(false)
  - language(en)
- notifications
  - off push notifications(false)
  - off sound(false)
  - notify about(init mode on available threads, main): all new messages || dm, reactions, mentions & keywords
  <!-- - duplicate notifications to all devices(false) -->
  - keywords notification
    - list
    - add one
- messaging
  - send by enter(false)
  - convert emoticons to emoji(true)
  - no autoplay gif/audio/video/emoji(false)
  - scroll unread messages(start where you left off by default)
- calls & streams
  - join calls with muted audio and video(false)
  - automatically set status to 📞 On a call|mic when you're on a call(true)
  - select correct audio input(mic), output sources(speakers) and camera device
  - call test

<!-- `settings/Space`

- common
  - privateness
  - avatar
  - name
  - description
  - verification
- users
  - participants
    - list
    - add new
  - groups
    - list
    - add new
  - roles
    - list
  - invites
    - invitations
      - list
      - add new
    - domain
  - bans
    - list
    - add new
- channels
  - list
  - custom thread categories
    - list
    - add new
  - shared channels
    - list
    - new sharing
  - default channels
    - list
- messaging
  - quick emoji reactions
    - list
    - add new
- calls & streams
  - allow DM calls
  - allow audio channels
- integrations
  - moderation
      - show ratings
      - stopwords
        - list
        - add new
    - list
    - add new
- analitics(link)
- delete Space -->

### Analitics page

`analitics/`

- web/desktop: :SpaceId

## Roadmap

https://sun1-87.userapi.com/impg/u2ZnTCTna9h0SXegj4F9dj18liqdsLtVl1WcBw/kvGE9i9YQ6U.jpg?size=100x0&quality=88&crop=9,7,1601,1601&sign=02c002777b087e5cea13300d586e55ef
=chunks: epic => stories(within a single sprint) => tasks
👏:clap: — “Well done!”
➕:heavy_plus_sign: — “I agree”
👀:eyes: — “Looking at it” or “acknowledged”
✅:white_check_mark: — “approved” or “mark it as complete”

- keyboard shortcuts
- each Space may has own color palette etc like different websites
- in read-only channels, members can still add reactions with emoji
- audio channel can be locked
- posts/articles as files
- info emails
- shorten links
- custom emoji/emoji packs
- emoji editor/animator
- custom commands
- message reports
- choose place to store Space
- extended role/permission model
- extended auth ways: identity providers, google etc
- call logging: the name of a call, where it was started (in a channel or a direct message), who started and participated, when members joined or left, and the time it ended.
- message security(telegram faq)
  - all messages are encrypted and stored in distributed network of servers
  - own protocol to transmit any private data
  - well-known protection algorithms? like TLS cryptographic protocol
- call security(telegram faq):
  - All traffic is encrypted in transit(end-to-end encrypted voice calls).
  - Media traffic is encrypted with SRTP using a DTLS-SRTP key exchange.
  - Real-time data channel traffic is encrypted with DTLS.
  - HTTPS or secure WebSockets using TLS 1.2 are used for signaling communication with our media server.
  - Call perfomance metrics include latency and jitter are stored and used to provide media connections with the lowest possible latency or lag.

  CI/CD
  clients: travis ci + deploy provider: github pages(web), github releases(desktop/mobile)
  application:
  integrations: ?heroku + heroku-postgresql(free)




#
initial/reload
  state.isLogged
  ? getAllSpacesAndThreads:
    (be)initial 
    (fe)render threads & spaces, connect message & call services with wss
    (be)message & call services dispatch updates
    (fe)commit updates
  : login:
    (fe)enter phone
    (be)send code
    (fe)enter code
    (be)checkcode and user existance(create session if exist)
    (fe)signup(name+, fullname, email, avatar) || redirect to getAllSpacesAndThreads
    (be)save user(create session)
    (fe)redirect to getAllSpacesAndThreads




Auth---------------------------------------------------------------------------------

stateful session: channel-service, message-service, call-service
jwt: file-service for actions, webhooks()
- 

webhooks
- push messages(commands) and as call enhancements
- jwt to app
- secret to webhook


Redis----------------------------------------------------------------------------------
channel-service

- session store: sessionid, user last activity time(lat), user clients, statusses?
- caching(ttlб all thread users with allowed __thread notification politic__)

message-service

- session store: sessionid, user last activity time(lat), user clients, statusses?
- caching(ttlб all thread users with allowed __thread notification politic__)
- frontend db for 200 ms network latency issue
- pubsub: broadcast message/feeds, broadcast typing/on stream/read message

call-service

?message broker
Common----------------------------------------------------------------------------------

fast, simple and free.
self(profile), message(file), thread, group destruction after period
your messages sync seamlessly across any number of your devices(clients).
you can send messages, files of any type up to 1gb, make calls and create an audio/video streams.
you can use replies, mentions, keywords and message threads.
p2p connections for streams.
offline access and cache files.
dm up to 8 people and multipurpose channels for broadcasting to unlimited audiences.
thread lists and groups.
Invite links
Direct links to chat 

Once you've set up a username, you can give people a t.me/username link. Opening that link on their phone will automatically fire up their Telegram app and open a chat with you. 

2fa with base SMS code + additional password. You need also email for password recovery.
If phone was stolen and you have session access from another device turn on the 2FA, terminate your old phone session, get new sim and change the phone number with brand new if need. Otherwise get new SIM with the old number, login, terminate your old phone session and turn on the 2FA.


bot usecases: 
users can interact with bots in two ways: dm and threads(all messages|only mentions)
bot commands(with bot mentions) are not persist



 user, thread_user, group_user
 thread: channel, dm
 list, list_thread
 group, group_thread

 role
 webhook