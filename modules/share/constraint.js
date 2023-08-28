export const GOOGLE_CLOUD_STORAGE_URL = "https://storage.googleapis.com/";
export const GOOGLE_CLOUD_STORAGE_URL_SHORT = "https://storage.googleapis.com";
export const IS_SUPER_ADMIN = true;
export const KEY_CODE = "no_spam_active_code";
export const KEY_ORDER_SECRET = "zWOKp38TGPGicc0bEMyYGQ";

export const TIME_STUDY = 30 * 24 * 60 * 60 * 1000;
export const ONE_TIME_MILLISECOND = 24 * 60 * 60 * 1000;
export const TIME_TRIAL_ONE_DAY = 24 * 60 * 60; //60 * 60

export const IMAGE_TOKEN_START = "@PS@";
export const IMAGE_TOKEN_END = "@PE@";
export const QUESTION_ID_ELEMENT = "question-element-id";
export const QUESTION_ID_ELEMENT_RIGHT = "question-element-id-right";

export const CLASS_GAME_FILL_PARAGRAPH = "table-question";
export const CLASS_GAME_LAYOUT_LEFT_RIGHT = "game-layout-left-right";
export const CLASS_GAME_LAYOUT_TOP_DOWN = "game-layout-top-down";
export const CLASS_GAME_LAYOUT_SCROLL = "paragraph-scroll";
export const CLASS_GAME_SHOW_ANSWER = "answer-table-question";
export const PREFIX_QUESTION_FILL_PARAGRAPH = "q-";

export const CATEGORY_COURSE = 0;
export const CATEGORY_NEWS = 1;
export const CATEGORY_DOCUMENT = 2;
export const CATEGORY_COURSE_COMBO = 3;

export const CATEGORY_POSITION_LANDING_PAGE = 0;
export const CATEGORY_POSITION_MENU = 1;

export const STATUS_DELETED = -1;
export const STATUS_PRIVATE = 0;
export const STATUS_PUBLIC = 1;
export const STATUS_TESTING = 2;
export const STATUS_WAITING = 3;
export const STATUS_OPEN = 4;
export const STATUS_EXPIRED = 5;
export const STATUS_COMING_SOON = 6;

export const EXAM_SCORE_WAITING = 1;
export const EXAM_SCORE_PLAY = 2;
export const EXAM_SCORE_FINISH = 3;
export const EXAM_SCORE_PAUSE = 4;

export const TOPIC_TYPE_CHILD_NONE = 0;
export const TOPIC_TYPE_CHILD_TOPIC = 1;
export const TOPIC_TYPE_CHILD_CARD = 2;
export const TOPIC_TYPE_CHILD_COURSE = 3;
export const TOPIC_TYPE_CHILD_CARD_MAPPING = 4;

export const TOPIC_TYPE_LESSON = 1;
export const TOPIC_TYPE_EXERCISE = 2;
export const TOPIC_TYPE_TEST = 3;
export const TOPIC_TYPE_CATEGORY = 4;
export const TOPIC_TYPE_COURSE = 20;

export const SCENARIO_TYPE_VIDEO = 0;
export const SCENARIO_TYPE_LIVE_STREAM = 1;
export const SCENARIO_TYPE_READING = 2;
export const SCENARIO_TYPE_COACHING = 3;
export const SCENARIO_TYPE_VIRTUAL_CLASSS = 4;
export const SCENARIO_TYPE_EXERCIRE = 5;

export const SCENARIO_CONTENT_TYPE_QUESTION = 0;
export const SCENARIO_CONTENT_TYPE_DOCUMENT = 1;
export const SCENARIO_CONTENT_TYPE_VIDEO = 2;
export const SCENARIO_CONTENT_TYPE_TEXT = 3;
export const SCENARIO_CONTENT_TYPE_AUDIO = 4;
export const SCENARIO_CONFIRM_WATCHED = 10;
export const SCENARIO_CALCULATOR_EXP = 11;
export const SCENARIO_MINUS_FREE = 12;

export const SCENARIO_STATUS_HIDE = -10;
export const SCENARIO_STATUS_PLAY_AGAIN = -2;
export const SCENARIO_STATUS_INIT = -1;
export const SCENARIO_STATUS_SEND_TO_USER = 0;
export const SCENARIO_STATUS_END_PRACTICE = 1;
export const SCENARIO_STATUS_SEND_RESULT_STATISTIC = 2;

export const GEN_CODE_TYPE_ALL = 0;
export const GEN_CODE_TYPE_NUMBER = 1;
export const GEN_CODE_TYPE_CHAR = 2;
export const CodeActiveTypes = Object.freeze({
  ONE: 0, ALL: 1
});

