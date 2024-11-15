import { Stack } from 'expo-router';

export default function Tabs(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>
            <Stack.Screen name="login" options={{ headerShown: false}} />
            <Stack.Screen name="forgot" options={{ headerShown: false}} />
            <Stack.Screen name="verify" options={{ headerShown: false}} />
            <Stack.Screen name="updatepass" options={{ headerShown: false}} />
            <Stack.Screen name="home" options={{ headerShown: false}} />
        </Stack>
    );
}
