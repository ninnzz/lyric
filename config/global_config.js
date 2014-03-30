var config = {
	"environemnt" 	: "development",
	"production"	: {
		"port"	: 80,
		"logs"	: "logs/",
		"domain"	: "http://lyric.engine"
	},
	"staging"	: {
		"port"	: 3001,
		"logs"	: "logs/",
		"domain"	: "http://localhost"
	},
	"development" : {
		"port"	: 3001,
		"logs"	: "logs/",
		"domain"	: "http://localhost"
	}
}
console.log("Global config files loaded......");
module.exports = config[config.environemnt];