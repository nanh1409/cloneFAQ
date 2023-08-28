import companyInfo from "../config/company-info.json";
const appName = process.env.NEXT_PUBLIC_APP_NAME;

interface CompanyInfo {
  name: string;
  slug: string;
  locale: string;
}

const useCompanyInfo = (): Array<CompanyInfo> => {
  const _companyInfo = [...(companyInfo as Array<CompanyInfo>)];
  if (appName === "ged") {
    _companyInfo.push({
      name: "Top Most Viewed Articles",
      slug: "/list-of-most-viewed-articles-at-ged-test-pro",
      locale: "en"
    });
  } else if (appName === "toeic") {
    _companyInfo.push({
      name: "Hướng dẫn thanh toán",
      slug: "/payment-methods",
      locale: "vi"
    });
  }
  return _companyInfo;
}

export default useCompanyInfo;