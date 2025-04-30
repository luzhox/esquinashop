import {TamaguiProvider, Text, View, createTamagui} from '@tamagui/core';
import {defaultConfig} from '@tamagui/config/v4';
import {Button} from 'tamagui';
import {SafeAreaView} from 'react-native-safe-area-context';
// import { PermissionsProvider } from './src/providers/Permission';

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig);

type Conf = typeof config;

// make imports typed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default () => {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View
          flex={1}

          style={{
            backgroundColor: 'red',
            alignItems: 'center',
          }}>
          <View
            width={120}
            height={120}
            mb={16}
            style={{backgroundColor: 'blue'}}
          />
          <View>
            <Text color="white">hello world</Text>
          </View>
          <Button theme="blue" m={12}>
            Hello world
          </Button>
        </View>
      </SafeAreaView>
    </TamaguiProvider>
  );
};
