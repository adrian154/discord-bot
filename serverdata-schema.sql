CREATE TABLE IF NOT EXISTS features (
    domain TEXT,
    feature TEXT NOT NULL,
    value INTEGER NOT NULL,
    PRIMARY KEY (domain, feature)
);

CREATE TABLE IF NOT EXISTS serverChannels (
    serverID TEXT,
    channelType TEXT NOT NULL,
    channelID TEXT NOT NULL,
    PRIMARY KEY (serverID, channelType)
);