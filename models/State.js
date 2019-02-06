import { decorate, observable, action } from "mobx"

class State {

    //attributes
    itemDef= []
    itemSynonyms= ''
    itemExamples= ''
    itemWord= ''
    itemPartOfSpeech= ''
    itemPronunciation= ''
    itemFrequency= ''
    displayRandomWord= 'none'
    displayButtons= 'none'
    displayScrollView= 'none'
    displayWordDefinition= 'none'
    buttonRightIconName= 'controller-next'
    buttonRightIconType= 'entypo'
    buttonRightTitle= "Skip"
    buttonLeftIconName= 'add-to-list'
    buttonLeftIconType='entypo'
    buttonLeftTitle="Add to vocabulary"
    displayChangePrefsBtn= 'none'
    selectedIndex= 0
    startingLettersChecked= false
    endingLettersChecked= false
    realm= null
    startingLettersText= ''
    endingLettersText= ''
    apiUrl= ''
    vocabularyOverlayDisplay= false
    vocabularyWord= ''
    vocabularyPartOfSpeech= ''
    vocabularyDefinition= []
    vocabularyPronunciation= ''
    vocabularyFrequency= ''
    specificWordChecked= false
    specificWordText= ''
    randomWordPrefDisplay= 'flex'
    listOfWords= []
    searchBarValue= ''
    reviewIntroTextDisplay= 'none'
    displayReviewContent= 'none'
    reviewWord= ''
    reviewOverlayDisplay= false
    reviewPronunciation= ''
    reviewFrequency= ''
    reviewDefinition= []
    reviewOriginalId= ''
    partialLettersChecked= false
    partialLettersText= ''
    displayLoadingIndicator= true
    reviewStartingLetter= ''
    reviewEndingLetter= ''
    currentRewiewDefinition= ''
    reviewAnswerText= ''
    showNoVocabulary= false
    showReviewOver= false
    onlyPronunciationWordChecked= false

    //actions
    updateApiUrl = action((apiUrl) => {
        this.apiUrl = apiUrl
    })

    resetResponseData = action(() => {
        this.itemWord= ''
        this.itemPartOfSpeech= ''
        this.itemPronuncitation= ''
        this.itemFrequency= ''
        this.itemDef= []
        this.displayRandomWord= 'none'
        this.displayButtons= 'none'
        this.displayWordDefinition= 'none'
    })

    showLoadingIndicator = action(() => {
        this.displayLoadingIndicator = true
    })

    addResponseData = action((dataGoingToStore) => {
        this.itemWord= dataGoingToStore.word
        this.itemPartOfSpeech= dataGoingToStore.partOfSpeech
        this.itemPronunciation= dataGoingToStore.pronunciation
        this.itemFrequency= dataGoingToStore.frequency
        this.itemDef= dataGoingToStore.definition
        this.displayRandomWord= 'flex'
        this.displayButtons= 'flex'
        this.displayWordDefinition= 'none'
        this.displayScrollView= 'flex'
        this.displayChangePrefsBtn= 'none'
        this.displayLoadingIndicator= false
    })

    displayUpdateChangePrefsBtn = action(() => {
        this.displayChangePrefsBtn= 'flex'
        this.displayButtons= 'none'
        this.displayScrollView= 'none'
        this.displayLoadingIndicator= false
    })
}

decorate(State, {
    itemDef: observable,
    itemSynonyms: observable,
    itemExamples: observable,
    itemWord: observable,
    itemPartOfSpeech: observable,
    itemPronunciation: observable,
    itemFrequency: observable,
    displayRandomWord: observable,
    displayButtons: observable,
    displayScrollView: observable,
    displayWordDefinition: observable,
    buttonRightIconName: observable,
    buttonRightIconType: observable,
    buttonRightTitle: observable,
    buttonLeftIconName: observable,
    buttonLeftIconType: observable,
    buttonLeftTitle: observable,
    displayChangePrefsBtn: observable,
    selectedIndex: observable,
    startingLettersChecked: observable,
    endingLettersChecked: observable,
    realm: observable,
    startingLettersText: observable,
    endingLettersText: observable,
    apiUrl: observable,
    vocabularyOverlayDisplay: observable,
    vocabularyWord: observable,
    vocabularyPartOfSpeech: observable,
    vocabularyDefinition: observable,
    vocabularyPronunciation: observable,
    vocabularyFrequency: observable,
    specificWordChecked: observable,
    specificWordText: observable,
    randomWordPrefDisplay: observable,
    listOfWords: observable,
    searchBarValue: observable,
    reviewIntroTextDisplay: observable,
    displayReviewContent: observable,
    reviewWord: observable,
    reviewOverlayDisplay: observable,
    reviewPronunciation: observable,
    reviewFrequency: observable,
    reviewDefinition: observable,
    reviewOriginalId: observable,
    partialLettersChecked: observable,
    partialLettersText:observable,
    displayLoadingIndicator: observable,
    reviewStartingLetter: observable,
    reviewEndingLetter: observable,
    currentRewiewDefinition: observable,
    reviewAnswerText: observable,
    showNoVocabulary: observable,
    showReviewOver: observable,
    onlyPronunciationWordChecked: observable,
})
const store = new State()

export default store