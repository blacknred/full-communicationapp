const templates = {
    envitation: `
        <div>
        <h1><i>Hello</i> from SWOY corporate messenger</h1>
        <h2>You have received invitation to the team #name.</h2>
        <p>
        Just use the link to continue.<br />
        (This link will expire in 1 day.)
        </p>
        <a href="#referrer/login?token=#token&email=#email">
        <b>INVITATION LINK</b>
        </a>
        </div>
    `,
};

export default (name, values) => {
    let template = templates[name] || '';
    Object.keys(values).forEach((k) => {
        template = template.replace(new RegExp(`#${k}`, 'g'), values[k]);
    });
    return template;
};
