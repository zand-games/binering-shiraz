use hdk::prelude::*;





#[hdk_entry(id = "game")]
#[serde(rename_all = "camelCase")]
#[derive(Clone)]
pub struct Game {
  pub title: String,
  pub content: String,
}