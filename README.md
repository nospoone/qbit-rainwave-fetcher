# NodeCG Rainwave Fetcher
This [NodeCG](http://www.nodecg.com) extension fetches song informations and albums covers when songs change on the radio. 

### Installation
- Clone/copy/install to `nodecg/bundles/qbit-rainwave-fetcher`.
- Create a valid config file (`nodecg/cfg/qbit-rainwave-fetcher.json`).

### Configuration
The configuration file is as follows:
```json
{
	"enableCache": true,
	"cachePath": "cache/"
}
```

| Key           | Type     | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `enableCache` | Boolean  | Enables/disables the local caching of the album art. |
| `cachePath`   | String   | Where to cache the album art if caching is enabled.  |

### Usage
In an extension:
```js
const fetcher = nodecg.extensions['qbit-rainwave-fetcher'];

fetcher.on('update', info => {
	nodecg.log.info(info);
})
```

The cached album cover art files are served directly via an [express](http://expressjs.com/) route and [`nodecg.mount()`](http://nodecg.com/NodeCG.html#mount) at the URL specified in the received data.

### Data Structure
```js
{
	title: "Ingame Day",
	artist: "David Joiner",
	album: "The Faery Tale Adventure",
	coverArtFilename: "4_1777_240.jpg",
	coverArtURL: "http://rainwave.cc/static/baked/album_art/4_1777_240.jpg",
	coverArt: "/qbit-rainwave-fetcher/cache/4_1777_240.jpg"
	expiresIn: 30000,
}
```

| Key                | Type   | Description                                          									  |
| ------------------ | ------ | ----------------------------------------------------------------------------------------- |
| `title`			 | String | Track title. 																			  |
| `artist`			 | String | Artist(s) name(s).  																	  |
| `album`			 | String | Album title. 																			  |
| `coverArtFilename` | String | Album cover art's filename. Used internally. 											  |
| `coverArtURL`      | String | Album cover art's original URL. Used internally.										  |
| `coverArt`		 | String | Album cover art's URL. This is the one to use in an `<img>` tag or otherwise. 			  |
| `expiresIn`		 | Int    | Time (in ms) before the song is over and the API is recontacted for the next song's info. |

### Acknowledgements
- [The NodeCG Team](https://github.com/NodeCG) for NodeCG :tada: :confetti_ball:
- [Alex Van Camp](https://github.com/Lange) and the [Support Class repos](https://github.com/SupportClass) from which this readme & extension is heavly inspired from.