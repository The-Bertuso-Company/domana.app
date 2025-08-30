import { Text, View } from "react-native";
import { getFlag } from "../src/flags";
import { useTranslation } from "react-i18next";

export default function SearchScreen() {
  const { t } = useTranslation();
  const enabled = getFlag("SEARCH_TAB_ENABLED");
  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
      <Text>
        {t("search.title")} {enabled ? t("search.enabled") : t("search.disabled")}
      </Text>
    </View>
  );
}
