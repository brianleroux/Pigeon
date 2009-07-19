var friends_timeline_url = "http://www.twitter.com/statuses/friends_timeline.json";
var tweet_response = "";

x$(window).load(function() {
	load_tweets("#content", x$.data.m_user, x$.data.m_pass);	
	x$('#content','#post_new_tweet').css({display:'block'});
});

var load_tweets = function(container_id,user,passw) {
	
	x$(container_id).xhr(friends_timeline_url, { 
	    callback: function () { render_tweets(container_id, this.responseText); },
			headers: [{name:"Authorization", value: "Basic " + btoa(user + ":" + passw)}]
        }
    );
}

var render_tweets = function(container_id, new_tweets) {
	var tweetstream = eval(new_tweets);

	for (var i=0; i < tweetstream.length; i++) {

		x$("#content").bottom(format_tweet({
            profile_image:tweetstream[i].user.profile_image_url,
            user_name:tweetstream[i].user.name,
            tweet_text:tweetstream[i].text
            }));
	}
}

var format_tweet = function(options) {
	var tweetstring = "<div class='tweet'><img src='{PROFILE_IMAGE}' /><p class='user_name'>{USER_NAME}</p><p class='tweet_text'>{TWEET_TEXT}</p></div>";
	tweetstring = tweetstring.replace("{PROFILE_IMAGE}",options.profile_image);
	tweetstring = tweetstring.replace("{USER_NAME}",options.user_name);
	tweetstring = tweetstring.replace("{TWEET_TEXT}",options.tweet_text);
	return tweetstring;
}









x$.data = {
    m_user : "rob_ellis",
    m_pass : "password"
};
