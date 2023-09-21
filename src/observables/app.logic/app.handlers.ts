import { AppComponent } from "../../components/app.component";
import { Opponent } from "../../models/opponent";
import { CLASS_NAMES, POINTS } from "../../utilities/constants";
import { showElement } from "../../utilities/helpers";
import { getChangeDifficultyObs, getGoToPickerObs, getOppponentObs, getRestartPointsObs } from "./app.observables";

export function changeDifficultyHandler(app: AppComponent){
    getChangeDifficultyObs(app).subscribe(
        ([eventChange, difficultySelects]) => {
            let selectedValue = (eventChange.target as HTMLSelectElement).value;
            difficultySelects.forEach((difficultySelect) => difficultySelect.value = selectedValue)
        });
}

export function restartPointsHandler(app: AppComponent){
    getRestartPointsObs(app).subscribe(
        () => app.setPoints(POINTS.INITIAL)
    );
}

export function goToPickerHandler(app: AppComponent){
    getGoToPickerObs(app).subscribe(() => {
        showElement(app.getElement(CLASS_NAMES.MAIN_SCOREBOARD));
        app.enableTabs(CLASS_NAMES.TABS.NAV_LINKS.PICKER);
        app.disableTabs(CLASS_NAMES.TABS.NAV_LINKS.START);
        app.activateTab(CLASS_NAMES.TABS.NAV_LINKS.PICKER, CLASS_NAMES.TABS.PANES.PICKER);
    });
}

export function getOpponentHandler(app: AppComponent){
    getOppponentObs(app).subscribe((opponent: Opponent) => app.setOpponent(opponent));
}