export const NOT_PAYMENT = 0;
export const PAYMENT_MOMO = 1;
export const PAYMENT_VNPAY = 2;
export const PAYMENT_BANK = 3;
export const PAYMENT_COD = 4;
export const PAYMENT_VISA = 5;
export const PAYMENT_PAYPAL = 6;
export const PAYMENT_GIF = 7;
export const PAYMENT_TC_ACELLUS = 8;

export const PAYMENT_STATUS_INIT = 0;
export const PAYMENT_STATUS_SUCCESS = 1;
export const PAYMENT_STATUS_FAILURE = 2;

export const TRANSACTION_NONE = 0;
export const TRANSACTION_SUCCESS = 1;
export const TRANSACTION_WATTING = 2;
export const TRANSACTION_REFUND = 3;
export const TRANSACTION_REPLIED = 4;
export const TRANSACTION_PROCESSING = 5; //5;
export const TRANSACTION_FAILT = 6;

export const COURSE_TYPE_VIDEO_ONLINE = 0;
export const COURSE_TYPE_LIVESTREAM = 1;
export const COURSE_TYPE_QUESTION_BANK = 2;
export const COURSE_TYPE_EXERCISE = 3;
export const COURSE_TYPE_TEST = 4;
export const COURSE_TYPE_DOCUMENT = 5;
export const COURSE_TYPE_SECTION = 6;
export const CourseMarkType = Object.freeze({
  FREE: 0,
  COMMERCIAL: 1
});

export const COURSE_MODE_NORMAL = 0;
export const COURSE_MODE_LOCK = 1;

export const CARD_IS_CHILD = 0;
export const CARD_IS_CHILD_OLD = 2
export const CARD_HAS_CHILD = 1;
export const CARD_NORMAL = 0;

export const GAME_TYPE_PRACTICE = 0;
export const GAME_TYPE_TEST = 1;
export const GAME_TYPE_SCENARIO = 2;
export const GAME_TYPE_FLASH_CARD = 3;
export const GAME_TYPE_MOCK_TEST = 4;

export const GAME_SHOW_RESULT_IMMEDIATELY = 0;
export const GAME_SHOW_RESULT_AFTER = 1;

export const ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
export const ONE_MINUTE_MILLISECONDS = 60 * 1000;
export const DURATION_SECOND = 60;

export const COMBO_TYPE_CREATE_COMBO = 0;
export const COMBO_TYPE_CATEGORY = 1;

export const USER_TYPE_STUDENT = 0;
export const USER_TYPE_HAS_ROLE = 1;

//Quan edit 1

export const USER_STUDY_BOUGHT = 0;
export const USER_STUDY_TRIAL = 1;
export const USER_TEACHER_STUDY = 2;

export const USER_COURSE_REJECT = -1;
export const USER_COURSE_WAITING = 0;
export const USER_COURSE_APPROVE = 1;

export const STUDY_SCORE_DETAIL_SKIP = -2;
export const STUDY_SCORE_DETAIL_NO_STUDY = -1;
export const STUDY_SCORE_DETAIL_CORRECT = 0;
export const STUDY_SCORE_DETAIL_IN_CORRECT = 1;

export const SKILL_TYPE_READING = -100;
export const SKILL_TYPE_LISTENING = -200;
export const SKILL_TYPE_SPEAKING = -300;
export const SKILL_TYPE_WRITING = -400;
export const SKILL_TYPE_MATH = -500;
export const SKILL_TYPE_MATH_CALCULATOR = -501;
export const SKILL_TYPE_WRITING_LANGUAGE = -600;

export const CARD_BOX_NONE = -1;
export const CARD_BOX_ANSWER_INCORRECT = 0;
export const CARD_BOX_NO_ANSWER = 1;
export const CARD_BOX_ANSWER_CORRECT = 2;
export const CARD_BOX_ANSWER_BOOKMARK = 3;

export const CARD_STUDY_ORDER_DEFAULT = 0;
export const CARD_STUDY_ORDER_CORRECT = 1;
export const CARD_STUDY_ORDER_INCORRECT = 2;
export const CARD_STUDY_ORDER_NONE = 3;
export const CARD_STUDY_ORDER_MARKED = 4;

export const TOPIC_CONTENT_TYPE_CARD = 0;
export const TOPIC_CONTENT_TYPE_FILE_PDF = 1;
export const EXAM_TYPE_IELTS = 2;
export const EXAM_TYPE_TOEIC = 3;
export const EXAM_TYPE_TOEFL = 4;
export const EXAM_TYPE_SAT = 5;
export const TOPIC_CONTENT_TYPE_FLASH_CARD = 6;

