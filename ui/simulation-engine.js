(function exposeNbaSimulationEngine(root, factory) {
  const api = factory();
  if (root) root.NBASimulationEngine = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEngineApi() {
  "use strict";

  const VERSION = 2;
  const SIDES = ["away", "home"];

  function clamp(value, min, max) { return Math.max(min, Math.min(max, Number(value) || 0)); }
  function other(side) { return side === "home" ? "away" : "home"; }
  function clockText(seconds) {
    const value = Math.max(0, Math.round(seconds));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
  }
  function weighted(items, weight, rng) {
    if (!items.length) return null;
    const weights = items.map((item) => Math.max(0.001, Number(weight(item)) || 0.001));
    let roll = rng() * weights.reduce((sum, value) => sum + value, 0);
    for (let index = 0; index < items.length; index += 1) {
      roll -= weights[index];
      if (roll <= 0) return items[index];
    }
    return items.at(-1);
  }
  function seededRandom(seed) {
    let value = [...String(seed)].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let next = value;
      next = Math.imul(next ^ next >>> 15, next | 1);
      next ^= next + Math.imul(next ^ next >>> 7, next | 61);
      return ((next ^ next >>> 14) >>> 0) / 4294967296;
    };
  }

  function lineFromPlayer(player, desiredMinutes) {
    return {
      playerId: player.id, name: player.name, pos: player.pos || "G/F", desiredMinutes,
      ovr: Number(player.ovr || player.overall || 70), pot: Number(player.pot || 70),
      three: Number(player.three || 70), mid: Number(player.mid || 70), rim: Number(player.rim || 70),
      pass: Number(player.pass || 70), def: Number(player.def || 70), stamina: Number(player.stamina || 75),
      durability: Number(player.durability || 75), fatigueStart: Number(player.fatigue || 0),
      seconds: 0, fgm: 0, fga: 0, threePm: 0, threePa: 0, ftm: 0, fta: 0,
      pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, tov: 0, pf: 0, plusMinus: 0,
      injured: false, fouledOut: false
    };
  }

  function normalizeRotation(players) {
    const available = players.filter((player) => Number(player.injury || 0) <= 0 && player.activeRoster !== false);
    const source = (available.some((player) => Number(player.minutes) > 0)
      ? available.filter((player) => Number(player.minutes) > 0)
      : available.sort((a, b) => Number(b.ovr || b.overall) - Number(a.ovr || a.overall)).slice(0, 10));
    const total = source.reduce((sum, player) => sum + Math.max(1, Number(player.minutes || 0)), 0) || 1;
    return source.map((player) => lineFromPlayer(player, Math.max(1, Number(player.minutes || 0)) / total * 240));
  }

  function initialLineup(lines) {
    return [...lines].sort((a, b) => b.desiredMinutes - a.desiredMinutes || b.ovr - a.ovr).slice(0, 5).map((line) => line.playerId);
  }

  function createGameState(config) {
    const rng = typeof config.rng === "function" ? config.rng : Math.random;
    const boxScore = {
      away: normalizeRotation(config.rosters.away || []),
      home: normalizeRotation(config.rosters.home || [])
    };
    const state = {
      version: VERSION,
      gameId: config.game?.id || `game-${Date.now()}`,
      homeId: config.game?.home || config.teams.home?.id,
      awayId: config.game?.away || config.teams.away?.id,
      teams: config.teams,
      profiles: config.profiles || {},
      strategies: {
        away: { ...(config.plans?.away || {}) },
        home: { ...(config.plans?.home || {}) }
      },
      boxScore,
      lineups: { away: initialLineup(boxScore.away), home: initialLineup(boxScore.home) },
      manualLocks: { away: 0, home: 0 },
      period: 1,
      seconds: 720,
      clock: "12:00",
      possessionSide: rng() < 0.5 ? "away" : "home",
      homeScore: 0,
      awayScore: 0,
      periodScores: [{ away: 0, home: 0 }],
      overtimeCount: 0,
      teamFouls: { away: 0, home: 0 },
      timeouts: { away: 7, home: 7 },
      teamStats: {
        away: teamStatLine(), home: teamStatLine()
      },
      injuries: [],
      processedEvents: [],
      eventIndex: 0,
      completed: false,
      totalPossessions: 0,
      run: { side: null, points: 0 },
      rng
    };
    autoSubstitute(state, "away", true);
    autoSubstitute(state, "home", true);
    return state;
  }

  function teamStatLine() {
    return { possessions: 0, fgm: 0, fga: 0, threePm: 0, threePa: 0, ftm: 0, fta: 0, oreb: 0, dreb: 0, ast: 0, stl: 0, blk: 0, tov: 0, pf: 0 };
  }

  function activeLines(state, side) {
    const ids = new Set(state.lineups[side]);
    return state.boxScore[side].filter((line) => ids.has(line.playerId));
  }

  function lineFatigue(line) {
    const load = line.seconds / 60 / Math.max(8, line.desiredMinutes);
    return clamp(line.fatigueStart / 140 + Math.max(0, load - 0.65) * (105 - line.stamina) / 35, 0, 0.32);
  }

  function autoSubstitute(state, side, force = false) {
    if (!force && state.manualLocks[side] > 0) { state.manualLocks[side] -= 1; return; }
    const periodLength = state.period <= 4 ? 720 : 300;
    const elapsedMinutes = ((Math.min(state.period, 5) - 1) * 12 * 5 + (periodLength - state.seconds) / 60 * 5);
    let eligible = state.boxScore[side].filter((line) => !line.injured && !line.fouledOut);
    if (eligible.length < 5) eligible = state.boxScore[side].filter((line) => !line.injured);
    const ranked = eligible.map((line) => {
      const expectedSeconds = Math.max(60, line.desiredMinutes * 60 * (state.period <= 4 ? 1 : (240 + state.overtimeCount * 25) / 240));
      const need = expectedSeconds - line.seconds;
      const closing = state.period >= 4 && state.seconds <= 360 ? line.ovr * 2 : 0;
      return { line, score: need + line.ovr * 9 + closing - lineFatigue(line) * 900 + (line.seconds < elapsedMinutes * line.desiredMinutes / 48 ? 160 : 0) };
    }).sort((a, b) => b.score - a.score);
    state.lineups[side] = ranked.slice(0, 5).map((item) => item.line.playerId);
  }

  function chooseShooter(state, side) {
    const plan = state.strategies[side];
    return weighted(activeLines(state, side), (line) => {
      const skill = plan.offense === "perimeter" ? line.three : plan.offense === "rim" ? line.rim : plan.offense === "ball movement" ? line.pass : line.ovr;
      const starUsage = plan.offense === "stars" ? Math.max(0, line.ovr - 75) * 2.2 : 0;
      return Math.max(5, line.ovr + skill * 0.7 + starUsage - lineFatigue(line) * 60);
    }, state.rng);
  }

  function chooseDefender(state, side, shooter) {
    const defenders = activeLines(state, other(side));
    return defenders.find((line) => line.pos?.[0] === shooter?.pos?.[0]) || weighted(defenders, (line) => line.def, state.rng);
  }

  function chooseShotType(state, side, shooter) {
    const plan = state.strategies[side];
    let three = 0.34 + (shooter.three - 72) / 240;
    let rim = 0.38 + (shooter.rim - 72) / 240;
    if (plan.offense === "perimeter") three += 0.2;
    if (plan.offense === "rim") rim += 0.2;
    if (plan.pace === "fast" || plan.transition === "run") rim += 0.05;
    const roll = state.rng();
    if (roll < clamp(three, 0.18, 0.62)) return "three";
    if (roll < clamp(three + rim, 0.55, 0.9)) return "rim";
    return "mid";
  }

  function advanceFloorTime(state, seconds) {
    SIDES.forEach((side) => activeLines(state, side).forEach((line) => { line.seconds += seconds; }));
    state.seconds = Math.max(0, state.seconds - seconds);
    state.clock = clockText(state.seconds);
  }

  function addScore(state, side, points) {
    state[`${side}Score`] += points;
    state.periodScores.at(-1)[side] += points;
    activeLines(state, side).forEach((line) => { line.plusMinus += points; });
    activeLines(state, other(side)).forEach((line) => { line.plusMinus -= points; });
    if (state.run.side === side) state.run.points += points;
    else state.run = { side, points };
  }

  function addAssist(state, side, scorer) {
    if (state.rng() >= 0.61) return null;
    const passer = weighted(activeLines(state, side).filter((line) => line.playerId !== scorer.playerId), (line) => line.pass, state.rng);
    if (passer) { passer.ast += 1; state.teamStats[side].ast += 1; }
    return passer;
  }

  function rebound(state, shootingSide, defender, event) {
    const defenseSide = other(shootingSide);
    const offense = activeLines(state, shootingSide);
    const defense = activeLines(state, defenseSide);
    const offenseRating = offense.reduce((sum, line) => sum + (line.pos.includes("C") ? line.rim : line.ovr * 0.55), 0) / Math.max(1, offense.length);
    const defenseRating = defense.reduce((sum, line) => sum + line.def, 0) / Math.max(1, defense.length);
    const offensive = state.rng() < clamp(0.24 + (offenseRating - defenseRating) / 500, 0.16, 0.34);
    const side = offensive ? shootingSide : defenseSide;
    const rebounder = weighted(activeLines(state, side), (line) => (line.pos.includes("C") ? 115 : line.pos.includes("F") ? 86 : 55) + line.def * 0.35, state.rng);
    if (rebounder) rebounder.reb += 1;
    state.teamStats[side][offensive ? "oreb" : "dreb"] += 1;
    event.reboundId = rebounder?.playerId || null;
    event.text += ` ${rebounder?.name || state.teams[side].abbr} grabs the ${offensive ? "offensive" : "defensive"} rebound.`;
    return offensive ? shootingSide : defenseSide;
  }

  function injuryCheck(state, side) {
    const candidates = activeLines(state, side).filter((line) => !line.injured);
    const player = candidates[Math.floor(state.rng() * candidates.length)];
    if (!player) return null;
    const risk = 0.00008 + Math.max(0, 76 - player.durability) / 160000 + lineFatigue(player) / 1800;
    if (state.rng() >= risk) return null;
    const injuries = [
      ["ankle sprain", 2, 8], ["hamstring strain", 4, 12], ["knee soreness", 1, 6], ["wrist sprain", 2, 7], ["back spasms", 1, 5]
    ];
    const [type, min, max] = injuries[Math.floor(state.rng() * injuries.length)];
    const injury = { side, playerId: player.playerId, name: player.name, type, games: min + Math.floor(state.rng() * (max - min + 1)) };
    player.injured = true;
    state.injuries.push(injury);
    autoSubstitute(state, side, true);
    return injury;
  }

  function intentionalFoul(state, offenseSide) {
    const defenseSide = other(offenseSide);
    const difference = state[`${offenseSide}Score`] - state[`${defenseSide}Score`];
    return state.period >= 4 && state.seconds <= 35 && difference >= 1 && difference <= 10;
  }

  function stepPossession(state) {
    if (!state || state.completed) return null;
    const side = state.possessionSide;
    const defenseSide = other(side);
    autoSubstitute(state, side);
    autoSubstitute(state, defenseSide);
    const shooter = chooseShooter(state, side);
    const defender = chooseDefender(state, side, shooter);
    if (!shooter) { state.completed = true; return null; }
    const pace = state.strategies[side].pace === "fast" ? 4 : state.strategies[side].pace === "slow" ? -3 : 0;
    const elapsed = Math.min(state.seconds, Math.max(4, Math.round(10 + state.rng() * 8 - pace)));
    const event = { period: state.period, quarter: state.period, clock: clockText(Math.max(0, state.seconds - elapsed)), side, points: 0, text: "", scorerId: null, assistId: null, reboundId: null, type: "possession" };
    state.teamStats[side].possessions += 1;
    state.totalPossessions += 1;

    const forcedFoul = intentionalFoul(state, side);
    const offenseProfile = state.profiles[side] || {};
    const defenseProfile = state.profiles[defenseSide] || {};
    const profileEdge = clamp((Number(offenseProfile.efficiency || 1) - Number(defenseProfile.efficiency || 1)) * 0.16, -0.025, 0.025);
    const chemistryEdge = clamp((Number(offenseProfile.chemistry || 72) - 72) / 1600, -0.018, 0.018);
    const tacticalEdge = clamp((Number(offenseProfile.tactical || 0) - Number(defenseProfile.tactical || 0)) / 900, -0.014, 0.014);
    const pressureTurnovers = state.strategies[defenseSide].defense === "pressure" ? 0.012 : 0;
    const turnoverChance = clamp(0.125 - (shooter.pass - 70) / 850 + (defender.def - 72) / 1200 + pressureTurnovers - tacticalEdge * 0.3 + lineFatigue(shooter) * 0.12, 0.075, 0.21);
    if (!forcedFoul && state.rng() < turnoverChance) {
      shooter.tov += 1; state.teamStats[side].tov += 1;
      const steal = state.rng() < clamp(0.53 + (defender.def - 70) / 180, 0.38, 0.76);
      if (steal) { defender.stl += 1; state.teamStats[defenseSide].stl += 1; }
      event.type = "turnover";
      event.text = steal ? `${defender.name} strips ${shooter.name} and forces the turnover.` : `${shooter.name} turns the ball over.`;
      state.possessionSide = defenseSide;
    } else {
      const shotType = chooseShotType(state, side, shooter);
      const shootingFoul = forcedFoul || state.rng() < (shotType === "rim" ? 0.16 : shotType === "three" ? 0.055 : 0.08);
      const nonShootingFoul = !shootingFoul && state.rng() < 0.035;
      if (shootingFoul || nonShootingFoul) {
        const fouler = defender;
        fouler.pf += 1; state.teamStats[defenseSide].pf += 1; state.teamFouls[defenseSide] += 1;
        if (fouler.pf >= 6) { fouler.fouledOut = true; autoSubstitute(state, defenseSide, true); }
        const inBonus = state.teamFouls[defenseSide] >= 5;
        const attempts = nonShootingFoul && !inBonus ? 0 : forcedFoul || nonShootingFoul ? 2 : shotType === "three" ? 3 : 2;
        let made = 0;
        const ftChance = clamp(0.67 + (shooter.mid - 65) / 210, 0.58, 0.94);
        for (let attempt = 0; attempt < attempts; attempt += 1) if (state.rng() < ftChance) made += 1;
        shooter.fta += attempts; shooter.ftm += made; shooter.pts += made;
        state.teamStats[side].fta += attempts; state.teamStats[side].ftm += made;
        addScore(state, side, made);
        event.type = attempts ? "free-throws" : "foul"; event.points = made; event.scorerId = shooter.playerId;
        event.text = attempts ? `${shooter.name} draws the foul and makes ${made} of ${attempts} free throws.` : `${fouler.name} commits a non-shooting foul. ${state.teams[side].abbr} keeps possession.`;
        state.possessionSide = attempts ? defenseSide : side;
        if (!attempts) { state.teamStats[side].possessions -= 1; state.totalPossessions -= 1; }
      } else {
        const skill = shotType === "three" ? shooter.three : shotType === "rim" ? shooter.rim : shooter.mid;
        const base = shotType === "three" ? 0.35 : shotType === "rim" ? 0.57 : 0.43;
        const contest = (defender.def - 72) * (state.strategies[defenseSide].defense === "pressure" ? 0.0031 : 0.0025);
        const home = side === "home" ? 0.008 : 0;
        const chance = clamp(base + (skill - 72) * 0.0034 - contest - lineFatigue(shooter) * 0.18 + home + profileEdge + chemistryEdge + tacticalEdge, 0.22, 0.76);
        const made = state.rng() < chance;
        const points = shotType === "three" ? 3 : 2;
        shooter.fga += 1; state.teamStats[side].fga += 1;
        if (shotType === "three") { shooter.threePa += 1; state.teamStats[side].threePa += 1; }
        if (made) {
          shooter.fgm += 1; shooter.pts += points; state.teamStats[side].fgm += 1;
          if (shotType === "three") { shooter.threePm += 1; state.teamStats[side].threePm += 1; }
          const assister = addAssist(state, side, shooter);
          addScore(state, side, points);
          event.type = "made-shot"; event.points = points; event.scorerId = shooter.playerId; event.assistId = assister?.playerId || null;
          event.text = shotType === "three" ? `${shooter.name} knocks down the three${assister ? ` off ${assister.name}'s pass` : ""}.` : shotType === "rim" ? `${shooter.name} finishes at the rim${assister ? ` on the assist from ${assister.name}` : ""}.` : `${shooter.name} hits the pull-up jumper${assister ? ` from ${assister.name}` : ""}.`;
          state.possessionSide = defenseSide;
        } else {
          if (shotType !== "three" && state.rng() < clamp((defender.def - 65) / 180, 0.02, 0.2)) {
            defender.blk += 1; state.teamStats[defenseSide].blk += 1; event.text = `${defender.name} blocks ${shooter.name}'s attempt.`;
          } else event.text = `${shooter.name} misses the ${shotType === "three" ? "three-pointer" : shotType === "rim" ? "shot at the rim" : "jumper"}.`;
          event.type = "missed-shot"; event.scorerId = shooter.playerId;
          state.possessionSide = rebound(state, side, defender, event);
        }
      }
    }

    advanceFloorTime(state, elapsed);
    const injury = injuryCheck(state, side);
    if (injury) { event.injury = injury; event.text += ` ${injury.name} leaves with a ${injury.type}.`; }
    if (state.run.side === side && state.run.points >= 8 && state.run.points - event.points < 8) event.text += ` ${state.teams[side].abbr} is on an ${state.run.points}-0 run.`;
    maybeCpuTimeout(state, defenseSide, event);
    finishPeriodIfNeeded(state, event);
    state.processedEvents.push({ ...event, homeScore: state.homeScore, awayScore: state.awayScore });
    state.eventIndex += 1;
    return event;
  }

  function maybeCpuTimeout(state, side, event) {
    const userSide = state.userSide;
    if (side === userSide || state.timeouts[side] <= 0) return;
    if (state.run.side === other(side) && state.run.points >= 9 && state.rng() < 0.42) {
      state.timeouts[side] -= 1; state.run = { side: null, points: 0 };
      autoSubstitute(state, side, true);
      event.text += ` ${state.teams[side].abbr} calls timeout.`;
    }
  }

  function finishPeriodIfNeeded(state, event) {
    if (state.seconds > 0) return;
    const tied = state.homeScore === state.awayScore;
    if (state.period >= 4 && !tied) {
      state.completed = true;
      event.text += " Final buzzer.";
      return;
    }
    state.period += 1;
    if (state.period > 4) state.overtimeCount += 1;
    state.seconds = state.period <= 4 ? 720 : 300;
    state.clock = clockText(state.seconds);
    state.periodScores.push({ away: 0, home: 0 });
    state.teamFouls = { away: 0, home: 0 };
    if (state.period > 4) {
      state.timeouts.away += 2; state.timeouts.home += 2;
      event.text += " Overtime is next.";
    } else event.text += ` End of the ${state.period - 1 === 1 ? "1st" : state.period - 1 === 2 ? "2nd" : "3rd"} quarter.`;
    autoSubstitute(state, "away", true); autoSubstitute(state, "home", true);
  }

  function runGameToCompletion(state, maxSteps = 800) {
    let steps = 0;
    while (!state.completed && steps < maxSteps) { stepPossession(state); steps += 1; }
    if (!state.completed) throw new Error("Simulation exceeded its possession safety limit.");
    return state;
  }

  function callTimeout(state, side) {
    if (!state || state.completed || state.timeouts[side] <= 0) return null;
    state.timeouts[side] -= 1;
    state.run = { side: null, points: 0 };
    state.manualLocks[side] = 2;
    const event = { period: state.period, quarter: state.period, clock: state.clock, side: null, points: 0, type: "timeout", text: `${state.teams[side].abbr} calls timeout.`, homeScore: state.homeScore, awayScore: state.awayScore };
    state.processedEvents.push(event); state.eventIndex += 1;
    return event;
  }

  function substitute(state, side, outgoingId, incomingId) {
    const outgoing = state?.lineups?.[side]?.find((id) => String(id) === String(outgoingId));
    const incomingKey = state?.boxScore?.[side]?.find((line) => String(line.playerId) === String(incomingId))?.playerId;
    if (!state || state.completed || outgoing === undefined || state.lineups[side].some((id) => String(id) === String(incomingKey))) return false;
    const incoming = state.boxScore[side].find((line) => String(line.playerId) === String(incomingKey) && !line.injured && !line.fouledOut);
    if (!incoming) return false;
    state.lineups[side] = state.lineups[side].map((id) => String(id) === String(outgoing) ? incoming.playerId : id);
    state.manualLocks[side] = 5;
    return true;
  }

  function applyLineupPreset(state, side, preset) {
    if (!state || state.completed) return false;
    let lines = state.boxScore[side].filter((line) => !line.injured && !line.fouledOut);
    if (lines.length < 5) lines = state.boxScore[side].filter((line) => !line.injured);
    const score = (line) => preset === "shooting" ? line.three + line.pass * 0.3 : preset === "defense" ? line.def + line.ovr * 0.25 : preset === "bench" ? -line.seconds + line.desiredMinutes * 30 : line.ovr;
    state.lineups[side] = [...lines].sort((a, b) => score(b) - score(a)).slice(0, 5).map((line) => line.playerId);
    state.manualLocks[side] = 6;
    return state.lineups[side].length === 5;
  }

  function setStrategy(state, side, key, value) {
    const allowed = { pace: ["slow", "balanced", "fast"], offense: ["balanced", "rim", "perimeter", "stars", "ball movement"], defense: ["drop", "switch", "pressure", "zone"] };
    if (!allowed[key]?.includes(value)) return false;
    state.strategies[side][key] = value;
    return true;
  }

  function allocateMinutes(lines, target) {
    const total = lines.reduce((sum, line) => sum + line.seconds, 0) || 1;
    const raw = lines.map((line) => line.seconds / total * target);
    const minutes = raw.map(Math.floor);
    let remainder = target - minutes.reduce((sum, value) => sum + value, 0);
    raw.map((value, index) => ({ index, fraction: value - Math.floor(value) })).sort((a, b) => b.fraction - a.fraction).slice(0, remainder).forEach(({ index }) => { minutes[index] += 1; });
    return minutes;
  }

  function finalizedBoxScore(state, side) {
    const target = 240 + state.overtimeCount * 25;
    const minutes = allocateMinutes(state.boxScore[side], target);
    return state.boxScore[side].map((line, index) => ({
      playerId: line.playerId, name: line.name, pos: line.pos, min: minutes[index],
      fgm: line.fgm, fga: line.fga, threePm: line.threePm, threePa: line.threePa,
      ftm: line.ftm, fta: line.fta, pts: line.pts, reb: line.reb, ast: line.ast,
      stl: line.stl, blk: line.blk, tov: line.tov, pf: line.pf, plusMinus: line.plusMinus
    }));
  }

  function toResult(state) {
    const teamStats = Object.fromEntries(SIDES.map((side) => [side, {
      ...state.teamStats[side],
      points: state[`${side}Score`],
      rebounds: state.teamStats[side].oreb + state.teamStats[side].dreb
    }]));
    return {
      simulationVersion: VERSION,
      homeScore: state.homeScore, awayScore: state.awayScore,
      periodScores: state.periodScores.map((period) => ({ ...period })),
      overtimePeriods: state.overtimeCount,
      pace: Math.round(state.totalPossessions / 2),
      teamStats,
      playerStats: { away: finalizedBoxScore(state, "away"), home: finalizedBoxScore(state, "home") },
      injuries: state.injuries.map((injury) => ({ ...injury }))
    };
  }

  return { VERSION, createGameState, stepPossession, runGameToCompletion, callTimeout, substitute, applyLineupPreset, setStrategy, toResult, seededRandom, clockText };
});
