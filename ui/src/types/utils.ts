import { GameStore } from '../components/binering/store';
import { Game } from './binering/Game';

export interface CardInfo {
  playerId?: number;
  deckId?: string;
  value?: boolean;
  dataIsValid: boolean;
}
export function parseCardInfo(input: string): CardInfo {
  const data: string[] = input.toString().split('||');
  var result: CardInfo = {
    dataIsValid: false,
  };
  if (data.length < 3) {
    const result: CardInfo = {
      dataIsValid: false,
    };
  } else {
    result.playerId = Number(data[0]);
    result.value = data[1].toLowerCase() == 'one' ? true : false;
    result.deckId = data[2];
    result.dataIsValid = true;
  }
  return result;
}

export function messageBox(val: string) {
  document.dispatchEvent(new CustomEvent('msg-event', { detail: val }));
}

export async function find_location(game: Game) {
  var bdcApi: string =
    'https://api.bigdatacloud.net/data/reverse-geocode-client';

  var google: string = 'http://maps.google.com/maps?z=20&q=';
  //http://maps.google.com/maps?q=24.197611,120.780512
  //24.197611,120.780512
  var lat = '';
  var long = '';
  if (game.players[1].isLatitute) {
    lat = game.players[1].get_location();
    long = game.players[2].get_location();
  } else {
    lat = game.players[2].get_location();
    long = game.players[1].get_location();
  }
  var bdcApi: string = bdcApi + '?latitude=' + lat + '&longitude=' + long;
  +'&localityLanguage=en';
  //console.log('api:' + bdcApi);
  var location = await getApi(bdcApi);
  google = google + lat + ',' + long;
  GameStore.update(val => {
    val.location = location;
    val.locationUrl = google;
    val.coordination = lat + ',' + long;
    return val;
  });
}

async function getApi(url: string) {
  let response = await fetch(url);
  const result = await response.json();
  //console.log(result);
  var loc = '';
  var output = [];
  if (result['continent']) output.push(result['continent']);

  if (result['countryName']) loc += output.push(result['countryName']);

  if (result['locality']) loc += output.push(result['locality']);

  loc = output.join(', ');
  return loc;
}
