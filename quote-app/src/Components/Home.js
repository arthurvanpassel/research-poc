import React, { Component } from 'react';
import YouTube from 'react-youtube';
import YTSearch from '../YoutubeGet';

var XMLParser = require('react-xml-parser');
var unirest = require('unirest');
const API_KEY = "AIzaSyCihRFXV6AhBnFbjVpFJXrGkATTDYSHk1I";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Arthur",
            value: '',
            movie: "",
            videos: [],
            videoId: "",
            videoTitle: "",
            transcript: {},
            i: 0,
            start: 0,
            movies: []
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
        var term = this.state.value.toLowerCase();
        var array = term.split(" ");

        var search_terms = ['is', 'a', 'of', 'was', 'the'];

        for (var i=array.length-1; i>=0; i--) {
            for (var j=0; j<search_terms.length; j++)
                if (array[i] === search_terms[j]) {
                    array.splice(i, 1);
                    // break;       //<-- Uncomment  if only the first term has to be removed
                }
        }

        var newTerm = array.join('+')
        this.state.i = 0;

        let data = [];

        unirest.get("https://juanroldan1989-moviequotes-v1.p.mashape.com/api/v1/quotes?content="+newTerm)
        .header("X-Mashape-Key", "E6Wd4uWlmumshKcbfjazXkl6cA9ip1ak7kejsnECYSpm9WLsmf")
        .header("Authorization", "Token token=lXIGOsl1thPFhZeZJHVaxQtt")
        .header("Accept", "text/plain")
        .end((result) => {
        console.log(result.body);  
        data = result.body;
        this.state.movies = data;   
        this.getMovie();   
        });
    }

    getMovie() {
        var term = this.state.value.toLowerCase();
        var array = term.split(" ");

        var search_terms = ['is', 'a', 'of', 'was', 'the'];

        for (var i=array.length-1; i>=0; i--) {
            for (var j=0; j<search_terms.length; j++)
                if (array[i] === search_terms[j]) {
                    array.splice(i, 1);
                    // break;       //<-- Uncomment  if only the first term has to be removed
                }
        }

        var newTerm = array.join('+')

        var bestResultLevel = 0;
        var bestResult = [];
        var movies = this.state.movies;
        for (let i=0; i < movies.length; i++) {
            var string = movies[i].content.toLowerCase()

            console.log(string);
            if (string.includes(array[0])) {
                if (bestResultLevel<1) {
                    bestResult = movies[i];
                    bestResultLevel = 1;
                }
                console.log('word 1 in answer ' + i)                
                if (string.includes(array[1]) || string.includes(array[2])) {
                    if (bestResultLevel<2) {
                        bestResult = movies[i];
                        bestResultLevel = 2;
                    }
                    console.log('word 2 or 3 in answer ' + i)
                    if (string.includes(array[3]) || string.includes(array[4])) {
                        if (bestResultLevel<3) {
                            bestResult = movies[i];
                            bestResultLevel = 3;
                        }
                        console.log('word 4 or 5 in answer ' + i)
                        if (string.includes(array[5]) || string.includes(array[6])) {
                            if (bestResultLevel<4) {
                                bestResult = movies[i];
                                bestResultLevel = 4;
                            }
                            console.log('word 6 or 7 in answer ' + i)
                        }
                    }

                }
                else {
                    // console.log('rest of string not in caption');
                }
            } else {
                // console.log('word 1 not in answer ' + i)
                //Not in the array
            }
        }
        console.log(bestResult);
        this.state.movie = bestResult.movie.title

        this.getSearch();
    }

    getSearch() {
        var term = this.state.value + " " + this.state.movie;
        
        YTSearch({type: 'video', key: API_KEY, term: term, maxResults: 10}, (data) =>{
            console.log(data);
            this.state.videos = data;
            this.state.videoId = data[0].id.videoId;
            this.state.videoTitle = data[0].snippet.title;
            
            this.getSubs();
         });
            // this.state.videoId = "LTXYjAOCY2Q";
            // this.getSubs();
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
                console.log('video ' +this.state.i+ ' no transcript');
                this.state.i = this.state.i + 1;
                var j = this.state.i;
                this.state.videoId = this.state.videos[j].id.videoId;
                this.state.videoTitle = this.state.videos[j].snippet.title;
                this.getSubs();
            }
            else {
                this.getVideoStart()
            }
         });

        // getSubtitles({
        //     videoID: "pUaxXsqGeFI"
        // }).then(function(captions) {
        //     console.log(captions);
        //   });
        // this.getVideo();

    }

    getVideoStart() {
        console.log("get start of video");
        var captions = this.state.transcript.children;
        console.log(captions);
        var term = this.state.value.toLowerCase();
        var array = term.split(" ");

        var search_terms = ['is', 'a', 'of', 'was', 'the'];

        // for (var i=array.length-1; i>=0; i--) {
        //     for (var j=0; j<search_terms.length; j++)
        //         if (array[i] === search_terms[j]) {
        //             array.splice(i, 1);
        //             // break;       //<-- Uncomment  if only the first term has to be removed
        //         }
        // }

        console.log(array);

        var bestResultLevel = 0;
        var resultLevel = 0;
        var bestResult = [];
        
        for (let i=0; i < captions.length; i++) {
            var string = captions[i].value.toLowerCase()
            resultLevel = 0;
            console.log(string);
            for (let j=0; j < array.length; j++) {
                if (string.includes(array[j])) {
                    resultLevel++;
                    console.log("word "+j+" in caption")
                }
                if (resultLevel>bestResultLevel) {
                    bestResult = captions[i];
                    bestResultLevel = resultLevel;
                    console.log("caption "+i+" is the best caption")
                }
            }
        }
        if (bestResultLevel == 0) {
            console.log('video ' +this.state.i+ ' wrong transcript');
            this.state.i = this.state.i + 1;
            var j = this.state.i;
            this.state.videoId = this.state.videos[j].id.videoId;
            this.state.videoTitle = this.state.videos[j].snippet.title;
            this.getSubs();
        }
        else {
            console.log(bestResult.attributes.start)
            var start = parseInt(bestResult.attributes.start);
            this.state.start = start;
            this.getVideo();
        }
        
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
                start: this.state.start
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

