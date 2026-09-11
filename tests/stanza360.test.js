import test from "node:test";
import assert from "node:assert/strict";
import { calculateRoomCompatibility, isRoomReady, normalizeRoom } from "../src/lib/stanza360.js";

const first={qualities_offered:["sincero","affidabile","curioso","ironico","paziente"],qualities_sought:["empatico","leale","romantico","responsabile","calmo"],imperfections:["testardo"],imperfections_accepted:["timido"]};
const second={qualities_offered:["empatico","leale","romantico","responsabile","calmo"],qualities_sought:["sincero","affidabile","curioso","ironico","paziente"],imperfections:["timido"],imperfections_accepted:["testardo"]};

test("a room requires exactly five offered and five sought qualities",()=>{assert.equal(isRoomReady(first),true);assert.equal(isRoomReady({...first,qualities_sought:["leale"]}),false);});
test("a fully reciprocal room produces an explainable score",()=>{const result=calculateRoomCompatibility(first,second);assert.equal(result.score,100);assert.equal(result.opens,true);assert.equal(result.sharedQualities.length,10);});
test("the room stays closed below fifty percent",()=>{const other=normalizeRoom({...second,qualities_offered:["altruista","coraggioso","determinato","indipendente","socievole"],qualities_sought:["altruista","coraggioso","determinato","indipendente","socievole"],imperfections_accepted:[]});const result=calculateRoomCompatibility(first,other);assert.equal(result.score,10);assert.equal(result.opens,false);});
test("fifty percent is sufficient but never fabricated",()=>{const boundary={qualities_offered:["empatico","leale","romantico","coraggioso","determinato"],qualities_sought:["sincero","affidabile","altruista","coraggioso","determinato"],imperfections:["timido"],imperfections_accepted:[]};const result=calculateRoomCompatibility(first,boundary);assert.equal(result.score,50);assert.equal(result.opens,true);});
