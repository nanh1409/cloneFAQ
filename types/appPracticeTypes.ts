export type MapLocaleString = { [locale: string]: string };

export type MapSlugData = {
  [slug: string]: {
    name: string | MapLocaleString;
    fullName?: string | MapLocaleString;
    shortDescription?: string | MapLocaleString;
    meta?: Array<TestMeta>
    tag?: string;
    tagIndex?: number;
    avatar?: string;
    icon?: string;
    children?: MapSlugData;
  }
}

export type PracticeContent = {
  title: string;
  content: string;
}

export type MapLocalePracticeContent = {
  [locale: string]: PracticeContent;
}

export type LearningStatItem = {
  name: string;
  slug: string;
  flashCard?: boolean;
  subjectType?: boolean;
  expandSubject?: boolean;
};

export type LearningStat = {
  tag: string;
  type: "practice" | "test",
  data: Array<LearningStatItem>
}

export type PracticeDataConfig = {
  seoContent: PracticeContent | MapLocalePracticeContent;
  practiceCourseIndex: number;
  testCourseIndex: number;
  practiceMeta?: Array<Array<TestMeta>>;
  practiceParentSlug: string;
  testParentSlug: string;
  flashCardCourseIndex: number;
  flashCardParentSlug: string;
  groupSlugs?: Array<{
    name: string;
    slugs: string[];
  }>;
  mapSlugData?: MapSlugData;
  mapSubjectCourseIndex: Array<string>;
  mapTagName?: {
    [tag: string]: MapLocaleString | string;
  },
  learningStatData?: Array<LearningStat>;
}

export type TestMeta = {
  name: string;
  value: any;
}

export type DMVSubject = "dmv-permit" | "dmv-motorcycle" | "dmv-cdl-permit";

export type NCLEXSubject = "nclex-rn" | "nclex-pn";
export type NCLEXFlashCardSubject = "nclex-rn-vocabulary" | "nclex-pn-vocabulary";
