import { Orchestrator } from "@holochain/tryorama";

import shiraz_game from './binering/shiraz/game';

let orchestrator: Orchestrator<any>;

orchestrator = new Orchestrator();
shiraz_game(orchestrator);
orchestrator.run();



