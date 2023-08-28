export const wpHomeURL = {
  alevel: "https://blog.alevelmaths-prep.com",
  asvab: "https://blog.asvabtestpro.com",
  cscs: "https://blog.cscsprep.com",
  cdl: "https://blog.cdl-testpro.com",
  dmv: "https://blog.driving-testpro.com",
  ged: "https://blog.gedtestpro.com",
  hvac: "https://blog.hvacprep.com",
  nclex: "https://blog.nclextestpro.com",
  toeic: "https://blog.toeic-testpro.com",
  ielts: "https://blog.ielts-testpro.com"
}

export type WPPermalinkType = "category/post" | "post"

export const wpPermalinkType: { [appName: string]: WPPermalinkType } = {
  alevel: "category/post",
  asvab: "category/post",
  cscs: "category/post",
  cdl: "post",
  dmv: "post",
  ged: "category/post",
  hvac: "category/post",
  nclex: "category/post",
  toeic: "category/post",
  ielts: "category/post"
}

export const isEnableChildCategory = (appName: string) => {
  if (appName === "toeic") return true;
  return false;
}

export const post_per_page = 6;