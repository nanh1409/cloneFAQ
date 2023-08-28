import appStyles from "./appStylesGetPro.json";

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const useAppStylesGetPro = () => {
  const appStyle: any = appStyles[appName];
  const appStyleRules = Object.keys(appStyle || {}).map((key) => `--${key}:${appStyle[key]};`).join('');
  return `:root{${appStyleRules}}`;
}

export default useAppStylesGetPro;