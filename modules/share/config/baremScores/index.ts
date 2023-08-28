import {
  BAREM_SCORE_DEFAULT,
  BAREM_SCORE_IELTS,
  BAREM_SCORE_IELTS_GENERAL,
  BAREM_SCORE_SAT_1,
  BAREM_SCORE_SAT_BIO,
  BAREM_SCORE_SAT_CHEMISTRY,
  BAREM_SCORE_SAT_MATH,
  BAREM_SCORE_SAT_PHYSICS,
  BAREM_SCORE_TOEFL,
  BAREM_SCORE_TOEIC
} from "../../constraint";

export default {
  [BAREM_SCORE_DEFAULT]: {
    value: BAREM_SCORE_DEFAULT,
    label: "Mặc định"
  },
  [BAREM_SCORE_TOEIC]: {
    value: BAREM_SCORE_TOEIC,
    label: "TOEIC"
  },
  [BAREM_SCORE_TOEFL]: {
    value: BAREM_SCORE_TOEFL,
    label: "TOEFL"
  },
  [BAREM_SCORE_SAT_MATH]: {
    value: BAREM_SCORE_SAT_MATH,
    label: "SAT - Mathematics"
  },
  [BAREM_SCORE_SAT_BIO]: {
    value: BAREM_SCORE_SAT_BIO,
    label: "SAT - Biology"
  },
  [BAREM_SCORE_SAT_PHYSICS]: {
    value: BAREM_SCORE_SAT_PHYSICS,
    label: "SAT - Physics"
  },
  [BAREM_SCORE_SAT_CHEMISTRY]: {
    value: BAREM_SCORE_SAT_CHEMISTRY,
    label: "SAT - Chemistry"
  },
  [BAREM_SCORE_IELTS]: {
    value: BAREM_SCORE_IELTS,
    label: "IELTS (Academic)"
  },
  [BAREM_SCORE_IELTS_GENERAL]: {
    value: BAREM_SCORE_IELTS_GENERAL,
    label: "IELTS (General)"
  },
  [BAREM_SCORE_SAT_1]: {
    value: BAREM_SCORE_SAT_1,
    label: "SAT 1"
  }
}