export const isDMVSubjectName = (subject: string) => {
  return ["dmv-permit", "dmv-motorcycle", "dmv-cdl-permit"].includes(subject)
}