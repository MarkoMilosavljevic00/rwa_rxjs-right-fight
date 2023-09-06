import { Corner, mapStringToCorner } from "../enums/corner.enum";
import { Message } from "../enums/message.enum";
import { Method } from "../enums/method.enum";
import { Rules } from "../enums/rules.enum";
import { Fight } from "../models/fight";
import { FightCard } from "../models/fightCard";
import { Fighter } from "../models/fighter";
import { Result } from "../models/result";
import { CLASS_NAMES, TYPE_OF_ELEMENTS } from "../utilities/constants";
import { PATHS } from "../utilities/constants";
import { getCheckedRadioValue, getSelectedValue, mapStringToEnum, selectElementByClass, selectElementByClassAndType, selectElementsByBeginOfClass, selectElementsByClass, selectElementsByPartialClass, showError } from "../utilities/helpers";

export class PickerComponent{
    fightCard: FightCard;
    numberOfFights: number = 0;
    currentRedCorner: Fighter;
    currentBlueCorner: Fighter;
    container: HTMLElement;

    constructor(fightCard: FightCard){
        this.fightCard = fightCard;
        this.container = selectElementByClass(document.body, CLASS_NAMES.CONTAINERS.PICKER)
    }

    setFighter(fighter: Fighter, corner: Corner){
        let cornerImg: HTMLImageElement;
        let skillBars: NodeListOf<HTMLElement>;
        let winnerLabel: HTMLLabelElement; 

        if(corner == Corner.RedCorner){
            this.currentRedCorner = fighter;
            cornerImg = selectElementByClass(this.container, CLASS_NAMES.IMAGES.RED_CORNER) as HTMLImageElement
            skillBars = selectElementsByClass(this.container, CLASS_NAMES.SKILL_BARS.RED_CORNER);
            winnerLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.RED_CORNER_WINNER) as HTMLLabelElement;
        }
        else{
            this.currentBlueCorner = fighter;
            cornerImg = selectElementByClass(this.container, CLASS_NAMES.IMAGES.BLUE_CORNER) as HTMLImageElement
            skillBars = selectElementsByClass(this.container, CLASS_NAMES.SKILL_BARS.BLUE_CORNER);
            winnerLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.BLUE_CORNER_WINNER) as HTMLLabelElement;
        }
        cornerImg.src =`${PATHS.IMAGES.FIGHTERS + fighter.pictureSrc}` ;
        winnerLabel.innerHTML = fighter.name;

        let skills = fighter.getSkillsStrings();
        skills.forEach((skill, i) => {
            skillBars[i].style.width = skill;
            skillBars[i].innerHTML = skill;
        })
    }

    getFightInfo(): Fight{
        let fight: Fight = new Fight();
        fight.rules = mapStringToEnum<Rules>(getSelectedValue(this.container as HTMLDivElement, CLASS_NAMES.SELECTS.RULES), Rules);
        fight.redCorner = this.currentRedCorner;
        fight.blueCorner = this.currentBlueCorner;

        let winner = mapStringToEnum<Corner>(getCheckedRadioValue(CLASS_NAMES.WINNER_RADIO), Corner);
        let method = mapStringToEnum<Method>(getSelectedValue(this.container as HTMLDivElement, CLASS_NAMES.SELECTS.METHOD), Method);
        let round = parseInt(getSelectedValue(this.container as HTMLDivElement, CLASS_NAMES.SELECTS.ROUND));
        let pick: Result = {
            winner,
            method,
            round,
        }
        fight.yourPick = pick;
        return fight
    }

    addFight(newFight: Fight){
        let message = this.fightCard.addFight(newFight);

        if(message !== Message.Success)
            return showError(message);

        let fightCardDiv = selectElementByClass(this.container, CLASS_NAMES.FIGHT_CARD); 
        let fightTempDiv = selectElementByClass(this.container, CLASS_NAMES.FIGHT_TEMPLATE);
        let fightDiv = fightTempDiv.cloneNode(true) as HTMLElement;

        this.renderFightInformation(fightDiv, newFight);

        this.numberOfFights++;
        fightCardDiv.appendChild(fightDiv);
    }

    private renderFightInformation(fightDiv: HTMLElement, newFight: Fight) {
        let rulesLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.RULES);
        let weightclassLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.WEIGHTCLASS);
        let redCornerImg = selectElementByClass(fightDiv, CLASS_NAMES.IMAGES.RED_CORNER) as HTMLImageElement;
        let blueCornerImg = selectElementByClass(fightDiv, CLASS_NAMES.IMAGES.BLUE_CORNER) as HTMLImageElement;
        let redCornerLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.RED_CORNER);
        let blueCornerLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.BLUE_CORNER);
        let winnerLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.WINNER);
        let methodLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.METHOD);
        let roundLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.ROUND);
        let redCornerOddLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.RED_CORNER_ODD);
        let blueCornerOddLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.BLUE_CORNER_ODD);
        let pickDiv = selectElementByClass(fightDiv, CLASS_NAMES.PICK_DIV);

        rulesLabel.innerHTML = newFight.rules;
        weightclassLabel.innerHTML = newFight.redCorner.weightclass;
        redCornerImg.src = `${PATHS.IMAGES.FIGHTERS + newFight.redCorner.pictureSrc}`;
        blueCornerImg.src = `${PATHS.IMAGES.FIGHTERS + newFight.blueCorner.pictureSrc}`;
        redCornerLabel.innerHTML = newFight.redCorner.name;
        blueCornerLabel.innerHTML = newFight.blueCorner.name;
        winnerLabel.innerHTML = newFight.yourPick.winner;
        methodLabel.innerHTML = newFight.yourPick.method;
        roundLabel.innerHTML = newFight.yourPick.round.toString();

        if (newFight.favourite === Corner.RedCorner) {
            redCornerOddLabel.innerHTML = "Favourite";
            redCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR_FILL);
            blueCornerOddLabel.innerHTML = "Underdog";
            blueCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR);
        }
        else {
            blueCornerOddLabel.innerHTML = "Favourite";
            blueCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR_FILL);
            redCornerOddLabel.innerHTML = "Underdog";
            redCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR);
        }
        if (newFight.yourPick.winner === Corner.RedCorner)
            pickDiv.classList.add(CLASS_NAMES.STYLES.RED_TEXT);

        else
            pickDiv.classList.add(CLASS_NAMES.STYLES.BLUE_TEXT);

        fightDiv.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
        fightDiv.classList.remove(CLASS_NAMES.FIGHT_TEMPLATE);
        fightDiv.classList.add(`${CLASS_NAMES.FIGHT_DIV + this.numberOfFights}`);
    }

    removeFight(fightIndex: number){
        this.fightCard.removeFight(fightIndex);
        let fightDiv = selectElementByClass(this.container, CLASS_NAMES.FIGHT_DIV + fightIndex);
        fightDiv.remove();
        this.updateFightDivsIds(fightIndex, CLASS_NAMES.FIGHT_DIV);
    }

    updateFightDivsIds(fightIndex: number, partOfClassName: string) {
        let fightDivs = selectElementsByPartialClass(this.container, partOfClassName)
        fightDivs.forEach(fightDiv => {
          const classes = fightDiv.className.split(' ');
          const fightClasses = classes.filter(className => className.startsWith(partOfClassName));
          if (fightClasses.length === 1) {
            const currentFightIndex = parseInt(fightClasses[0].substring(partOfClassName.length), 10);
            if (currentFightIndex >= fightIndex) {
              fightDiv.classList.remove(`${partOfClassName}${currentFightIndex}`);
              const newFightIndex = currentFightIndex - 1;
              fightDiv.classList.add(`${partOfClassName}${newFightIndex}`);
            }
          }
        });
      }
}