export const ORDER_NONE = 0;
export const ORDER_SUCCESS = 1;
export const ORDER_WATTING = 2;
export const ORDER_REFUND = 3;
export const ORDER_REPLIED = 4;
export const ORDER_PROCESSING = 5; //5;
export const ORDER_FAILT = 6;

export const CODE_NOT_ACTIVE = 0;
export const CODE_ACTIVED = 1;
export const CODE_EXPIRED = 2;
export const CODE_NOT_MATCH = 3;
export const CODE_NOT_YET_TIME = 4;
export const CODE_ACTIVE_SUCCESS = 5;
export const CODE_ACTIVE_MORE = 6;
export const CODE_ACTIVE_OUT_OF_DATE = 7;

export const ORDER_ERROR_UNKNOWN_REASON = 20;
export const ORDER_NOT_FOUND = 21;
export const ORDER_COMBOS_NOT_FOUND = 22;
export const ORDER_TYPE_RETAIL = 0;
export const ORDER_TYPE_COMBO = 1;
export const ORDER_TYPE_DEALSHOCK = 2;
export const ORDER_TYPE_IN_CATEGORY = 3;
export const ORDER_TYPE_MARK_ASSIGNMENT_RETAIL = 4;
export const ORDER_TYPE_CLUB = 5; // CLASSES MANAGER
export const ORDER_TYPE_EXTEND_CLASSES = 6; // CLASSES MANAGER
export const ORDER_TYPE_ICS_TRIAL_STUDY = 7;
export const ORDER_TYPE_ICS_REGIS_CLASS = 8;
export const ORDER_TYPE_APP_PLAN = 9;



export const OrderItemTypes = Object.freeze({
  COURSE: 0,
  MARK_ASSIGNMENT: 1,
  CLUB: 2
});

export const CATEGORY_DETAIL_PAGE_TYPE = 0;
export const COURSE_DETAIL_PAGE_TYPE = 1;
export const TOPIC_DETAIL_PAGE_TYPE = 2;
export const REPLY_COMMENT_PAGE_TYPE = 3;
export const COURSE_ORDER_PAGE_TYPE = 4;
export const COURSE_PAY_PAGE_TYPE = 5;

export const TOPIC_SETTING_DEFAULT = 0;
export const TOPIC_SETTING_UNIT = 1;

export const BAREM_SCORE_DEFAULT = 0;
export const BAREM_SCORE_TOEIC = 1;
export const BAREM_SCORE_TOEFL = 2;
export const BAREM_SCORE_SAT = 3;
export const BAREM_SCORE_SAT_MATH = 3;
export const BAREM_SCORE_SAT_BIO = 4;
export const BAREM_SCORE_SAT_PHYSICS = 5;
export const BAREM_SCORE_SAT_CHEMISTRY = 6;
export const BAREM_SCORE_IELTS = 7;
export const BAREM_SCORE_IELTS_GENERAL = 8;
export const BAREM_SCORE_SAT_1 = 9;

export const STUDY_SCORE_TYPE_PRACTICE = 0;
export const STUDY_SCORE_TYPE_TEST = 1;

export const GAME_TYPE_USER_REVIEW = 0;
export const GAME_TYPE_TEACHER_REVIEW = 1;

export const USER_ACTIVITY_COURSE = 0;
export const USER_ACTIVITY_LESSON = 1;
export const USER_ACTIVITY_EXERCISE = 2;
export const USER_ACTIVITY_WATCH_VIDEO = 3;
export const USER_ACTIVITY_SEE_DOC = 4;
export const USER_ACTIVITY_PLAY_GAME_PARACTICE = 5;
export const USER_ACTIVITY_PLAY_GAME_TEST = 6;
export const USER_ACTIVITY_ACTIVE_COURSE = 7;
export const USER_ACTIVITY_UPDATE_USER_COURSE = 8;
export const USER_ACTIVITY_COMMENT = 9;
export const USER_ACTIVITY_PLAY_GAME_SCENARIO = 10;

export const LOGIN_FAILED = -1;
export const LOGIN_SUCCESS = 0;
export const LOGIN_ACCOUNT_IS_USED = 1;
export const LOGIN_ACCOUNT_NOT_EXIST = 2;
export const LOGIN_WRONG_PASSWORD = 3;
export const LOGIN_WRONG_PROVIDER = 4;
export const LOGIN_ACCOUNT_NOT_ACTIVATED = 5;
export const LOGIN_MOBILE_IS_USED = 6;
export const LOGIN_USER_NOT_GRANTED_PERMISSION = 7;
export const LOGIN_TOKEN_INVALID = 8;
export const LOGIN_WAIT_FOR_EMAIL_VERIFICATION = 9;
export const LOGIN_TOKEN_EXPIRED = 10;
export const LOGIN_EXCEEDED_DEVICE = 11;
export const UserStatus = Object.freeze({
  NOT_ACTIVATED: -2,
  DELETED: -1,
  NORMAL: 0
});

