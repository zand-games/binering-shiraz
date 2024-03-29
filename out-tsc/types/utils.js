import { GameStore } from '../components/binering/store';
export function parseCardInfo(input) {
    const data = input.toString().split('||');
    var result = {
        dataIsValid: false,
    };
    if (data.length < 3) {
        const result = {
            dataIsValid: false,
        };
    }
    else {
        result.playerId = Number(data[0]);
        result.value = data[1].toLowerCase() == 'one' ? true : false;
        result.deckId = data[2];
        result.dataIsValid = true;
    }
    return result;
}
export function messageBox(val) {
    document.dispatchEvent(new CustomEvent('msg-event', { detail: val }));
}
export async function find_location_old(game) {
    var bdcApi = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
    var google = 'http://maps.google.com/maps?z=20&q=';
    //http://maps.google.com/maps?q=24.197611,120.780512
    //24.197611,120.780512
    var lat = '';
    var long = '';
    if (game.players[1].isLatitute) {
        lat = game.players[1].get_location();
        long = game.players[2].get_location();
    }
    else {
        lat = game.players[2].get_location();
        long = game.players[1].get_location();
    }
    //debugger;
    var bdcApi = bdcApi + '?latitude=' + lat + '&longitude=' + long;
    +'&localityLanguage=en';
    //console.log('api:' + bdcApi);
    // var location = await getApi(bdcApi);
    //get_wiki_location(lat, long);
    google = google + lat + ',' + long;
    GameStore.update(val => {
        //val.location = location;
        val.locationUrl = google;
        val.coordination = lat + ',' + long;
        return val;
    });
}
async function getApi(url) {
    let response = await fetch(url);
    const result = await response.json();
    //console.log(result);
    var loc = '';
    var output = [];
    if (result['continent'])
        output.push(result['continent']);
    if (result['countryName'])
        loc += output.push(result['countryName']);
    if (result['locality'])
        loc += output.push(result['locality']);
    loc = output.join(', ');
    return loc;
}
function get_wiki_location(lat, long) {
    var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gsradius=1000&gscoord=';
    url += lat.trim() + '|' + long.trim() + '&origin=*';
    console.log(url);
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {},
    })
        .then(response => response.json())
        .then(data => {
        console.log(data);
    })
        .catch(function (err) {
        console.log(err);
    });
}
//# sourceMappingURL=utils.js.map