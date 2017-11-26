# Barbot

## Directories structure

 - `cad`: CAD files in [FreeCAD](https://www.freecadweb.org/) format
 - `cad/stl`: STL files ready to print
 - `dispenser`: Code to drive the drink dispenser
 - `server`: Code that reads the twitter feed and notifies the dispenser

## Setup

### server

The following environment variables are needed

 - `EVENT_HASHTAGS`: Comma separated list of possible hastags that will be recognized
 - `DRINKS_HASHTAGS`: Comma separated list of hastags that represent the different drinks
 - `TWITTER_CONSUMER_KEY`: Twitter consumer key
 - `TWITTER_CONSUMER_SECRET`: Twitter consumer secret
 - `TWITTER_ACCESS_TOKEN`: Twitter access token
 - `TWITTER_ACCESS_TOKEN_SECRET`: Twitter access token secret

They can be set in a `config.json` file too

```
{
	"EVENT_HASHTAGS": "#nodeconfar",
	"DRINKS_HASHTAGS": "#fernet,#campari",
	"TWITTER_CONSUMER_KEY": "XXXX",
	"TWITTER_CONSUMER_SECRET": "XXXX",
	"TWITTER_ACCESS_TOKEN": "XXXX",
	"TWITTER_ACCESS_TOKEN_SECRET": "XXXX"
}
```
