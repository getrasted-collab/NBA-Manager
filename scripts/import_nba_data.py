import json
from pathlib import Path

from nba_api.stats.endpoints import commonallplayers, leaguedashplayerstats
from nba_api.stats.static import teams


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
SEASON = "2025-26"


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def compact_js(value):
    payload = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return f"window.nbaLocalData={payload};\n"


def load_teams():
    return [
        {
            "id": team["id"],
            "fullName": team["full_name"],
            "abbreviation": team["abbreviation"],
            "nickname": team["nickname"],
            "city": team["city"],
            "state": team["state"],
            "yearFounded": team["year_founded"],
        }
        for team in teams.get_teams()
    ]


def load_players():
    frame = commonallplayers.CommonAllPlayers(is_only_current_season=0).get_data_frames()[0]
    return [
        {
            "id": int(row.PERSON_ID),
            "fullName": str(row.DISPLAY_FIRST_LAST),
            "isActive": bool(row.ROSTERSTATUS),
        }
        for row in frame.itertuples(index=False)
    ]


def normalize_record(row):
    record = {}
    for key, value in row.items():
        try:
            if hasattr(value, "item"):
                value = value.item()
        except ValueError:
            pass
        record[key] = value
    return record


def load_player_stats():
    frame = leaguedashplayerstats.LeagueDashPlayerStats(
        season=SEASON,
        season_type_all_star="Regular Season",
        per_mode_detailed="PerGame",
    ).get_data_frames()[0]
    return [normalize_record(row) for row in frame.to_dict(orient="records")]


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    dataset = {
        "teams": load_teams(),
        "players": load_players(),
        "playerStats": load_player_stats(),
    }

    write_json(DATA_DIR / "teams.json", dataset["teams"])
    write_json(DATA_DIR / "players.json", dataset["players"])
    write_json(DATA_DIR / "playerStats.json", dataset["playerStats"])
    (DATA_DIR / "game-data.js").write_text(compact_js(dataset), encoding="utf-8")

    print(
        f"Wrote {len(dataset['teams'])} teams, "
        f"{len(dataset['players'])} players, and "
        f"{len(dataset['playerStats'])} player stat rows."
    )


if __name__ == "__main__":
    main()