export const JOIN_CLASS_FAILED = -1;
export const JOIN_CLASS_SUCCESS = 0;
export const JOIN_CLASS_EXIST = 1;
export const JOIN_CLASS_CODE_NOT_EXIST = 2;
export const JOIN_CLASS_WRONG_PASSWORD = 3;

export const MARK_STATUS_INIT = 0;
export const MARK_STATUS_ACCEPTED = 1;
export const MARK_STATUS_MARKED = 2;

export const READ_STATUS = 1;
export const UNREAD_STATUS = 0;

export const REPLY_STATUS = 1;
export const UNREPLY_STATUS = 0;
export const NOTE_STATUS = 2;

export const SCENARIO_VIDEO = 0;
export const SCENARIO_EXERCISE = 1;

export const VIDEO_CONTENT_TYPE_QUESTION = 0;
export const VIDEO_CONTENT_TYPE_DOCUMENT = 1;
export const VIDEO_CONTENT_TYPE_VIDEO = 2;
export const VIDEO_CONTENT_TYPE_TEXT = 3;
export const VIDEO_CONTENT_TYPE_AUDIO = 4;
export const VIDEO_CONTENT_TYPE_BILINGUAL = 5;
export const VIDEO_CONTENT_TYPE_SUBTITLE = 6;
export const VIDEO_CONTENT_TYPE_AUDIO_IN_LIVE = 7;

export const VIDEO_PAUSE_PLAY = 0
export const VIDEO_CONTINUE_PLAY = 1
export const GRADING_STATUS = 1;
export const GRADED_STATUS = 2;

export const SUBTITLE_LANG_NONE = -1;
export const SUBTITLE_LANG_EN = 0;
export const SUBTITLE_LANG_VN = 1;
export const SUBTITLE_LANG_BOTH = 2;

export const CourseEventTypes = Object.freeze({
  DEFAULT: 0,
  LIVE_GAME: 1
});

export const MARK_ASSIGNMENT_LIMIT = 10;
export const MarkAssignmentRequestError = Object.freeze({
  FREE_QUOTA_EXCEEDED: 'E_MarkAssignment_00',
  CREATE_FAILED: 'E_MarkAssignment_01'
});

export const LEVEL_ONE = 1;
export const LEVEL_TWO = 2;
export const LEVEL_THREE = 3;


export const GRAGE_ONE = [1, 2, 3, 4, 5]
export const GRAGE_TWO = [6, 7, 8, 9]
export const GRAGE_THREE = [10, 11, 12]

export const META_ROBOT_NO_INDEX_FOLLOW = 2;
export const META_ROBOT_INDEX_FOLLOW = 1;
export const META_ROBOT_NO_INDEX_NO_FOLLOW = 0;

export const COUPON_DISCOUNT_UNIT_CURRENCY = 0;
export const COUPON_DISCOUNT_UNIT_PERCENT = 1;

export const FINAL_ASSESSMENT_DILIGENCE = 1;
export const FINAL_ASSESSMENT_ATTITUDE = 2;
export const FINAL_ASSESSMENT_ASSIGNMENT = 3;
export const FINAL_ASSESSMENT_PROPOSE = 4;
export const GENERAL_COMMENT = 5;

export const FeedbackTypes = Object.freeze({
  WAITING: 0,
  PROGRESS: 1,
  DONE: 2
});

export const FeedbackRefs = Object.freeze({
  CARD: "card",
  TOPIC: "topic"
});

export const FeedbackTags = Object.freeze({
  INCORRECT_QUESTION: 1,
  INCORRECT_ANSWER: 2,
  IN_APPROPRIATE_CONTENT: 3,
  UNABLE_TO_USE_FEATURES: 4,
  POOR_PROGRESS_TRACKING: 5,
  POOR_INTERFACE: 6
});

export const AppTransactionStatus = Object.freeze({
  PENDING: 0,
  PURCHASED: 1,
  ERROR: 2,
  RESTORED: 3,
  CANCELED: 4
});

export const APP_TRANSACTION_PENDING = 0;
export const APP_TRANSACTION_PURCHASED = 1;
export const APP_TRANSACTION_ERROR = 2;
export const APP_TRANSACTION_RESTORED = 3;
export const APP_TRANSACTION_CANCELED = 4;
