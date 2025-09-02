import React from "react";
import { View, Text, Button } from "react-native";
import BottomSheet from "../system/BottomSheet";

type Props = { visible: boolean; onClose: () => void; phone?: string; email?: string; whatsapp?: string; };
export default function ContactSheet({ visible, onClose, phone, email, whatsapp }: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>Contact Seller</Text>
      <View style={{ gap: 8 }}>
        {phone ? <Button title={`Call ${phone}`} onPress={onClose} /> : null}
        {phone ? <Button title={`SMS ${phone}`} onPress={onClose} /> : null}
        {whatsapp ? <Button title={`WhatsApp ${whatsapp}`} onPress={onClose} /> : null}
        {email ? <Button title={`Email ${email}`} onPress={onClose} /> : null}
      </View>
    </BottomSheet>
  );
}
