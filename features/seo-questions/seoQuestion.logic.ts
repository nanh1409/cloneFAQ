import slugify from "slugify";
import { HTMLPartToTextPart } from "../../utils/format";

export const getQuestionSlug = (questionText: string, questionId: string) => {
  const fullSlug = slugify(HTMLPartToTextPart(questionText), { replacement: "-", remove: /[*{}+~.()?'"!:@]/g, lower: true, strict: true, locale: "vi" });
  return `${fullSlug.split("-").slice(0, 12).join("-")}-${questionId}`;
}