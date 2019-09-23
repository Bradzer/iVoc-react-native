const AppConstants = Object.freeze({

    PART_OF_SPEECH_ALL_INDEX: 0,
    PART_OF_SPEECH_VERB_INDEX: 1,
    PART_OF_SPEECH_NOUN_INDEX: 2,
    PART_OF_SPEECH_ADJECTIVE_INDEX: 3,
    PART_OF_SPEECH_ADVERB_INDEX: 4,

    LANGUAGE_ENGLISH_INDEX: 0,
    LANGUAGE_FRENCH_INDEX: 1,

    APP_NAME: 'iVoc',
    APP_PRIMARY_COLOR: '#4CAF50',
    APP_PRIMARY_DARK: '#388E3C',
    APP_ACCENT_COLOR: '#69F0AE',
    COLOR_WHITE: '#fff',
    STRING_PREFERENCES: 'Preferences',
    STRING_SIGN_OUT: 'Sign out',
    STRING_START_RANDOM_PRACTICE: 'START RANDOM PRACTICE',
    STRING_REVIEW_MY_VOCABULARY: 'REVIEW MY VOCABULARY',
    STRING_ABOUT: 'About',
    STRING_TAB_HOME: 'Home',
    STRING_TAB_MY_VOCABULARY: 'My Vocabulary',
    STRING_TAB_SETTINGS: 'Settings',
    STRING_PRACTICE: 'Practice',
    STRING_REVIEW: 'Review',
    STRING_SETTINGS: 'Settings',
    STRING_HOME: 'Home',
    TOAST_EXIT_APP: 'Tap back button again to exit',
    STRING_VOC_EMPTY: 'Your vocabulary is empty',
    STRING_REVIEW_OVER: 'The review is over',
    STRING_DEFINITION: 'Definition',
    STRING_WORD_STARTS_WITH_LETTERS: 'The word/expression starts with letters',
    STRING_WORD_ENDS_WITH_LETTERS: 'And ends with letters',
    STRING_WHATS_THE_WORD: `What's the word ?`,
    STRING_CONFIRM: 'Confirm',
    TOAST_NO_VOC: 'You have no vocabulary',
    TOAST_ADD_WORDS_TO_VOC: 'Please add some words/expressions to your vocabulary',
    TOAST_UNEXPECTED_LEAVE: 'You unexpectedly left the review',
    TOAST_WORD_NOT_REMEMBERED: 'The word will be supposed not remembered',
    TOAST_RIGHT_ANSWER: 'right answer ;)',
    TOAST_WRONG_ANSWER: 'You got it wrong :(',
    TOAST_REVIEW_DONE: 'Your vocabulary review is done',
    STRING_VOCABULARY: 'Vocabulary',
    TOAST_SEARCH_NO_RESULT: 'no result',
    TOAST_DELETED: 'deleted',
    TOAST_VOC_LIST_CLEARED: 'vocabulary list cleared',
    TOAST_MULTI_DEL_ON: 'Multi deletion is on',
    TOAST_MULTI_DEL_OFF: 'Multi deletion is off',
    STRING_ALL: 'All',
    STRING_VERB: 'Verb',
    STRING_NOUN: 'Noun',
    STRING_ADJECTIVE: 'Adjective',
    STRING_ADVERB: 'Adverb',
    STRING_STARTING_LETTERS: 'Starting letters',
    STRING_ENTER_STARTING_LETTERS: 'Enter starting letters',
    STRING_ENDING_LETTERS: 'Ending letters',
    STRING_ENTER_ENDING_LETTERS: 'Enter ending letters',
    STRING_CONTAINING_LETTERS: 'Containing letters',
    STRING_ENTER_CONTAINING_LETTERS: 'Enter part of the word/expression',
    STRING_ONLY_PRONUNCIATION: 'Only word/expression with pronunciation',
    STRING_SPECIFIC_WORD: 'Search for a specific word/expression',
    STRING_ENTER_SPECIFIC_WORD: 'Enter the word/expression',
    STRING_CLEAR_VOC: 'Clear vocabulary',
    STRING_LOGIN_ANONYMOUSLY: 'Login anonymously',
    STRING_SIGN_UP: 'Sign up',
    STRING_LOG_IN: 'Log in',
    TOAST_LOG_IN_SUCCESS: 'login successful',
    TOAST_PASSES_DONT_MATCH: `Both passwords don't match`,
    TOAST_ENTER_SAME_PASS: `Please enter same the password`,
    STRING_SEARCH: 'Search...',
    STRING_PRONUNCIATION: 'Pronunciation :',
    STRING_FREQUENCY: 'Frequency :',
    STRING_DEFINITIONS: 'Definitions',
    STRING_CHANGE_PREFS: 'CHANGE RANDOM PRACTICE PREFERENCES',
    STRING_WORDS_DETAILS: 'wordsDetails/',
    STRING_USER_WORDS_DETAILS: '/userWordsDetails',
    STRING_SETTINGS_SCREEN_REALM_PATH: 'settingsScreen',
    STRING_COMMON_URL: 'https://wordsapiv1.p.mashape.com/words/',
    STRING_WORD: 'word',
    STRING_EMPTY: 'empty',
    TOAST_WORD_ADDED_IN_VOC: 'added to vocabulary list',
    TOAST_ALREADY_IN_VOC: 'Word/expression already in vocabulary',
    TOAST_ERROR: 'Oops! An internal error occured :(',
    TOAST_NO_WORD_FOUND: 'No word/expression matching preferences found',
    TOAST_CHANGE_PREFS: 'Please change preferences in settings',
    WORDS_API_KEY: '32512cd1d1mshde2d7da235d7be7p1507d7jsnfe3304948c7b',
    RANDOM_URL: 'https://wordsapiv1.p.mashape.com/words/?&hasDetails=definitions&random=true',
    APP_VERSION: '0.9.3 beta',
    STRING_POWERED_BY: 'Powered by : React-Native',
    STRING_DEVELOPER: 'Developer',
    STRING_DEVELOPER_NAME: 'Bradley Hounkpatin (Bradzer)',
    STRING_EMAIL: 'E-mail',
    STRING_EMAIL_VALUE: 'bradley.hounkpatin@gmail.com',
    STRING_PROJECT_REPO: 'Project repository',
    STRING_PROJECT_REPO_LINK: 'https://github.com/Bradzer/iVoc-react-native',
    STRING_DEVELOPER_GITHUB: 'Developer Github',
    STRING_DEVELOPER_GITHUB_LINK: 'https://github.com/Bradzer',
    STRING_USED_LIBRARIES: 'Show used libraries',
    STRING_BIG_THANKS: 'Big thanks to',
    STRING_AMIROL: '- Amirol Zoclanclounon',
    STRING_KONRAD: '- Konrad Doutetien',
    STRING_ROLAND: '- Roland Houndji',
    STRING_STEEVE: '- Steeve Mamavi',
    STRING_BICAS: '- Bicas Kodja',
    STRING_LEVI: '- Levi Buzolic',
    STRING_FAISAL: '- Faisal Arshed',
    STRING_AXIOS: 'Axios',
    STRING_AXIOS_LINK: 'https://github.com/axios/axios',
    STRING_MOBX: 'MobX',
    STRING_MOBX_LINK: 'https://mobx.js.org/',
    STRING_REACT_NATIVE_ANIMATABLE: 'React Native Animatable',
    STRING_REACT_NATIVE_ANIMATABLE_LINK: 'https://github.com/oblador/react-native-animatable',
    STRING_REACT_NATIVE_ELEMENTS: 'React Native Elements',
    STRING_REACT_NATIVE_ELEMENTS_LINK: 'https://react-native-training.github.io/react-native-elements/',
    STRING_REACT_NATIVE_FIREBASE: 'React Native Firebase',
    STRING_REACT_NATIVE_FIREBASE_LINK: 'https://rnfirebase.io/',
    STRING_REACT_NATIVE_INDICATORS: 'React Native Indicators',
    STRING_REACT_NATIVE_INDICATORS_LINK: 'https://github.com/n4kz/react-native-indicators',
    STRING_REACT_NATIVE_POPUP_MENU: 'React Native Popup Menu',
    STRING_REACT_NATIVE_POPUP_MENU_LINK: 'https://github.com/instea/react-native-popup-menu',
    STRING_REACT_NATIVE_SNACKBAR:'React Native Snackbar',
    STRING_REACT_NATIVE_SNACKBAR_LINK:'https://github.com/cooperka/react-native-snackbar',
    STRING_REACT_NATIVE_VECTOR_ICONS: 'React Native Vector Icons',
    STRING_REACT_NATIVE_VECTOR_ICONS_LINK: 'https://github.com/oblador/react-native-vector-icons',
    STRING_REACT_NAVIGATION: 'React Navigation',
    STRING_REACT_NAVIGATION_LINK: 'http://reactnavigation.org/',
    STRING_REALM: 'Realm',
    STRING_REALM_LINK: 'http://realm.io/',

    STRING_LOREM_IPSUM: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`
})

export default AppConstants;