import { Link } from 'expo-router';
import { View, Text } from 'react-native';
export default function NotFound() {
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:24}}>
      <Text style={{fontSize:20,marginBottom:12}}>This screen does not exist.</Text>
      <Link href='/' style={{color:'#007aff',fontSize:18}}>Go to home screen!</Link>
    </View>
  );
}
