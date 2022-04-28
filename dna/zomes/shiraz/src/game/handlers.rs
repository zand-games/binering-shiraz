use hdk::prelude::*;
use hdk::prelude::holo_hash::*;
use super::Game;

#[hdk_extern]
pub fn get_game(entry_hash: EntryHashB64) -> ExternResult<Option<Game>> {
  let maybe_element = get(EntryHash::from(entry_hash), GetOptions::default())?;

  match maybe_element {
    None => Ok(None),
    Some(element) => {
      let game: Game = element.entry()
        .to_app_option()?
        .ok_or(WasmError::Guest("Could not deserialize element to Game.".into()))?;
    
      Ok(Some(game))
    }
  }
}


#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewGameOutput {
  header_hash: HeaderHashB64,
  entry_hash: EntryHashB64,
}

#[hdk_extern]
pub fn create_game(game: Game) -> ExternResult<NewGameOutput> {
  let header_hash = create_entry(&game)?;

  let entry_hash = hash_entry(&game)?;

  let output = NewGameOutput {
    header_hash: HeaderHashB64::from(header_hash),
    entry_hash: EntryHashB64::from(entry_hash)
  };

  Ok(output)
}


#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UpdateGameInput {
  original_header_hash: HeaderHashB64,
  updated_game: Game
}

#[hdk_extern]
pub fn update_game(input: UpdateGameInput) -> ExternResult<NewGameOutput> {
  let header_hash = update_entry(HeaderHash::from(input.original_header_hash), &input.updated_game)?;

  let entry_hash = hash_entry(&input.updated_game)?;

  let output = NewGameOutput {
    header_hash: HeaderHashB64::from(header_hash),
    entry_hash: EntryHashB64::from(entry_hash)
  };

  Ok(output)
}


#[hdk_extern]
pub fn delete_game(header_hash: HeaderHashB64) -> ExternResult<HeaderHash> {
  delete_entry(HeaderHash::from(header_hash))
}

