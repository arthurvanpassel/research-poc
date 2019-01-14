import React, { Component } from 'react';
import YouTube from 'react-youtube';
import YTSearch from '../YoutubeGet';
import { getSubtitles } from 'youtube-captions-scraper';

var XMLParser = require('react-xml-parser');
var unirest = require('unirest');
const API_KEY = "AIzaSyCihRFXV6AhBnFbjVpFJXrGkATTDYSHk1I";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Arthur",
            value: '',
            videos: [],
            videoId: "",
            videoTitle: "",
            transcript: {},
            i: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        console.log(this.state);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        // console.log(this.state.value);
      }

    handleSubmit(event) {
        event.preventDefault();
        var term = this.state.value;
        this.state.i = 0;
        // unirest.get("https://juanroldan1989-moviequotes-v1.p.mashape.com/api/v1/quotes?actor=Al+Pacino")
        // .header("X-Mashape-Key", "E6Wd4uWlmumshKcbfjazXkl6cA9ip1ak7kejsnECYSpm9WLsmf")
        // .header("Authorization", "Token token=yd8WzkWNEEzGtqMSgiZBrwtt")
        // .header("Accept", "text/plain")
        // .end(function (result) {
        // alert(result.status, result.headers, result.body);
        // });
        YTSearch({type: 'video', key: API_KEY, term: term, maxResults: 5}, (data) =>{
            console.log(data);
            this.state.videos = data;
            this.state.videoId = data[0].id.videoId;
            this.state.videoTitle = data[0].snippet.title;
            
            this.getSubs();
         });
         
    }

    getSubs() {

        // https://www.youtube.com/api/timedtext?asr_langs=es%2Cit%2Cfr%2Cru%2Cde%2Cko%2Cpt%2Cen%2Cnl%2Cja&v=T9j7kLG7VK8&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&key=yttt1&expire=1547475109&signature=1FFD4CE587B727139D70D6938BCA97D555391559.0E971768C163FB69A7FD26DD5A6F605761F34D94&hl=nl&caps=asr&lang=en&fmt=srv3
        // https://www.youtube.com/api/timedtext?asr_langs=pt%2Cit%2Cnl%2Cru%2Ces%2Cen%2Cfr%2Cja%2Cko%2Cde&caps=asr&key=yttt1&hl=nl&signature=B324EA25EDF7E8C80DF280043CF77E77956FB590.EFE6AEF28C2666111B1EF7840162E9A3D7200328&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&v=bFyJRu0Y5Zc&expire=1547475939&kind=asr&lang=en&fmt=srv3

        console.log('subs');
        YTSearch({type: 'caption', id: this.state.videoId, key: API_KEY}, (data) =>{
            var xml = new XMLParser().parseFromString(data);    // Assume xmlText contains the example XML
            this.state.transcript = xml;
            console.log(xml);
            
            if (xml == undefined && this.state.i < 4) {
                console.log('first video no transcript');
                this.state.i = this.state.i + 1;
                var j = this.state.i;
                this.state.videoId = this.state.videos[j].id.videoId;
                this.state.videoTitle = this.state.videos[j].snippet.title;
                this.getSubs();
            }

            this.getVideo()
         });

        // getSubtitles({
        //     videoID: "pUaxXsqGeFI"
        // }).then(function(captions) {
        //     console.log(captions);
        //   });
        // this.getVideo();

    }

    getVideo() {
        this.props.history.push({
            pathname: '/',
            state: {
              videoId: this.state.videoId
             }
          });
          
         console.log(this.state);
         console.log('reload');
    }


    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
                start: 0
            }
        };
        return (
            <div className="App">
                <h1>Hello, {this.state.name}</h1>
                <form onSubmit={this.handleSubmit}>
                    <h3>Fill in a movie quote</h3>
                    <input style={{width: '75%'}} type='text' id='search' placeholder='Search...' value={this.state.value} onChange={this.handleChange}></input>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.videoId? (
                    <YouTube
                    videoId={this.state.videoId}
                    opts={opts}
                    onReady={this._onReady}
                    />
                ) : (
                    <h2>No video yet</h2>
                )}                
            </div>
        );
    }
}

export default Home;

