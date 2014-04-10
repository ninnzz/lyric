var steam
	, db = require(__dirname + "/../helpers/ndb")
	, curl = require('request')
	, d = new Date();

steam = function(kiel){

	var user_ids = ['76561198074274428','76561198034317478','76561198039481612','76561198028204074','76561198023242054','76561198053949796','76561198047264333','76561198047715950','76561198047008591','76561198003406724','76561198006109473','76561198054322588','76561198065883048','76561198071178366','76561198065779087','76561198047135340','76561198077952390','76561198044140596','76561198045812024'];
	var app = 570	//dota2
		, key = 'F7551A7B6F9F08F73CE6B16EAE848DF5'
		, recently_played 	= "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=F7551A7B6F9F08F73CE6B16EAE848DF5&format=json&steamid="
		, owned_games 		= "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F7551A7B6F9F08F73CE6B16EAE848DF5&format=json&steamid="
		, game_user_stats	= "http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=570&key=F7551A7B6F9F08F73CE6B16EAE848DF5&steamid="				//stats and achvments per game
		, game_achievements	= "http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=570&key=F7551A7B6F9F08F73CE6B16EAE848DF5&steamid="			//all achvments per game per user, can show how many achvments are left
		, game_achv_stats	= "http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?format=json&gameid="
		, user_level		= "http://api.steampowered.com/IPlayerService/GetSteamLevel/v1?key=F7551A7B6F9F08F73CE6B16EAE848DF5&steamid="
		, match_history		= "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/"
		, match_details		= "https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?key=F7551A7B6F9F08F73CE6B16EAE848DF5&match_id="
		, get_recent_played = function() {

			user_ids.forEach(function(val,index){
				curl(recently_played+val ,function(err,rs,body){
					if(!err && rs.statusCode == 200){
						body = JSON.parse(body);
						body['user_id'] = val;
						body['created_at'] = d.getTime();
						db._instance().collection('recent_played', function(err,_collection) {
							if(!err){
								_collection.insert(body,function(err){kiel.logger(d.getTime()/1000+' Failed to mine:'+err,'steam_debug')});
							}
						});
					}	
				});
			});
		}
		, get_owned_games = function() {
			user_ids.forEach(function(val,index){
				curl(owned_games+val ,function(err,rs,body){
					if(!err && rs.statusCode == 200){
						body = JSON.parse(body);
						body['user_id'] = val;
						body['created_at'] = d.getTime();
						db._instance().collection('owned_games', function(err,_collection) {
							if(!err){
								_collection.insert(body,function(err){kiel.logger(d.getTime()+' Failed to mine:'+err,'steam_debug')});
							}
						});
					}	
				});
			});
		}
		, get_game_user_stats = function() {
			user_ids.forEach(function(val,index){
				curl(game_user_stats+val ,function(err,rs,body){
					if(!err && rs.statusCode == 200){
						body = JSON.parse(body);
						body['user_id'] = val;
						body['created_at'] = d.getTime();
						db._instance().collection('game_user_stats', function(err,_collection) {
							if(!err){
								_collection.insert(body,function(err){kiel.logger(d.getTime()+' Failed to mine:'+err,'steam_debug')});
							}
						});
					}	
				});
			});
		}
		, get_game_achievements = function() {
			user_ids.forEach(function(val,index){
				curl(game_achievements+val ,function(err,rs,body){
					if(!err && rs.statusCode == 200){
						body = JSON.parse(body);
						body['user_id'] = val;
						body['created_at'] = d.getTime();
						db._instance().collection('game_achievements', function(err,_collection) {
							if(!err){
								_collection.insert(body,function(err){kiel.logger(d.getTime()+' Failed to mine:'+err,'steam_debug')});
							}
						});
					}	
				});
			});
		}
		, get_game_achv_stats = function() {
			curl(game_achv_stats+570 ,function(err,rs,body){
				if(!err && rs.statusCode == 200){
					body = JSON.parse(body);
					body['user_id'] = 570;
					body['created_at'] = d.getTime();
					db._instance().collection('game_achv_stats', function(err,_collection) {
						if(!err){
							_collection.insert(body,function(err){kiel.logger(d.getTime()+' Failed to mine:'+err,'steam_debug')});
						}
					});
				}	
			});
		}
		, get_user_level = function() {
			user_ids.forEach(function(val,index){
				curl(user_level+val ,function(err,rs,body){
					if(!err && rs.statusCode == 200){
						body = JSON.parse(body);
						body['user_id'] = val;
						body['created_at'] = d.getTime();
						db._instance().collection('user_level', function(err,_collection) {
							if(!err){
								_collection.insert(body,function(err){kiel.logger(d.getTime()+' Failed to mine:'+err,'steam_debug')});
							}
						});
					}	
				});
			});
		}
		, get_match_records = function(req,res,match_obj) {
			var query_string = ''
				, q_arr = []
				, last;
			for(var p in match_obj) {
				if(match_obj[p]) {
					q_arr.push(p+'='+match_obj[p]);
				}
			}
			query_string = q_arr.join('&');
			// kiel.logger(d.getTime()+' '+match_history+'?'+query_string,'steam_mine_match_history_index');
			
			curl(match_history+'?'+query_string ,function(err,rs,body){
				if(!err && rs.statusCode == 200){
					body = JSON.parse(body);
					
					if(body.result.status == 1) {
				
						for(var match in body.result.matches) {
							if(body.result.matches[match]) {
								db._instance().collection('dota2_matches', function(err,_collection) {
									if(!err){
										_collection.insert({_id:body.result.matches[match].match_id, match_seq_num:body.result.matches[match].match_seq_num, indexed:false},function(err){/**kiel.logger(d.getTime()+' Failed to add ['+body.result.matches[match].match_id+']:'+err,'steam_debug')**/ console.log('Matched inserted');});
									}
								});
								last = body.result.matches[match].match_id;
							}
						}	

						if(body.result.results_remaining !== 0) {
							match_obj['start_at_match_id'] = last;
							get_match_records(req,res,match_obj);
						}
					}
				}	
			});

		}
		, extract_fields = function(data,parent,prefix) {
			var arr = {};
			
			for(var i in data) {
				if(typeof(data[i]) !== 'undefined'){
					if(typeof(data[i]) === 'object') {
						switch(i){
							case 'players' : {
								var m = extract_fields(data[i],'player','player_slot');
								for(var j in m) {
									if(m[j]) {
										arr[j] = m[j]
									}
								}
								break;
							}
							case 'ability_upgrades' : {
								var m = extract_fields(data[i],parent+'_ability_upgrades','ability_upgrades');
								for(var j in m) {
									if(m[j]) {
										arr[j] = m[j]
									}
								}

								break;
							}
							default: {
								var m = extract_fields(data[i],parent+'_slot_'+i,prefix);
								for(var j in m) {
									if(m[j]) {
										arr[j] = m[j]
									}
								}
							}
						}

					} else {
						if(prefix){
							arr[parent+'_'+i] = data[i];
							
						} else {
							arr[i] = data[i];
						}
					}
				}
			}
			return arr;
		};
	return {
		get : {
			dota2 : function(req,res) {
				get_recent_played();
				get_owned_games();
				get_game_user_stats();
				get_game_achievements();
				get_game_achv_stats();
				get_user_level();
				kiel.response(req, res, {data : "running"}, 200);
			} ,
			dota2_formatted : function(req,res) {
				var match_details_collection
					, options = {}
					, m_array = [];
				
				req.get_args.limit && (options['limit'] = req.get_args.limit);
				req.get_args.offset && (options['skip'] = req.get_args.offset);
				db._instance().collection('dota2_match_details', function(err,_collection) {
					if(err){ kiel.response(req, res, {data : err}, 500); return; }	
					match_details_collection = _collection;
					match_details_collection.find({},options).toArray(function(err,data) {
						var m=[];
						for(var match in data) {
							if(data[match]) {
								m = extract_fields(data[match],'match');
								m_array.push(m);	
							}
						}
						kiel.response(req, res,m_array, 200);

						// kiel.response(req, res, {data : m_array}, 200);
//						return;
					});
				});

			} ,
			dota2_match : function(req,res) {
				var rqrd = ['extensive']
					, match = {min_players:10}
					, depth
					, game_mode
					, skill
					, skill_loop = 3
					, game_mode_loop = 13;
				if(!kiel.utils.required_fields(rqrd,req.get_args)){
					kiel.response(req, res, {data : "Missing fields [extensive]"}, 500);
					return;
				}

				match['key'] = key;

				req.get_args.min_players 	&& (match['min_players'] = req.get_args.min_players );
				req.get_args.skill 			&& (match['skill'] = req.get_args.skill) && (skill_loop=1);
				req.get_args.game_mode 		&& (match['game_mode'] = req.get_args.game_mode) && (game_mode_loop=1);
				req.get_args.hero_id	 	&& (match['hero_id'] = req.get_args.hero_id );
				req.get_args.date_min	 	&& (match['date_min'] = req.get_args.date_min );
				req.get_args.date_max	 	&& (match['date_max'] = req.get_args.date_max );
				req.get_args.account_id	 	&& (match['account_id'] = req.get_args.account_id );

				if(req.get_args.extensive) {
					for(var i = 0 ; i<=skill_loop; i++) {
						for(var j = 1; j<=game_mode_loop; j++) {
							for(var k = 1; k <= 110; k++) {
								match['game_mode'] = j;
								match['skill'] = i;
								match['hero_id'] = k;
								get_match_records(req,res,match);
							}
						}
					}
					kiel.response(req, res, {data : "Running extensive indexing of match_ids. This might take 10-20 mins."}, 200);
				} else {
					get_match_records(req,res,match);
					kiel.response(req, res, {data : "Running custom indexing of match_ids. This might take 10-20 mins."}, 200);
				}
			} ,
			dota2_match_details : function(req,res) {
				var options = {}
					, match_collection
					, match_details_collection;
				req.get_args.count && (options['limit'] = req.get_args.count);
				db._instance().collection('dota2_matches',function(err,_collection) {
					if(err){ kiel.response(req, res, {data : err}, 500);console.log('db1 '+err); return; }	
					match_collection = _collection;
					match_collection.find({indexed:false},options).toArray(function(err,mtchs) {
						if(err){ kiel.response(req, res, {data : err}, 500);console.log('db2 '+err); return; }	
						db._instance().collection('dota2_match_details', function(err,_collection) {
							match_details_collection = _collection;
							for(var m in mtchs) {
								if(mtchs[m]) {
									console.log("Finding match_details for match id: "+mtchs[m]._id);
									curl(match_details+mtchs[m]._id ,function(err,rs,bd){
										var body = bd;
										console.log('Entered CURL');
										if(err){
											console.log('curl1 '+err);
											console.log('response '+rs);
											console.log('body '+body);
										}
										if(!err && rs.statusCode == 200){
											body = JSON.parse(body);
											console.log('Fetched API data from match_details for id:'+body.result.match_id);
											kiel.logger(d.getTime()+' Fetched API data from match_details for id:'+body.result.match_id,'dota2_match_details')
									

											body.result['_id'] = body.result.match_id;
											match_details_collection.insert(body.result,function(err){
												if(!err) {
													console.log(body.result._id);
													match_collection.update({_id:body.result.match_id},{$set:{indexed:true}},function(err,dts){console.log('update: '+dts);});
												}//update the match_collection
												else {
													console.log('db3' +err);
													kiel.logger(d.getTime()+' Failed to mine:'+err,'steam_debug')												
												}
											});//insert ng match_details


										}	
									});
								}
							}
						});
						kiel.response(req, res, {data : "Running indexing of match_details. This might take time depending on the count parameter."}, 200);
					}); 
				});
			}

		} 
	}
}

module.exports = steam;