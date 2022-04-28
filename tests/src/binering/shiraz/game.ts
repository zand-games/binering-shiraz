
import { Orchestrator, Player, Cell } from "@holochain/tryorama";
import { config, installation, sleep } from '../../utils';

export default (orchestrator: Orchestrator<any>) =>  {
  
  orchestrator.registerScenario("game CRUD tests", async (s, t) => {
    // Declare two players using the previously specified config, nicknaming them "alice" and "bob"
    // note that the first argument to players is just an array conductor configs that that will
    // be used to spin up the conductor processes which are returned in a matching array.
    const [alice_player, bob_player]: Player[] = await s.players([config, config]);

    // install your happs into the conductors and destructuring the returned happ data using the same
    // array structure as you created in your installation array.
    const [[alice_happ]] = await alice_player.installAgentsHapps(installation);
    const [[bob_happ]] = await bob_player.installAgentsHapps(installation);

    await s.shareAllNodes([alice_player, bob_player]);

    const alice = alice_happ.cells.find(cell => cell.cellRole.includes('/binering.dna')) as Cell;
    const bob = bob_happ.cells.find(cell => cell.cellRole.includes('/binering.dna')) as Cell;

    const entryContents = {
  "title": "directed windows look",
  "content": "And the clock is ticking. I've crashed into a beet truck. We gotta burn the rain forest, dump toxic waste, pollute the air, and rip up the OZONE!"
};

    // Alice creates a game
    const create_output = await alice.call(
        "shiraz",
        "create_game",
        entryContents
    );
    t.ok(create_output.headerHash);
    t.ok(create_output.entryHash);

    await sleep(200);
    
    // Bob gets the created game
    const entry = await bob.call("shiraz", "get_game", create_output.entryHash);
    t.deepEqual(entry, entryContents);
    
    
    // Alice updates the game
    const update_output = await alice.call(
      "shiraz",
      "update_game",
      {
        originalHeaderHash: create_output.headerHash,
        updatedGame: {
          "title": "was obsessed somebody",
  "content": "I gave it a cold? Remind me to thank John for a lovely weekend. A computer virus."
}
      }
    );
    t.ok(update_output.headerHash);
    t.ok(update_output.entryHash);
    await sleep(200);

      
    
    // Alice delete the game
    await alice.call(
      "shiraz",
      "delete_game",
      create_output.headerHash
    );
    await sleep(200);

    
    // Bob tries to get the deleted game, but he doesn't get it because it has been deleted
    const deletedEntry = await bob.call("shiraz", "get_game", create_output.entryHash);
    t.notOk(deletedEntry);
      
  });

}
