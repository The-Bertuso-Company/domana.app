/* app/(tabs)/sell/index.tsx */
import * as React from "react";
import Screen from "@/src/components/Screen";
import { Input, Button, Typography, Divider } from "@/src/components/ds";
import { useToast } from "@/src/components/Toast";

export default function SellScreen() {
  const toast = useToast();
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");

  return (
    <Screen>
      <Typography.H1>Sell</Typography.H1>
      <Divider />
      <Input label="Title" placeholder="e.g. 2BR condo in BGC" value={title} onChangeText={setTitle} />
      <Input label="Price" placeholder="e.g. 8900000" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Button
        title="Continue"
        leftIcon="arrow-forward"
        fullWidth
        onPress={() => toast.show({ title: "Draft created", message: "Add photos next.", icon: "check", variant: "success" })}
      />
    </Screen>
  );
}
