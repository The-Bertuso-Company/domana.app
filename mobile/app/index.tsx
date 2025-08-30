import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function IndexScreen() {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, alignItems:"center", justifyContent:"center", gap: 12 }}>
      <Text>{t("app.title")}</Text>
      <Link href="/search"><Text>{t("nav.goToSearch")}</Text></Link>
    </View>
  );
}
