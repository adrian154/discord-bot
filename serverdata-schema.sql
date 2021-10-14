CREATE TABLE IF NOT EXISTS serverFeatures (
    serverID TEXT,
    feature TEXT NOT NULL,
    value INTEGER NOT NULL,
    PRIMARY KEY (serverID, feature)
);

CREATE TABLE IF NOT EXISTS serverChannels (
    serverID TEXT,
    channelType TEXT NOT NULL,
    channelID TEXT NOT NULL,
    PRIMARY KEY (serverID, channelType)
);